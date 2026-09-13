import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Pages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fallback national helplines shown even if backend has no data yet
const defaultContacts = [
  { name: 'AI Call Assistant', department: 'Emergency AI Support', phone: '073-146-23566', region: 'National' },
  { name: 'National Disaster Response', department: 'NDRF', phone: '011-24363260', region: 'National' },
  { name: 'Police', department: 'Emergency', phone: '100', region: 'National' },
  { name: 'Fire Brigade', department: 'Emergency', phone: '101', region: 'National' },
  { name: 'Ambulance', department: 'Emergency', phone: '102', region: 'National' },
  { name: 'Disaster Management Helpline', department: 'NDMA', phone: '1078', region: 'National' },
];

function Contacts() {
  const [contacts, setContacts] = useState(defaultContacts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contacts`);
      if (res.data && res.data.length > 0) {
        setContacts(res.data);
      }
      setLoading(false);
    } catch (err) {
      // Backend not reachable yet — keep showing default contacts
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Emergency Contacts</h1>
      <p className="page-subtitle">Save these numbers — every second matters in an emergency</p>

      {loading && <p>Loading contacts...</p>}

      <div className="contacts-grid">
        {contacts.map((contact, idx) => (
          <div className="contact-card" key={contact._id || idx}>
            <h3>{contact.name}</h3>
            <p className="contact-dept">{contact.department} &bull; {contact.region}</p>
            <a
