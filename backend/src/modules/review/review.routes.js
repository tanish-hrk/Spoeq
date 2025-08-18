const express = require('express');
const { z } = require('zod');
const { auth, requireRoles } = require('../../middleware/auth');
const Review = require('./review.model');
const Order = require('../order/order.model');
const { emit } = require('../../utils/notify');
const { del: cacheDel } = require('../../utils/cache');
const router = express.Router();

const createSchema = z.object({ productId: z.string(), rating: z.number().min(1).max(5), title: z.string().optional(), body: z.string().optional() });

// Create review (ensure purchased)
router.post('/', auth(true), async (req,res,next)=>{
  try {
    const body = createSchema.parse(req.body);
    const purchased = await Order.exists({ userId: req.user.id, 'items.productId': body.productId });
    if(!purchased) return res.status(400).json({ error: 'Purchase required' });
    const existing = await Review.findOne({ userId: req.user.id, productId: body.productId });
    if(existing) return res.status(409).json({ error: 'Already reviewed' });
  const review = await Review.create({ ...body, userId: req.user.id });
  emit('review.created', { reviewId: review._id.toString(), productId: review.productId.toString(), userId: review.userId.toString(), rating: review.rating });
    res.status(201).json(review);
  } catch(err){ next(err); }
});

// List product reviews (approved only)
router.get('/product/:productId', async (req,res,next)=>{
  try {
    const reviews = await Review.find({ productId: req.params.productId, status: 'approved' }).sort('-createdAt').lean();
    res.json(reviews);
  } catch(err){ next(err); }
});

// Moderate (approve/reject)
const modSchema = z.object({ status: z.enum(['approved','rejected']) });
router.patch('/:id/status', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const { status } = modSchema.parse(req.body);
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if(!review) return res.status(404).json({ error: 'Not found' });
    // Update product rating aggregates
    const Product = require('../catalog/catalog.model');
    if(status === 'approved') {
      // incrementally update
      await Product.updateOne({ _id: review.productId }, [
        { $set: {
          ratingAvg: { $cond: [ { $gt: ['$ratingCount', 0] }, { $divide: [ { $add: [ { $multiply: ['$ratingAvg', '$ratingCount'] }, review.rating ] }, { $add: ['$ratingCount', 1] } ] }, review.rating ] },
          ratingCount: { $add: ['$ratingCount', 1] }
        } }
      ]).catch(async ()=> {
        // fallback: full recompute
        const approved = await Review.find({ productId: review.productId, status: 'approved' });
        const total = approved.reduce((a,r)=> a + r.rating, 0);
        await Product.updateOne({ _id: review.productId }, { ratingAvg: approved.length? total/approved.length:0, ratingCount: approved.length });
      });
    } else if(status === 'rejected') {
      // recompute fully since removing one rating
      const approved = await Review.find({ productId: review.productId, status: 'approved' });
      const total = approved.reduce((a,r)=> a + r.rating, 0);
      await Product.updateOne({ _id: review.productId }, { ratingAvg: approved.length? total/approved.length:0, ratingCount: approved.length });
    }
  // invalidate product cache
  await cacheDel('product:' + review.productId);
  await cacheDel('products:');
    res.json(review);
  } catch(err){ next(err); }
});

module.exports = router;
