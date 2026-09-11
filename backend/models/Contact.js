const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  region: {
    type: String,
    default: 'National'
  }
});

module.exports = mongoose.model('Contact', contactSchema);
