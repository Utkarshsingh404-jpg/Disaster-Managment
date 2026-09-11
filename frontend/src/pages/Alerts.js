import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [liveAlerts, setLiveAlerts] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [checkedAt, setCheckedAt] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');

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

  const checkNearMe = () => {
    setLiveError('');
    setLiveAlerts([]);

    if (!navigator.geolocation) {
      setLiveError('Geolocation is not supported by your browser.');
      return;
    }

    setLiveLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationLabel(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);

        try {
          const res = await axios.get(`${API_BASE_URL}/api/live-alerts`, {
            params: { lat: latitude, lon: longitude }
          });
          setLiveAlerts(res.data.alerts || []);
          setCheckedAt(res.data.checkedAt);
        } catch (err) {
          setLiveError('Could not check live alerts. Backend might be waking up, try again in a few seconds.');
        } finally {
          setLiveLoading(false);
        }
      },
      (err) => {
        setLiveLoading(false);
        setLiveError('Location permission denied. Please allow location access to check nearby alerts.');
      }
    );
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

      {/* Live location-based check */}
      <div className="live-check-box">
        <button className="btn btn-primary" onClick={checkNearMe} disabled={liveLoading}>
          {liveLoading ? 'Checking your area...' : '📍 Check Alerts Near Me'}
        </button>
        {locationLabel && (
          <p className="live-meta">Checked near: {locationLabel}{checkedAt && ` • ${new Date(checkedAt).toLocaleTimeString()}`}</p>
        )}
        {liveError && <p className="error-text">{liveError}</p>}
      </div>

      {liveAlerts.length > 0 && (
        <div className="alerts-list" style={{ marginBottom: '40px' }}>
          {liveAlerts.map((alert, idx) => (
            <div className="alert-card" key={`live-${idx}`}>
              <div className="alert-header">
                <h3>{alert.title}</h3>
                <span
                  className="severity-badge"
                  style={{ backgroundColor: severityColor(alert.severity) }}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="alert-type">{alert.type} &bull; Source: {alert.source}</p>
              <p>{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {locationLabel && !liveLoading && liveAlerts.length === 0 && !liveError && (
        <p className="live-clear-msg">✅ No active disaster conditions detected near you right now.</p>
      )}

      <h2 className="section-heading">Posted Alerts</h2>

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
