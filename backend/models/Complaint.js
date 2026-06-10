const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Professor', 'Hostel', 'Cafeteria', 'Internet', 'Classroom', 'Transport', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);