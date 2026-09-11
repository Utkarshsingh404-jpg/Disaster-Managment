import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Disaster Management System</h1>
        <p className="hero-subtitle">
          Real-time alerts, emergency contacts, and our mobile app —
          everything you need to stay safe during a disaster.
        </p>
        <div className="hero-buttons">
          <Link to="/download" className="btn btn-primary">Download App</Link>
          <Link to="/alerts" className="btn btn-secondary">View Alerts</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📱 Mobile App</h3>
          <p>Download our Android app for instant disaster alerts on the go.</p>
        </div>
        <div className="feature-card">
          <h3>🚨 Live Alerts</h3>
          <p>Get real-time updates on floods, earthquakes, fires and more.</p>
        </div>
        <div className="feature-card">
          <h3>☎️ Emergency Contacts</h3>
          <p>Quick access to helpline numbers when every second counts.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
