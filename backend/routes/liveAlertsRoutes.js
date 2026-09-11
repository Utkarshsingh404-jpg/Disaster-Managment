const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/live-alerts?lat=..&lon=..
// Checks real-time weather (OpenWeatherMap) and recent earthquakes (USGS)
// near the given coordinates and returns a combined list of alerts.
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'lat and lon query params are required' });
  }

  const results = [];

  // ---------- 1. Weather-based alerts (OpenWeatherMap) ----------
  try {
    const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 8000
    });

    const w = weatherRes.data;
    const conditionId = w.weather?.[0]?.id;
    const conditionMain = w.weather?.[0]?.main;
    const temp = w.main?.temp;
    const windSpeed = w.wind?.speed; // m/s
    const rainVolume = w.rain?.['1h'] || 0; // mm in last hour

    // Thunderstorm / tornado / squall codes (see OpenWeatherMap condition codes)
    if (conditionId >= 200 && conditionId < 300) {
      results.push({
        type: 'Storm',
        severity: conditionId >= 210 ? 'High' : 'Medium',
        title: `Thunderstorm Alert - ${w.name || 'Your Area'}`,
        description: `${conditionMain} conditions detected nearby. Stay indoors and avoid open areas.`,
        source: 'OpenWeatherMap'
      });
    }

    if (conditionId === 781) {
      results.push({
        type: 'Tornado',
        severity: 'Critical',
        title: `Tornado Warning - ${w.name || 'Your Area'}`,
        description: 'Tornado activity detected in your area. Seek shelter immediately.',
        source: 'OpenWeatherMap'
      });
    }

    if (typeof temp === 'number' && temp >= 42) {
      results.push({
        type: 'Heatwave',
        severity: temp >= 47 ? 'Critical' : 'High',
        title: `Extreme Heat Warning - ${w.name || 'Your Area'}`,
        description: `Current temperature is ${temp}°C. Stay hydrated and avoid direct sun exposure.`,
        source: 'OpenWeatherMap'
      });
    }

    if (typeof temp === 'number' && temp <= 0) {
      results.push({
        type: 'Cold Wave',
        severity: temp <= -10 ? 'High' : 'Medium',
        title: `Cold Wave Alert - ${w.name || 'Your Area'}`,
        description: `Current temperature is ${temp}°C. Risk of frostbite/hypothermia in prolonged exposure.`,
        source: 'OpenWeatherMap'
      });
    }

    if (typeof windSpeed === 'number' && windSpeed >= 20) {
      results.push({
        type: 'High Winds',
        severity: windSpeed >= 30 ? 'Critical' : 'High',
        title: `High Wind Alert - ${w.name || 'Your Area'}`,
        description: `Wind speeds of ${windSpeed} m/s detected. Secure loose objects outdoors.`,
        source: 'OpenWeatherMap'
      });
    }

    if (rainVolume >= 7.6) {
      results.push({
        type: 'Heavy Rain',
        severity: rainVolume >= 15 ? 'High' : 'Medium',
        title: `Heavy Rainfall Alert - ${w.name || 'Your Area'}`,
        description: `${rainVolume}mm rainfall in the last hour. Risk of local flooding.`,
        source: 'OpenWeatherMap'
      });
    }
  } catch (err) {
    console.log('Weather API error:', err.message);
  }

  // ---------- 2. Earthquake alerts (USGS - free, no API key needed) ----------
  try {
    const endTime = new Date().toISOString();
    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // last 7 days

    const quakeRes = await axios.get('https://earthquake.usgs.gov/fdsnws/event/1/query', {
      params: {
        format: 'geojson',
        latitude: lat,
        longitude: lon,
        maxradiuskm: 300,
        starttime: startTime,
        endtime: endTime,
        minmagnitude: 4,
        orderby: 'time'
      },
      timeout: 8000
    });

    const quakes = quakeRes.data?.features || [];
    quakes.slice(0, 5).forEach((quake) => {
      const mag = quake.properties.mag;
      const place = quake.properties.place;
      const time = new Date(quake.properties.time).toLocaleString();

      results.push({
        type: 'Earthquake',
        severity: mag >= 6 ? 'Critical' : mag >= 5 ? 'High' : 'Medium',
        title: `Magnitude ${mag} Earthquake`,
        description: `${place} - occurred on ${time}`,
        source: 'USGS'
      });
    });
  } catch (err) {
    console.log('USGS API error:', err.message);
  }

  res.json({
    checkedAt: new Date().toISOString(),
    count: results.length,
    alerts: results
  });
});

module.exports = router;
