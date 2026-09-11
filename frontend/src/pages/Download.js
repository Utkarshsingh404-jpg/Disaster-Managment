import React from 'react';
import './Pages.css';

// Change this to your actual backend URL when deploying
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Download() {
  const handleDownload = () => {
    window.location.href = `${API_BASE_URL}/api/download-apk`;
  };

  return (
    <div className="page">
      <section className="download-section">
        <h1>Download Our App</h1>
        <p>Get instant disaster alerts, safety tips, and emergency contacts right on your phone.</p>

        <div className="download-card">
          <div className="app-icon">📱</div>
          <h2>Disaster Management App</h2>
          <p className="app-meta">Version 1.0 &bull; Android &bull; ~15 MB</p>
          <button className="btn btn-primary download-btn" onClick={handleDownload}>
            ⬇ Download APK
          </button>
          <p className="download-note">
            Note: You may need to enable "Install from unknown sources" in your phone settings.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Download;
