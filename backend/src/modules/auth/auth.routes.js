const express = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const User = require('./auth.model');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

function signTokens(user){
  const access = jwt.sign({ sub: user._id, roles: user.roles }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' });
  const refresh = jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });
  return { access, refresh };
}

router.post('/register', async (req,res,next)=>{
  try {
    const body = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(body.password, 12);
    const user = await User.create({ email: body.email, passwordHash: hash, name: body.name });
    const tokens = signTokens(user);
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, roles: user.roles }, tokens });
  } catch(err){ next(err); }
});

router.post('/login', async (req,res,next)=>{
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(body.password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'blocked') return res.status(403).json({ error: 'Account blocked' });
    const tokens = signTokens(user);
    res.json({ user: { id: user._id, email: user.email, name: user.name, roles: user.roles }, tokens });
  } catch(err){ next(err); }
});

router.post('/refresh', async (req,res,next)=>{
  try {
    const body = refreshSchema.parse(req.body);
    try {
      const payload = jwt.verify(body.refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(payload.sub);
      if(!user) return res.status(401).json({ error: 'Invalid token' });
      const tokens = signTokens(user);
      res.json({ tokens });
    } catch(err){
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch(err){ next(err); }
});

router.post('/logout', (req,res)=>{
  // Stateless JWT: client just drops tokens. Optionally maintain denylist.
  res.json({ message: 'Logged out' });
});

// Profile (basic)
router.get('/me', auth(true), async (req,res,next)=>{
  try {
    const user = await User.findById(req.user.id).lean();
    if(!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user._id, email: user.email, name: user.name, roles: user.roles, addresses: user.addresses });
  } catch(err){ next(err); }
});

const addressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  isDefault: z.boolean().optional()
});

router.post('/me/addresses', auth(true), async (req,res,next)=>{
  try {
    const body = addressSchema.parse(req.body);
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ error: 'Not found' });
    if(body.isDefault) user.addresses.forEach(a=> a.isDefault = false);
    user.addresses.push(body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch(err){ next(err); }
});

router.patch('/me/addresses/:idx', auth(true), async (req,res,next)=>{
  try {
    const body = addressSchema.partial().parse(req.body);
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ error: 'Not found' });
    const idx = parseInt(req.params.idx,10);
    if (idx < 0 || idx >= user.addresses.length) return res.status(404).json({ error: 'Address not found' });
    if(body.isDefault) user.addresses.forEach(a=> a.isDefault = false);
    Object.assign(user.addresses[idx], body);
    await user.save();
    res.json(user.addresses);
  } catch(err){ next(err); }
});

router.delete('/me/addresses/:idx', auth(true), async (req,res,next)=>{
  try {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({ error: 'Not found' });
    const idx = parseInt(req.params.idx,10);
    if (idx < 0 || idx >= user.addresses.length) return res.status(404).json({ error: 'Address not found' });
    user.addresses.splice(idx,1);
    await user.save();
    res.json(user.addresses);
  } catch(err){ next(err); }
});

module.exports = router;
