const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  attr: { type: Map, of: String },
  sku: String,
  stock: { type: Number, default: 0 },
  priceOverride: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  categories: { type: [String], index: true },
  brand: { type: String, index: true },
  description: String,
  specs: { type: Map, of: String },
  images: [String],
  price: {
    mrp: Number,
    sale: Number
  },
  stock: { type: Number, default: 0 },
  sku: String,
  variants: [variantSchema],
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next){ this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Product', productSchema);
// Text index (ensure created once)
productSchema.index({ name: 'text', description: 'text' });
