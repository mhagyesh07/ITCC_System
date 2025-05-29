const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true },
  subIssue: { type: String },
  priority: { type: String, enum: ['low', 'med', 'high', 'critical'], required: true },
  description: { type: String, maxlength: 200, required: true },
  status: { type: String, enum: ['open','closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  adminComment: { type: String, maxlength: 500 }, // Added adminComment field to the schema
});

module.exports = mongoose.model('Ticket', ticketSchema);