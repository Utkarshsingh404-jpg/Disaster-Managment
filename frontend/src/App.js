import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Download from './pages/Download';
import Alerts from './pages/Alerts';
import Contacts from './pages/Contacts';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/download" element={<Download />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
