const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  zip: String,
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['customer'], index: true },
  name: String,
  phone: String,
  status: { type: String, enum: ['active','blocked'], default: 'active' },
  addresses: { type: [addressSchema], default: [] },
  wishlist: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
