const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nameSnapshot: String,
  variantKey: String,
  qty: Number,
  unitPrice: Number,
  subtotal: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  items: [orderItemSchema],
  pricing: {
    subtotal: Number,
    discountTotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    grandTotal: Number
  },
  // Expanded lifecycle: pending -> paid -> processing -> shipped -> delivered (or -> cancelled/refunded)
  status: { type: String, enum: ['pending','paid','processing','shipped','delivered','cancelled','refunded'], default: 'pending', index: true },
  payment: {
    method: String,
    gateway: String,
  intentId: String, // Razorpay order id
  status: String,
  currency: String,
  amount: Number,
  receipt: String,
  paymentId: String,
  signature: String // verification signature after payment success
  },
  shippingAddressSnapshot: {},
  couponCode: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next){ this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Order', orderSchema);
