require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../modules/catalog/catalog.model');

async function run(){
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  console.log('Connected');
  const sample = [
    { name: 'Premium Yoga Mat', slug: 'premium-yoga-mat', categories: ['fitness'], brand: 'Flexi', description: 'High grip eco-friendly mat', price: { mrp: 99.99, sale: 79.99 }, stock: 120, sku: 'YM-FLEXI-001', tags:['yoga','mat'] },
    { name: 'Smart Fitness Watch', slug: 'smart-fitness-watch', categories: ['wearables'], brand: 'FitPulse', description: 'Track workouts and health metrics', price: { mrp: 199.99, sale: 149.99 }, stock: 75, sku: 'WATCH-FP-100', tags:['watch','smart'] },
    { name: 'Pro Basketball', slug: 'pro-basketball', categories: ['team-sports'], brand: 'HoopPro', description: 'Indoor/outdoor composite leather', price: { mrp: 39.99, sale: 29.99 }, stock: 200, sku: 'BALL-HP-500', tags:['basketball'] },
    { name: 'Training Dumbbells Set', slug: 'training-dumbbells-set', categories: ['strength'], brand: 'IronEdge', description: 'Adjustable dumbbells pair', price: { mrp: 109.99, sale: 89.99 }, stock: 40, sku: 'DB-IE-SET', tags:['dumbbells','strength'] }
  ];
  for (const p of sample){
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists){
      await Product.create(p);
      console.log('Inserted', p.slug);
    } else {
      console.log('Skip existing', p.slug);
    }
  }
  await mongoose.disconnect();
  console.log('Done');
}
run().catch(e=>{ console.error(e); process.exit(1); });
