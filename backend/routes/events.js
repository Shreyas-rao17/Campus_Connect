const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error('❌ Error creating event:', err);
    res.status(500).json({ 
      message: 'Error creating event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

// PUT /api/events/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (err) {
    console.error('❌ Error updating event:', err);
    res.status(500).json({ 
      message: 'Error updating event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting event:', err);
    res.status(500).json({ 
      message: 'Error deleting event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

module.exports = router;
