import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status function
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setUserRole('');
    }
  };

  useEffect(() => {
    // Check login status on mount and when location changes
    checkLoginStatus();
  }, [location]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
          <li><Link to="/active-disasters">Active Disasters</Link></li>
          <li><Link to="/request-help">Help Requests</Link></li>
          <li><Link to="/missing-persons">Missing Persons</Link></li>
        </ul>
        
        <div className="navbar-auth">
          {isLoggedIn ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-btn" onClick={toggleDropdown}>
                <span className="user-icon">👤</span>
                {userRole === 'admin' ? '(Admin)' : username}
                <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  {userRole === 'admin' && (
                    <>
                      <Link to="/admin/dashboard" className="dropdown-item admin-dashboard-item" onClick={() => setShowDropdown(false)}>
                        <span className="dropdown-icon">🔐</span>
                        Admin Dashboard
                      </Link>
                      <div className="dropdown-divider"></div>
                    </>
                  )}
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </Link>
                  <Link to="/language" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <span className="dropdown-icon">🌐</span>
                    Change Language
                  </Link>
                  <Link to="/privacy" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <span className="dropdown-icon">🔒</span>
                    Privacy & Policy
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="login-btn">
                  <span className="user-icon">👤</span>
                  Login
                </button>
              </Link>
              <Link to="/login">
                <button className="register-btn">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
