const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  rating: { type: Number, min:1, max:5, required: true },
  title: String,
  body: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
