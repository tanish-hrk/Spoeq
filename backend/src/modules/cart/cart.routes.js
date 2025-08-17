const express = require('express');
const { z } = require('zod');
const { auth } = require('../../middleware/auth');
const Cart = require('./cart.model');
const Product = require('../catalog/catalog.model');
const router = express.Router();

// Get cart
router.get('/', auth(true), async (req,res,next)=>{
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).lean();
    res.json(cart || { items: [] });
  } catch(err){ next(err); }
});

const addSchema = z.object({ productId: z.string(), qty: z.number().int().positive(), variantKey: z.string().optional() });
router.post('/', auth(true), async (req,res,next)=>{
  try {
    const body = addSchema.parse(req.body);
    const product = await Product.findById(body.productId).lean();
    if(!product) return res.status(404).json({ error: 'Product not found' });
    let cart = await Cart.findOne({ userId: req.user.id });
    if(!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    const existing = cart.items.find(i => i.productId.toString() === body.productId && i.variantKey === body.variantKey);
    if (existing) existing.qty += body.qty; else cart.items.push({ productId: body.productId, qty: body.qty, variantKey: body.variantKey, priceSnapshot: product.price?.sale });
    await cart.save();
    res.status(201).json(cart);
  } catch(err){ next(err); }
});

const updateSchema = z.object({ qty: z.number().int().positive() });
router.patch('/:productId', auth(true), async (req,res,next)=>{
  try {
    const { qty } = updateSchema.parse(req.body);
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if(!cart) return res.status(404).json({ error: 'Cart empty' });
    const item = cart.items.find(i => i.productId.toString() === productId);
    if(!item) return res.status(404).json({ error: 'Item not in cart' });
    item.qty = qty;
    await cart.save();
    res.json(cart);
  } catch(err){ next(err); }
});

router.delete('/:productId', auth(true), async (req,res,next)=>{
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if(!cart) return res.status(404).json({ error: 'Cart empty' });
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch(err){ next(err); }
});

const couponSchema = z.object({ code: z.string() });
router.post('/apply-coupon', auth(true), async (req,res,next)=>{
  try {
    const { code } = couponSchema.parse(req.body);
    let cart = await Cart.findOne({ userId: req.user.id });
    if(!cart) return res.status(404).json({ error: 'Cart empty' });
    // compute subtotal
    const ids = cart.items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const map = {}; products.forEach(p=> map[p._id.toString()] = p);
    let subtotal = 0;
    cart.items.forEach(i => { const p = map[i.productId.toString()]; const price = p?.price?.sale || 0; subtotal += price * i.qty; });
    const Coupon = require('../coupon/coupon.model');
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if(!coupon) return res.status(404).json({ error: 'Invalid coupon' });
    const now = new Date();
    if(!coupon.active || (coupon.startsAt && coupon.startsAt > now) || (coupon.endsAt && coupon.endsAt < now) || (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) || subtotal < (coupon.minSubtotal||0)) {
      return res.status(400).json({ error: 'Coupon not applicable' });
    }
    cart.couponCode = coupon.code;
    await cart.save();
    let discount = coupon.discountType === 'percent' ? subtotal * (coupon.value/100) : coupon.value;
    discount = Math.min(discount, subtotal);
    res.json({ message: 'Coupon applied', cart, discount, subtotal, grandTotal: subtotal - discount });
  } catch(err){ next(err); }
});

module.exports = router;
