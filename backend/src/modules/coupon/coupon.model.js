const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true }, // stored uppercase
  discountType: { type: String, enum: ['percent','fixed'], required: true },
  value: { type: Number, required: true }, // percent (0-100) or fixed amount in currency units
  minSubtotal: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startsAt: Date,
  endsAt: Date,
  usageLimit: Number, // total allowed usages
  usageCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
