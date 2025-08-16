const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantKey: String,
  qty: { type: Number, required: true, min: 1 },
  priceSnapshot: Number
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  items: { type: [cartItemSchema], default: [] },
  couponCode: String,
  updatedAt: { type: Date, default: Date.now }
});

cartSchema.pre('save', function(next){ this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Cart', cartSchema);
