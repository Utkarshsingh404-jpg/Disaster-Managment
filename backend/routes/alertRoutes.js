const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET all alerts (newest first)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new alert
router.post('/', async (req, res) => {
  try {
    const { title, description, disasterType, severity, location } = req.body;
    const newAlert = new Alert({ title, description, disasterType, severity, location });
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an alert by id
router.delete('/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
