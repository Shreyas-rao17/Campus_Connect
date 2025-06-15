// models/Notice.js

const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Body content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: {
      values: ['academic', 'cultural', 'placement', 'event', 'other'],
      message: '{VALUE} is not a valid category'
    },
    default: 'other'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Posted by is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', NoticeSchema);
