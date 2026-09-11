const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET all emergency contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new emergency contact
router.post('/', async (req, res) => {
  try {
    const { name, department, phone, region } = req.body;
    const newContact = new Contact({ name, department, phone, region });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
