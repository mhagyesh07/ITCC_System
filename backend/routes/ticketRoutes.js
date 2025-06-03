const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new ticket (protected)
router.post('/', protect, async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    const validationErrors = Object.keys(error.errors || {}).map(
      (key) => `${key} is required.`
    );
    res.status(400).json({ error: validationErrors.join(' '), duration: 5000 });
  }
});

// Get all tickets
router.get('/', protect, async (req, res) => {
  try {
    const { limit, sort } = req.query;
    const query = Ticket.find().populate('employeeId');

    if (sort) query.sort(sort);
    if (limit) query.limit(parseInt(limit));

    const tickets = await query;
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin comment
router.put('/:id/comment', protect, async (req, res) => {
  try {
    const { adminComment } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { adminComment },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ message: 'Admin comment updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update admin comment' });
  }
});

// Get specific ticket
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('employeeId');
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (ticket.employeeId) {
      ticket.employeeId = {
        ...ticket.employeeId.toObject(),
        department: ticket.employeeId.dept,
      };
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Close ticket
router.put('/:id/close', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed' },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ message: 'Ticket closed successfully', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});

// Admin-only route example
router.get('/admin-only', protect, protectAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tickets for a specific employee
router.get('/employee/:id', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ employeeId: req.params.id });
    if (!tickets.length) {
      return res.status(404).json({ error: 'No tickets found for the specified employee.' });
    }
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets for employee:', error);
    res.status(500).json({ error: 'Failed to fetch tickets for the employee.' });
  }
});

module.exports = router;
