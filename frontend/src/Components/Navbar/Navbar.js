import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1>🌊 Sri Lanka Disaster Relief</h1>
          </Link>
        </div>
        
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/disasters">Active Disasters</Link></li>
          <li><Link to="/request-help">Help Requests</Link></li>
          <li><Link to="/missing-persons">Missing Persons</Link></li>
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
