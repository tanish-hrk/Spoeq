const express = require('express');
const { z } = require('zod');
const Product = require('./catalog.model');
const { auth, requireRoles } = require('../../middleware/auth');
const router = express.Router();

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().regex(/^[0-9]+$/).optional(),
  maxPrice: z.string().regex(/^[0-9]+$/).optional(),
  page: z.string().regex(/^[0-9]+$/).optional(),
  limit: z.string().regex(/^[0-9]+$/).optional(),
  sort: z.string().optional()
});

router.get('/', async (req,res,next)=>{
  try {
    const q = querySchema.parse(req.query);
    const page = parseInt(q.page || '1');
    const limit = Math.min(parseInt(q.limit || '20'), 100);
    const filter = {};
    if (q.category) filter.categories = q.category;
    if (q.brand) filter.brand = q.brand;
    if (q.search) filter.$text = { $search: q.search };
    if (q.minPrice || q.maxPrice) {
      filter['price.sale'] = {};
      if (q.minPrice) filter['price.sale'].$gte = Number(q.minPrice);
      if (q.maxPrice) filter['price.sale'].$lte = Number(q.maxPrice);
    }
    let cursor = Product.find(filter);
    if (q.sort) {
      const sortFields = q.sort.split(',').join(' ');
      cursor = cursor.sort(sortFields);
    } else {
      cursor = cursor.sort('-createdAt');
    }
    const total = await Product.countDocuments(filter);
    const items = await cursor.skip((page-1)*limit).limit(limit).lean();
    res.json({ page, limit, total, items });
  } catch(err){ next(err); }
});

const createSchema = z.object({
  name: z.string(),
  slug: z.string(),
  categories: z.array(z.string()).optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  specs: z.record(z.string()).optional(),
  images: z.array(z.string()).optional(),
  price: z.object({ mrp: z.number(), sale: z.number() }),
  stock: z.number().int().nonnegative(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional()
});

router.post('/', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const body = createSchema.parse(req.body);
    const exists = await Product.findOne({ slug: body.slug });
    if (exists) return res.status(409).json({ error: 'Slug already exists' });
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch(err){ next(err); }
});

router.get('/:id', async (req,res,next)=>{
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch(err){ next(err); }
});

module.exports = router;
