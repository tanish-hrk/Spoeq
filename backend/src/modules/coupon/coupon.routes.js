const express = require('express');
const { z } = require('zod');
const Coupon = require('./coupon.model');
const { auth, requireRoles } = require('../../middleware/auth');
const router = express.Router();

const baseSchema = z.object({
  code: z.string().toUpperCase(),
  discountType: z.enum(['percent','fixed']),
  value: z.number().positive(),
  minSubtotal: z.number().nonnegative().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional(),
  active: z.boolean().optional()
});

router.post('/', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const data = baseSchema.parse(req.body);
    const exists = await Coupon.findOne({ code: data.code });
    if(exists) return res.status(409).json({ error: 'Code exists' });
    const coupon = await Coupon.create(data);
    res.status(201).json(coupon);
  } catch(err){ next(err); }
});

router.get('/', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try { const list = await Coupon.find().sort('-createdAt').lean(); res.json(list); } catch(err){ next(err); }
});

router.patch('/:id', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const data = baseSchema.partial().parse(req.body);
    if(data.code){
      const exists = await Coupon.findOne({ code: data.code, _id: { $ne: req.params.id } });
      if(exists) return res.status(409).json({ error: 'Code exists' });
    }
    const updated = await Coupon.findByIdAndUpdate(req.params.id, data, { new: true });
    if(!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch(err){ next(err); }
});

router.delete('/:id', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try { const deleted = await Coupon.findByIdAndDelete(req.params.id); if(!deleted) return res.status(404).json({ error: 'Not found' }); res.json({ message: 'Deleted' }); } catch(err){ next(err); }
});

// Public validation (user applying to cart); returns discount preview if valid
router.post('/validate', auth(true), async (req,res,next)=>{
  try {
    const schema = z.object({ code: z.string() , subtotal: z.number().nonnegative() });
    const { code, subtotal } = schema.parse(req.body);
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if(!coupon) return res.status(404).json({ error: 'Invalid coupon' });
    const now = new Date();
    if(!coupon.active) return res.status(400).json({ error: 'Inactive coupon' });
    if(coupon.startsAt && coupon.startsAt > now) return res.status(400).json({ error: 'Not started' });
    if(coupon.endsAt && coupon.endsAt < now) return res.status(400).json({ error: 'Expired' });
    if(coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return res.status(400).json({ error: 'Usage limit reached' });
    if(subtotal < (coupon.minSubtotal || 0)) return res.status(400).json({ error: 'Subtotal too low' });
    let discount = coupon.discountType === 'percent' ? (subtotal * (coupon.value/100)) : coupon.value;
    discount = Math.min(discount, subtotal);
    res.json({ valid: true, discount, code: coupon.code });
  } catch(err){ next(err); }
});

module.exports = router;
