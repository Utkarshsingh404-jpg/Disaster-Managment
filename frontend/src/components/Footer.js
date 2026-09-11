import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Disaster Management System | Built for Hackathon</p>
      <p className="footer-sub">Stay Alert. Stay Safe. Stay Prepared.</p>
    </footer>
  );
}

export default Footer;
