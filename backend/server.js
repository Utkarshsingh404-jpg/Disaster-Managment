const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const alertRoutes = require('./routes/alertRoutes');
const contactRoutes = require('./routes/contactRoutes');
const Alert = require('./models/Alert'); // Alert Model Import

const app = express();

app.use(cors());
app.use(express.json());

// Existing Manual Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/contacts', contactRoutes);

// 1. LIVE WEATHER ROUTE
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'Delhi';
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API Key missing in environment variables' });
    }

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    res.json({
      location: weatherRes.data.name,
      temp: weatherRes.data.main.temp,
      condition: weatherRes.data.weather[0].main,
      description: weatherRes.data.weather[0].description,
      humidity: weatherRes.data.main.humidity,
      windSpeed: weatherRes.data.wind.speed
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 2. AUTOMATIC WEATHER ALERT GENERATOR
app.get('/api/check-weather-alert', async (req, res) => {
  try {
    const city = req.query.city || 'Delhi';
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API Key missing' });
    }

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const condition = weatherRes.data.weather[0].main;
    const temp = weatherRes.data.main.temp;
    const desc = weatherRes.data.weather[0].description;

    // Severe conditions detection logic
    const severeConditions = ['Rain', 'Thunderstorm', 'Snow', 'Extreme', 'Squall', 'Tornado'];
    const isExtremeTemp = temp > 43 || temp < 3;

    if (severeConditions.includes(condition) || isExtremeTemp) {
      // Duplicate alert check (so same alert won't spam DB within same location)
      const existingAlert = await Alert.findOne({
        location: city,
        title: { $regex: condition, $options: 'i' }
      });

      if (!existingAlert) {
        const newAlert = await Alert.create({
          title: `Automatic ${condition} Alert`,
          description: `Severe condition detected in ${city}: ${desc}. Current Temp: ${temp}°C. Stay safe!`,
          location: city,
          priority: condition === 'Thunderstorm' || condition === 'Tornado' ? 'High' : 'Medium'
        });

        return res.json({ 
          status: 'ALERT_CREATED', 
          message: `Auto alert generated for ${city}`, 
          alert: newAlert 
        });
      }

      return res.json({ status: 'ALERT_EXISTS', message: 'Alert already active for this city' });
    }

    res.json({ status: 'NORMAL', message: `Weather in ${city} is clear. No alert needed.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate weather alert' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Disaster Management Backend Active');
});

// Database connection & server startup
const PORT = process.env.PORT || 5500;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/disaster_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
