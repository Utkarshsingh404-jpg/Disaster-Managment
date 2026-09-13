import React from 'react';
import './Pages.css';

// Direct GitHub Release link for the APK
const APK_DOWNLOAD_URL = 'https://github.com/Utkarshsingh404-jpg/Disaster-Managment/releases/download/v1.2/app-release.apk';

function Download() {
  const handleDownload = () => {
    window.location.href = APK_DOWNLOAD_URL;
  };

  return (
    <div className="page">
      <section className="download-section">
        <h1>Download Our App</h1>
        <p>Get instant disaster alerts, safety tips, and emergency contacts right on your phone.</p>

        <div className="download-card">
          <div className="app-icon">📱</div>
          <h2>Disaster Management App</h2>
          <p className="app-meta">Version 1.0 &bull; Android</p>
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
