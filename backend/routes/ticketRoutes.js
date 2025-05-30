/**
 * @file ticketRoutes.js
 * @description Defines API routes for managing support tickets.
 * @module routes/ticketRoutes
 */

const express = require('express');
const Ticket = require('../models/Ticket');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route POST /api/tickets/
 * @description Creates a new support ticket.
 * The `employeeId` in the request body should match the authenticated user's ID,
 * or be set server-side based on `req.user.id`.
 * @access Private (Requires authentication via JWT - `protect` middleware)
 * @param {object} req.body - Request body for the new ticket.
 * @param {string} req.body.employeeId - ID of the employee creating the ticket (should match `req.user.id`).
 * @param {string} req.body.issueType - Type of issue.
 * @param {string} [req.body.subIssue] - Sub-category of the issue.
 * @param {string} req.body.priority - Priority of the ticket (e.g., 'low', 'med', 'high', 'critical').
 * @param {string} req.body.description - Detailed description of the issue.
 * @param {string} [req.body.status='open'] - Initial status of the ticket.
 * @returns {object} 201 - Success response with the created ticket object.
 * @returns {object} 400 - Error response if required fields are missing or data is invalid.
 * @returns {object} 401 - Error response if not authenticated.
 * @example
 * req.body = {
 *   "employeeId": "605c724f1c9d440000a1b2c3", // Should match authenticated user or be set by backend
 *   "issueType": "Hardware",
 *   "subIssue": "Laptop Keyboard",
 *   "priority": "high",
 *   "description": "My laptop keyboard is not working.",
 *   "status": "open"
 * }
 */
router.post('/', protect, async (req, res) => {
  try {
    // Ensure the employeeId in the ticket matches the authenticated user
    // or set it based on the authenticated user.
    const ticketData = { ...req.body, employeeId: req.user.id };
    const ticket = new Ticket(ticketData);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(400).json({ error: 'Failed to create ticket: ' + error.message });
  }
});

/**
 * @route GET /api/tickets/
 * @description Retrieves tickets.
 * If the user is an admin, all tickets are returned.
 * If the user is not an admin, only tickets created by that user are returned.
 * Supports pagination and sorting.
 * @access Private (Requires authentication via JWT - `protect` middleware)
 * @middleware protect
 * @param {object} req.query - Query parameters.
 * @param {number} [req.query.limit=10] - Maximum number of tickets to return.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {string} [req.query.sort='createdAt:desc'] - Sort order (e.g., 'createdAt:asc', 'priority:desc').
 * @todo Differentiate access: Admins see all, users see their own. Currently, it fetches all for any authenticated user.
 *       This needs logic to check `req.user.role` and filter by `employeeId: req.user.id` if not admin.
 * @returns {object} 200 - Success response with an array of ticket objects.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 500 - Error response if an error occurs while fetching tickets.
 */
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'createdAt:desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let queryFilter = {};
    // @todo: Implement role-based filtering here
    // if (req.user.role !== 'admin') {
    //   queryFilter.employeeId = req.user.id;
    // }

    const tickets = await Ticket.find(queryFilter)
      .populate('employeeId', 'name email dept designation') // Populate with selected fields
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalTickets = await Ticket.countDocuments(queryFilter);

    res.status(200).json({
      tickets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTickets / parseInt(limit)),
      totalTickets,
    });
  } catch (error) {
    console.error("Get all tickets error:", error);
    res.status(500).json({ error: 'Failed to retrieve tickets: ' + error.message });
  }
});

/**
 * @route PUT /api/tickets/:id/comment
 * @description Adds or updates an admin comment on a specific ticket.
 * @access Private (Should be Admin only - `protectAdmin` middleware)
 * @middleware protect
 * @todo Add `protectAdmin` middleware.
 * @param {string} req.params.id - The ID of the ticket to update.
 * @param {object} req.body - Request body.
 * @param {string} req.body.adminComment - The comment text from the admin.
 * @returns {object} 200 - Success response with a message and the updated ticket.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 403 - Error response if not authorized (not an admin).
 * @returns {object} 404 - Error response if the ticket is not found.
 * @returns {object} 500 - Error response if an error occurs.
 */
router.put('/:id/comment', protect, /* protectAdmin, */ async (req, res) => {
  try {
    const { adminComment } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { adminComment },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Admin comment updated successfully', ticket });
  } catch (error) {
    console.error("Update admin comment error:", error);
    res.status(500).json({ error: 'Failed to update admin comment: ' + error.message });
  }
});

/**
 * @route GET /api/tickets/:id
 * @description Retrieves a specific ticket by its ID.
 * Users can only retrieve their own tickets unless they are an admin.
 * @access Private (Requires authentication via JWT - `protect` middleware)
 * @middleware protect
 * @param {string} req.params.id - The ID of the ticket to retrieve.
 * @todo Implement logic: if not admin, check if `ticket.employeeId` matches `req.user.id`.
 * @returns {object} 200 - Success response with the ticket object.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 403 - Error response if user is not authorized to view the ticket.
 * @returns {object} 404 - Error response if the ticket is not found.
 * @returns {object} 500 - Error response if an error occurs.
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
                           .populate('employeeId', 'name email dept designation'); // Populate with specific fields

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // @todo: Authorization check:
    // if (req.user.role !== 'admin' && ticket.employeeId._id.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized to view this ticket' });
    // }

    // The department was already included in the populate above.
    // No need for the manual manipulation of ticket.employeeId if populate is used effectively.
    // if (ticket.employeeId) {
    //   ticket.employeeId = {
    //     ...ticket.employeeId.toObject(),
    //     department: ticket.employeeId.dept, // This is redundant if 'dept' is populated
    //   };
    // }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Get specific ticket error:", error);
    res.status(500).json({ error: 'Failed to fetch ticket: ' + error.message });
  }
});

/**
 * @route PUT /api/tickets/:id/close
 * @description Closes a specific ticket by updating its status to 'Closed'.
 * @access Private (Requires authentication. Should ideally be Admin or ticket owner)
 * @middleware protect
 * @todo Implement authorization: Allow admin or the employee who owns the ticket.
 * @param {string} req.params.id - The ID of the ticket to close.
 * @returns {object} 200 - Success response with a message and the updated ticket.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 403 - Error response if user is not authorized to close the ticket.
 * @returns {object} 404 - Error response if the ticket is not found.
 * @returns {object} 500 - Error response if an error occurs.
 */
router.put('/:id/close', protect, async (req, res) => {
  try {
    // @todo: Add authorization check here (admin or ticket owner)
    // const ticketToClose = await Ticket.findById(req.params.id);
    // if (!ticketToClose) return res.status(404).json({ error: 'Ticket not found' });
    // if (req.user.role !== 'admin' && ticketToClose.employeeId.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized to close this ticket' });
    // }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' }, // Ensure status matches enum in model ('closed')
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email');

    if (!ticket) { // Should have been caught by findById above if implemented
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket closed successfully', ticket });
  } catch (error) {
    console.error("Close ticket error:", error);
    res.status(500).json({ error: 'Failed to close ticket: ' + error.message });
  }
});

/**
 * @route GET /api/tickets/admin-only
 * @description Example admin-only route to get all tickets without filtering.
 * Demonstrates usage of `protectAdmin` middleware.
 * @access Private (Admin only - `protect` and `protectAdmin` middleware)
 * @middleware protect
 * @middleware protectAdmin
 * @returns {object} 200 - Success response with an array of all ticket objects.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 403 - Error response if not an admin.
 * @returns {object} 500 - Error response if an error occurs.
 */
router.get('/admin-only', protect, protectAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('employeeId', 'name email');
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Admin-only get tickets error:", error);
    res.status(500).json({ error: 'Failed to retrieve tickets for admin: ' + error.message });
  }
});

/**
 * @route GET /api/tickets/employee/:employeeId
 * @description Retrieves all tickets for a specific employee by their ID.
 * This route could be used by an admin to view a specific employee's tickets,
 * or by an employee to view their own tickets if `employeeId` matches `req.user.id`.
 * @access Private (Requires authentication - `protect` middleware)
 * @middleware protect
 * @param {string} req.params.employeeId - The ID of the employee whose tickets are to be retrieved.
 * @todo Add authorization: Allow admin to see any employee's tickets,
 *       or employee to see only their own tickets (i.e., `req.params.employeeId` must match `req.user.id`).
 * @returns {object} 200 - Success response with an array of ticket objects for the specified employee.
 * @returns {object} 401 - Error response if not authenticated.
 * @returns {object} 403 - Error response if not authorized.
 * @returns {object} 500 - Error response if an error occurs.
 */
router.get('/employee/:employeeId', protect, async (req, res) => {
  try {
    // @todo: Authorization check
    // if (req.user.role !== 'admin' && req.params.employeeId !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized to view these tickets' });
    // }

    console.log('Fetching tickets for employee ID:', req.params.employeeId);
    const tickets = await Ticket.find({ employeeId: req.params.employeeId })
                                .populate('employeeId', 'name email dept');
    console.log('Tickets fetched:', tickets);

    if (!tickets) { // tickets will be an empty array if none found, not null/undefined
        return res.status(200).json([]); // Return empty array if no tickets found
    }
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Get employee tickets error:", error);
    res.status(500).json({ error: 'Failed to fetch tickets for the employee: ' + error.message });
  }
});

module.exports = router;
