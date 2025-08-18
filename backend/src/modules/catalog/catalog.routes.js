const express = require('express');
const { z } = require('zod');
const Product = require('./catalog.model');
const { auth, requireRoles } = require('../../middleware/auth');
const { get: cacheGet, set: cacheSet, del: cacheDel } = require('../../utils/cache');
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
  const cacheKey = 'products:' + JSON.stringify(q);
  const cached = await cacheGet(cacheKey);
  if(cached) return res.json(JSON.parse(cached));
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
    let findQuery = Product.find(filter);
    if (q.search) {
      // ensure score projection when using text search
      findQuery = findQuery.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    } else if (q.sort) {
      const sortFields = q.sort.split(',').join(' ');
      findQuery = findQuery.sort(sortFields);
    } else {
      findQuery = findQuery.sort('-createdAt');
    }
    const total = await Product.countDocuments(filter);
    const items = await findQuery.skip((page-1)*limit).limit(limit).lean();
  const payload = { page, limit, total, items, totalPages: Math.ceil(total/limit) };
  await cacheSet(cacheKey, JSON.stringify(payload), 60);
  res.json(payload);
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
  await cacheDel('products:');
    res.status(201).json(product);
  } catch(err){ next(err); }
});

router.get('/:id', async (req,res,next)=>{
  try {
  const cacheKey = 'product:' + req.params.id;
  const cached = await cacheGet(cacheKey);
  if(cached) return res.json(JSON.parse(cached));
  const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Not found' });
  await cacheSet(cacheKey, JSON.stringify(product), 120);
  res.json(product);
  } catch(err){ next(err); }
});

const updateSchema = createSchema.partial();
router.patch('/:id', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const body = updateSchema.parse(req.body);
    if (body.slug) {
      const exists = await Product.findOne({ slug: body.slug, _id: { $ne: req.params.id } });
      if (exists) return res.status(409).json({ error: 'Slug already exists' });
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    if(!updated) return res.status(404).json({ error: 'Not found' });
  await cacheDel('products:');
  await cacheDel('product:' + req.params.id);
    res.json(updated);
  } catch(err){ next(err); }
});

router.delete('/:id', auth(true), requireRoles('admin'), async (req,res,next)=>{
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if(!deleted) return res.status(404).json({ error: 'Not found' });
  await cacheDel('products:');
  await cacheDel('product:' + req.params.id);
    res.json({ message: 'Deleted' });
  } catch(err){ next(err); }
});

module.exports = router;
