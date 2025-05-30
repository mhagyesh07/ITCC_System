/**
 * @file User.js
 * @description Defines the Mongoose schema for the User model.
 * Includes fields for user details, authentication, and roles.
 * Also includes a pre-save hook for password hashing.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef {object} UserSchemaDef
 * @property {string} name - The full name of the user. (Required)
 * @property {string} dept - The department the user belongs to. (Required)
 * @property {string} designation - The user's designation or job title. (Required)
 * @property {string} email - The user's email address. Must be unique, lowercase, and trimmed. (Required)
 * @property {string} contactNumber - The user's contact phone number. (Required)
 * @property {string} employeeNumber - The user's unique employee identification number. (Required)
 * @property {string} role - The role of the user within the system. Enum: ['employee', 'admin']. (Required)
 * @property {string} password - The user's hashed password for authentication. (Required)
 * @property {Date} createdAt - Timestamp of when the user was created. (Automatically managed by Mongoose due to `timestamps: true`)
 * @property {Date} updatedAt - Timestamp of when the user was last updated. (Automatically managed by Mongoose due to `timestamps: true`)
 */

/**
 * Mongoose schema for Users.
 * @type {mongoose.Schema<UserSchemaDef>}
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dept: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  employeeNumber: { type: String, required: true, unique: true, trim: true },
  role: { type: String, enum: ['employee', 'admin'], required: true },
  password: { type: String, required: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * @description Mongoose pre-save middleware to hash the user's password before saving.
 * This function is automatically called before a 'save' operation on a User document.
 * It only hashes the password if it has been modified (or is new).
 * @param {import('mongoose').NextFunction} next - Callback function to proceed to the next middleware or save operation.
 * @this {import('mongoose').Document & UserSchemaDef} User document instance.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // console.log('Plain text password before hashing:', this.password); // For debugging, remove in production
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // console.log('Hashed password:', this.password); // For debugging, remove in production
    return next();
  } catch (error) {
    return next(error); // Pass errors to the next middleware/error handler
  }
});

/**
 * User Model, based on the userSchema.
 * @type {mongoose.Model<UserSchemaDef>}
 */
module.exports = mongoose.model('User', userSchema);