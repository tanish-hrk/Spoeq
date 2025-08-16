require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../modules/auth/auth.model');

async function run(){
  const uri = process.env.MONGO_URI;
  if(!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  const email = process.env.ADMIN_EMAIL || 'admin@spoeq.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  let admin = await User.findOne({ email });
  if(admin) {
    console.log('Admin exists:', email);
  } else {
    const hash = await bcrypt.hash(password, 12);
    admin = await User.create({ email, passwordHash: hash, name: 'Admin', roles:['admin'] });
    console.log('Admin created:', email);
  }
  await mongoose.disconnect();
  console.log('Done');
}
run().catch(e=>{ console.error(e); process.exit(1); });
