const express = require('express');
const { z } = require('zod');
const { auth } = require('../../middleware/auth');
const Order = require('./order.model');
const Cart = require('../cart/cart.model');
const Product = require('../catalog/catalog.model');
const mongoose = require('mongoose');
const router = express.Router();
const { emit } = require('../../utils/notify');
const { requireRoles } = require('../../middleware/auth');

// Draft order from cart
router.post('/', auth(true), async (req,res,next)=>{
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).lean();
    if(!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart empty' });
    // Recompute pricing
    const productMap = {};
    const ids = cart.items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    products.forEach(p => { productMap[p._id.toString()] = p; });
    let subtotal = 0;
    const items = cart.items.map(i => {
      const p = productMap[i.productId.toString()];
      const unitPrice = p?.price?.sale || 0;
      const line = { productId: i.productId, nameSnapshot: p?.name, variantKey: i.variantKey, qty: i.qty, unitPrice, subtotal: unitPrice * i.qty };
      subtotal += line.subtotal;
      return line;
    });
    const pricing = { subtotal, discountTotal: 0, tax: 0, shipping: 0, grandTotal: subtotal };
    // apply coupon if exists on cart
    let couponCode = cart.couponCode;
    if (couponCode) {
      const Coupon = require('../coupon/coupon.model');
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon) {
        const now = new Date();
        const applicable = coupon.active && (!coupon.startsAt || coupon.startsAt <= now) && (!coupon.endsAt || coupon.endsAt >= now) && (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) && subtotal >= (coupon.minSubtotal||0);
        if(applicable){
          let discount = coupon.discountType === 'percent' ? subtotal * (coupon.value/100) : coupon.value;
          discount = Math.min(discount, subtotal);
          pricing.discountTotal = discount;
          pricing.grandTotal = subtotal - discount;
        } else {
          couponCode = undefined; // ignore invalid
        }
      } else { couponCode = undefined; }
    }
  const order = await Order.create({ userId: req.user.id, items, pricing, status: 'pending', couponCode });
    res.status(201).json(order);
  } catch(err){ next(err); }
});

// List user orders
router.get('/', auth(true), async (req,res,next)=>{
  try {
    const orders = await Order.find({ userId: req.user.id }).sort('-createdAt').lean();
    res.json(orders);
  } catch(err){ next(err); }
});

// Admin: list all orders (paginated minimal) & counts
router.get('/admin/all', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const page = parseInt(req.query.page||'1');
    const limit = Math.min(parseInt(req.query.limit||'50'), 200);
    const filter = {};
    if(req.query.status) filter.status = req.query.status;
    const total = await Order.countDocuments(filter);
    const items = await Order.find(filter).sort('-createdAt').skip((page-1)*limit).limit(limit).lean();
    const statusAgg = await Order.aggregate([{ $group: { _id: '$status', count: { $sum:1 } } }]);
    res.json({ page, limit, total, totalPages: Math.ceil(total/limit), items, statusCounts: statusAgg });
  } catch(err){ next(err); }
});

// Get order by id (own)
router.get('/:id', auth(true), async (req,res,next)=>{
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if(!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch(err){ next(err); }
});

// Razorpay order creation (payment intent)
router.post('/:id/create-payment-intent', auth(true), async (req,res,next)=>{
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if(!order) return res.status(404).json({ error: 'Not found' });
    if(order.status !== 'pending') return res.status(400).json({ error: 'Order not pending' });
    const Razorpay = require('razorpay');
    const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const amountPaise = Math.round(order.pricing.grandTotal * 100); // in paise
    const receipt = 'ord_'+order._id.toString();
    const rzpOrder = await instance.orders.create({ amount: amountPaise, currency: 'INR', receipt });
    order.payment = {
      method: 'card',
      gateway: 'razorpay',
      intentId: rzpOrder.id,
      status: rzpOrder.status,
      currency: rzpOrder.currency,
      amount: rzpOrder.amount,
      receipt: rzpOrder.receipt
    };
    await order.save();
    res.json({ orderId: order._id, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch(err){ next(err); }
});

// Verify payment signature & capture inventory
router.post('/verify', auth(true), async (req,res,next)=>{
  try {
    const schema = z.object({
      orderId: z.string(), // our internal order id
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string()
    });
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = schema.parse(req.body);
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if(!order) return res.status(404).json({ error: 'Not found' });
    if(order.status !== 'pending') return res.status(400).json({ error: 'Order not pending' });
    if(order.payment?.intentId !== razorpay_order_id) return res.status(400).json({ error: 'Mismatched Razorpay order id' });
    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if(generatedSignature !== razorpay_signature) return res.status(400).json({ error: 'Invalid signature' });
    // Atomic inventory decrement
    let usedTransaction = false;
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      usedTransaction = true;
      for (const item of order.items) {
        const resUpdate = await Product.updateOne({ _id: item.productId, stock: { $gte: item.qty } }, { $inc: { stock: -item.qty } }).session(session);
        if(resUpdate.modifiedCount === 0) throw new Error('Insufficient stock');
      }
      order.status = 'paid';
      order.payment.status = 'paid';
      order.payment.signature = razorpay_signature;
      order.payment.paymentId = razorpay_payment_id;
      if(order.couponCode){
        const Coupon = require('../coupon/coupon.model');
        await Coupon.updateOne({ code: order.couponCode }, { $inc: { usageCount: 1 } }).session(session);
      }
      await order.save({ session });
      await session.commitTransaction();
  emit('order.paid', { orderId: order._id.toString(), userId: order.userId.toString(), total: order.pricing.grandTotal });
  return res.json({ success: true, orderId: order._id, transactional: true });
    } catch(e){
      if(usedTransaction) { try { await session.abortTransaction(); } catch(_){} }
      // Fallback non-transactional for standalone Mongo (e.g., memory server)
      if(e.message && e.message.includes('Transaction numbers are only allowed')) {
        for (const item of order.items) {
          const resUpdate = await Product.updateOne({ _id: item.productId, stock: { $gte: item.qty } }, { $inc: { stock: -item.qty } });
          if(resUpdate.modifiedCount === 0) return res.status(400).json({ error: 'Insufficient stock' });
        }
        order.status = 'paid';
        order.payment.status = 'paid';
        order.payment.signature = razorpay_signature;
        order.payment.paymentId = razorpay_payment_id;
        if(order.couponCode){
          const Coupon = require('../coupon/coupon.model');
          await Coupon.updateOne({ code: order.couponCode }, { $inc: { usageCount: 1 } });
        }
        await order.save();
  emit('order.paid', { orderId: order._id.toString(), userId: order.userId.toString(), total: order.pricing.grandTotal });
  return res.json({ success: true, orderId: order._id, transactional: false });
      }
      return res.status(400).json({ error: e.message });
    } finally { if(session) session.endSession(); }
  } catch(err){ next(err); }
});

// (Optional) Razorpay webhook endpoint for asynchronous events (e.g., refunds)
router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), async (req,res,next)=>{
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if(!secret) return res.status(501).json({ error: 'Webhook secret not configured' });
    const crypto = require('crypto');
    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    if(expected !== signature) return res.status(400).json({ error: 'Invalid signature' });
    const event = JSON.parse(req.body.toString());
    // Handle limited set of events
    if(event.event === 'payment.refunded'){ /* TODO: mark refund in order history */ }
    res.json({ received: true });
  } catch(err){ next(err); }
});

module.exports = router;

// --- Admin / user status transitions ---
// Move paid -> processing -> shipped -> delivered
router.post('/:id/advance', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ error: 'Not found' });
    const flow = ['paid','processing','shipped','delivered'];
    const idx = flow.indexOf(order.status);
    if(idx === -1 || idx === flow.length-1) return res.status(400).json({ error: 'Cannot advance from current state' });
    order.status = flow[idx+1];
    await order.save();
    res.json(order);
  } catch(err){ next(err); }
});

// User cancel before paid OR admin cancel if not shipped
router.post('/:id/cancel', auth(true), async (req,res,next)=>{
  try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ error: 'Not found' });
    const isOwner = order.userId.toString() === req.user.id;
    if(isOwner && order.status !== 'pending') return res.status(400).json({ error: 'Cannot cancel now' });
    if(!isOwner && !req.user.roles.includes('admin')) return res.status(403).json({ error: 'Forbidden' });
    if(!isOwner && req.user.roles.includes('admin') && ['shipped','delivered','refunded'].includes(order.status)) return res.status(400).json({ error: 'Cannot cancel after shipment' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch(err){ next(err); }
});

// Admin refund (stub; real flow would integrate payment gateway refund API)
router.post('/:id/refund', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ error: 'Not found' });
    if(order.status !== 'paid' && order.status !== 'delivered') return res.status(400).json({ error: 'Not refundable' });
    order.status = 'refunded';
    await order.save();
    res.json(order);
  } catch(err){ next(err); }
});
