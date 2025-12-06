import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Sri Lanka Disaster Relief is a platform dedicated to helping citizens 
            during natural disasters like floods, tsunamis, and other emergencies. 
            We connect people in need with those who can help.
          </p>
        </div>

        <div className="footer-section">
          <h3>Emergency Contacts</h3>
          <ul className="emergency-contacts">
            <li>🚨 Police Emergency: <strong>119</strong></li>
            <li>🚑 Ambulance: <strong>1990</strong></li>
            <li>🔥 Fire Brigade: <strong>110</strong></li>
            <li>🌊 Disaster Management: <strong>117</strong></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/disasters">Active Disasters</a></li>
            <li><a href="/help-requests">Request Help</a></li>
            <li><a href="/missing-persons">Missing Persons</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#facebook">📘 Facebook</a>
            <a href="#twitter">🐦 Twitter</a>
            <a href="#instagram">📷 Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Sri Lanka Disaster Relief. All rights reserved.</p>
        <p>Helping Sri Lankan communities during natural disasters</p>
      </div>
    </footer>
  );
};

export default Footer;
