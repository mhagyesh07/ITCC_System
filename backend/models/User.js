const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  employeeNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['employee', 'admin'], required: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified

  console.log('Plain text password before hashing during signup:', this.password);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Hashed password during signup:', this.password);
  next();
});

module.exports = mongoose.model('User', userSchema);