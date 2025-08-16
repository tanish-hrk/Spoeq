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
    // Placeholder: real coupon validation later
    let cart = await Cart.findOne({ userId: req.user.id });
    if(!cart) return res.status(404).json({ error: 'Cart empty' });
    cart.couponCode = code;
    await cart.save();
    res.json({ message: 'Coupon applied', cart });
  } catch(err){ next(err); }
});

module.exports = router;
