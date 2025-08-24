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
  // Legacy roles array (kept for compatibility with requireRoles)
  roles: { type: [String], default: ['customer'], index: true },
  // Primary single role for RBAC
  role: { type: String, enum: ['owner','admin','manager','support','editor','analyst','customer'], default: 'customer', index: true },
  // Access flags for limited admin permissions (owner/admin get all true by default)
  access: { 
    type: {
      products: { type: Boolean, default: false },
      categories: { type: Boolean, default: false },
      inventory: { type: Boolean, default: false },
      orders: { type: Boolean, default: false },
      coupons: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false },
      reviews: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
      content: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      settings: { type: Boolean, default: false }
    },
    default: function(){
      const base = { products:false,categories:false,inventory:false,orders:false,coupons:false,promotions:false,reviews:false,customers:false,content:false,analytics:false,settings:false };
      const all = Object.fromEntries(Object.keys(base).map(k=>[k,true]));
      const map = {
        owner: all,
        admin: all,
        manager: { ...base, products:true, categories:true, inventory:true, orders:true, coupons:true, promotions:true, reviews:true, customers:true, analytics:true },
        support: { ...base, orders:true, customers:true, reviews:true },
        editor: { ...base, products:true, categories:true, content:true },
        analyst: { ...base, analytics:true },
        customer: base
      };
      return map[this.role || 'customer'] || base;
    }
  },
  name: String,
  phone: String,
  status: { type: String, enum: ['active','blocked'], default: 'active' },
  addresses: { type: [addressSchema], default: [] },
  wishlist: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },
  refreshTokens: { type: [String], default: [] }, // hashed (or raw if short-lived) refresh tokens for rotation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next){
  this.updatedAt = new Date();
  // keep roles array in sync with primary role
  if(this.role && Array.isArray(this.roles)){
    if(!this.roles.includes(this.role)) this.roles.push(this.role);
    // de-duplicate
    this.roles = Array.from(new Set(this.roles));
  } else if (!this.role && Array.isArray(this.roles) && this.roles.length){
    // if role missing, infer from roles precedence
    const order = ['owner','admin','manager','support','editor','analyst','customer'];
    const found = order.find(r => this.roles.includes(r));
    if(found) this.role = found;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
