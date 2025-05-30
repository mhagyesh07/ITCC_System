const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Signup route
router.post('/', async (req, res) => {
  const { email, employeeNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { employeeNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or employee number already exists.' });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ ...req.body, password: password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the account.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No account found with this email.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = generateToken(user._id);
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

// Get profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;