import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>🌊 Sri Lanka Disaster Relief</h1>
        </div>
        
        <ul className="navbar-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/disasters">Active Disasters</a></li>
          <li><a href="/help-requests">Help Requests</a></li>
          <li><a href="/missing-persons">Missing Persons</a></li>
        </ul>
        
        <div className="navbar-auth">
          <button className="login-btn">
            <span className="user-icon">👤</span>
            Login
          </button>
          <button className="register-btn">Register</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
