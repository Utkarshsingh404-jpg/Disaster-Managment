import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://disaster-managment-zn27.onrender.com';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/alerts`);
      setAlerts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Could not load alerts. Make sure the backend server is running.');
      setLoading(false);
    }
  };

  const severityColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      default: return '#65a30d';
    }
  };

  return (
    <div className="page">
      <h1>Disaster Alerts</h1>
      <p className="page-subtitle">Latest updates on ongoing disasters and warnings</p>

      {loading && <p>Loading alerts...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && alerts.length === 0 && (
        <p>No alerts right now. Stay safe!</p>
      )}

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div className="alert-card" key={alert._id}>
            <div className="alert-header">
              <h3>{alert.title}</h3>
              <span
                className="severity-badge"
                style={{ backgroundColor: severityColor(alert.severity) }}
              >
                {alert.severity}
              </span>
            </div>
            <p className="alert-type">{alert.disasterType} &bull; {alert.location}</p>
            <p>{alert.description}</p>
            <p className="alert-date">
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;
