/**
 * @file Ticket.js
 * @description Defines the Mongoose schema for the Ticket model.
 * Represents a support ticket created by an employee.
 */

const mongoose = require('mongoose');

/**
 * @typedef {object} TicketSchemaDef
 * @property {mongoose.Schema.Types.ObjectId} employeeId - Reference to the User (employee) who created the ticket. (Required)
 * @property {string} issueType - The general category of the issue. (Required)
 * @property {string} [subIssue] - A more specific sub-category of the issue. (Optional)
 * @property {string} priority - The priority level of the ticket. Enum: ['low', 'med', 'high', 'critical']. (Required)
 * @property {string} description - Detailed description of the issue. Maximum 200 characters. (Required)
 * @property {string} status - The current status of the ticket. Enum: ['open', 'closed', 'pending', 'resolved']. Default: 'open'.
 * @property {string} [adminComment] - Comments or notes added by an admin. Maximum 500 characters. (Optional)
 * @property {Date} createdAt - Timestamp of when the ticket was created. (Automatically managed by Mongoose)
 * @property {Date} updatedAt - Timestamp of when the ticket was last updated. (Automatically managed by Mongoose)
 */

/**
 * Mongoose schema for Tickets.
 * @type {mongoose.Schema<TicketSchemaDef>}
 */
const ticketSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true, trim: true },
  subIssue: { type: String, trim: true },
  priority: { type: String, enum: ['low', 'med', 'high', 'critical'], required: true },
  description: { type: String, maxlength: 200, required: true, trim: true },
  status: { type: String, enum: ['open', 'closed', 'pending', 'resolved'], default: 'open' },
  adminComment: { type: String, maxlength: 500, trim: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * Ticket Model, based on the ticketSchema.
 * @type {mongoose.Model<TicketSchemaDef>}
 */
module.exports = mongoose.model('Ticket', ticketSchema);