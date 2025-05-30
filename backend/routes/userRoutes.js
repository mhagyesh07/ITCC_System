const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { protect, protectAdmin } = require('../middleware/authMiddleware'); // Assuming protectAdmin might be used here later

const router = express.Router();

/**
 * @file userRoutes.js
 * @description Defines API routes for user authentication (signup, login) and user management.
 * @module routes/userRoutes
 */

/**
 * Generates a JSON Web Token (JWT) for a given user ID and role.
 * The token includes the user's ID and role, and expires in 1 hour.
 *
 * @function generateToken
 * @param {string} userId - The ID of the user for whom the token is generated.
 * @param {string} userRole - The role of the user.
 * @returns {string} The generated JWT.
 */
const generateToken = (userId, userRole) =>
  jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

/**
 * @route POST /api/users/
 * @description Registers a new user (Signup).
 * Creates a new user document in the database. Password hashing is handled by the User model's pre-save hook.
 * @access Public
 * @param {object} req.body - Request body.
 * @param {string} req.body.name - User's name.
 * @param {string} req.body.dept - User's department.
 * @param {string} req.body.designation - User's designation.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.contactNumber - User's contact number.
 * @param {string} req.body.employeeNumber - User's employee number.
 * @param {string} req.body.role - User's role (e.g., 'employee', 'admin').
 * @param {string} req.body.password - User's plain text password.
 * @returns {object} 201 - Success response with a welcome message and JWT token.
 * @returns {object} 400 - Error response if email or employee number already exists.
 * @returns {object} 500 - Error response if an error occurs during account creation.
 * @example
 * req.body = {
 *   "name": "John Doe",
 *   "dept": "IT",
 *   "designation": "Software Engineer",
 *   "email": "john.doe@example.com",
 *   "contactNumber": "1234567890",
 *   "employeeNumber": "EMP123",
 *   "role": "employee",
 *   "password": "password123"
 * }
 */
router.post('/', async (req, res) => {
  const { email, employeeNumber, password } = req.body; // Password is used here but hashing is in model

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { employeeNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or employee number already exists.' });
    }

    // Password hashing is handled by the User model's pre-save hook.
    // The plain password from req.body.password is passed to the model.
    const user = new User({ ...req.body }); // password is part of req.body
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { // Send back some user info, excluding password
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: 'An error occurred while creating the account.' });
  }
});

/**
 * @route POST /api/users/login
 * @description Logs in an existing user.
 * Verifies email and password, then returns a JWT token upon successful authentication.
 * @access Public
 * @param {object} req.body - Request body.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's plain text password.
 * @returns {object} 200 - Success response with a message, JWT token, and user's role.
 * @returns {object} 400 - Error response for invalid email or password (generic message).
 * @returns {object} 404 - Error response if no account is found with the provided email.
 * @returns {object} 500 - Error response if an error occurs during login.
 * @example
 * req.body = {
 *   "email": "john.doe@example.com",
 *   "password": "password123"
 * }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Generic error message for security
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { // Send back some user info, excluding password
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

/**
 * @route GET /api/users/profile
 * @description Retrieves the profile of the currently authenticated user.
 * The user is identified by the JWT token processed by the `protect` middleware.
 * @access Private (Requires authentication via JWT)
 * @middleware protect - Ensures the user is authenticated.
 * @returns {object} 200 - Success response with the user's profile information (password excluded).
 * @returns {object} 401 - Error response if not authenticated (handled by `protect` middleware).
 * @returns {object} 404 - Error response if the user associated with the token is not found.
 * @returns {object} 500 - Error response if an error occurs while fetching the profile.
 */
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user is populated by the 'protect' middleware and contains the decoded JWT payload (id, role)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

/**
 * @route GET /api/users/
 * @description Retrieves a list of all users. Password field is excluded.
 * @access Private (Ideally Admin only)
 * @todo Add `protect` and `protectAdmin` middleware to restrict access to administrators.
 * @returns {object} 200 - Success response with an array of user objects.
 * @returns {object} 500 - Error response if an error occurs while fetching users.
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: 'Failed to retrieve users: ' + error.message });
  }
});

module.exports = router;