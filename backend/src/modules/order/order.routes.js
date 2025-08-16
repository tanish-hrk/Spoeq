const express = require('express');
const { z } = require('zod');
const { auth } = require('../../middleware/auth');
const Order = require('./order.model');
const Cart = require('../cart/cart.model');
const Product = require('../catalog/catalog.model');
const mongoose = require('mongoose');
const router = express.Router();

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
  const order = await Order.create({ userId: req.user.id, items, pricing, status: 'pending' });
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const item of order.items) {
        const resUpdate = await Product.updateOne({ _id: item.productId, stock: { $gte: item.qty } }, { $inc: { stock: -item.qty } }).session(session);
        if(resUpdate.modifiedCount === 0) throw new Error('Insufficient stock');
      }
      order.status = 'paid';
      order.payment.status = 'paid';
      order.payment.signature = razorpay_signature;
      await order.save({ session });
      await session.commitTransaction();
      res.json({ success: true, orderId: order._id });
    } catch(e){
      await session.abortTransaction();
      return res.status(400).json({ error: e.message });
    } finally { session.endSession(); }
  } catch(err){ next(err); }
});

module.exports = router;
