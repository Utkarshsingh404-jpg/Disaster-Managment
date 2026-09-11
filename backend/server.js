const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // APK files serve karne ke liye

// Routes
const alertRoutes = require('./routes/alertRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/alerts', alertRoutes);
app.use('/api/contacts', contactRoutes);

// APK download route
app.get('/api/download-apk', (req, res) => {
  const filePath = __dirname + '/uploads/app.apk';
  res.download(filePath, 'DisasterManagementApp.apk');
});

// Test route
app.get('/', (req, res) => {
  res.send('Disaster Management API running...');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
