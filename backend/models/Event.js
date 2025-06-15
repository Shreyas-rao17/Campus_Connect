const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  allDay: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['academic', 'cultural', 'placement', 'other'],
    default: 'other'
  },
  location: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
