import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">⚠️</span>
        <span>Disaster Management</span>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/alerts" onClick={() => setMenuOpen(false)}>Alerts</Link></li>
        <li><Link to="/contacts" onClick={() => setMenuOpen(false)}>Emergency Contacts</Link></li>
        <li><Link to="/download" className="nav-cta" onClick={() => setMenuOpen(false)}>Get App</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
