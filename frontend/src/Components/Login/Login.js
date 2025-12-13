import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = isAdminLogin 
        ? 'http://localhost:5000/api/admins/login'
        : 'http://localhost:5000/api/users/login';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('userRole', isAdminLogin ? 'admin' : 'user');
        
        alert(`${isAdminLogin ? 'Admin' : 'User'} login successful!`);
        
        // Redirect to admin dashboard if admin, otherwise home
        if (isAdminLogin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Connection error. Please make sure the server is running.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('userRole', 'user');
        
        alert('Registration successful! Welcome to Sri Lanka Disaster Relief.');
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Connection error. Please make sure the server is running.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: ''
    });
    setError('');
  };

  return (
    <div className="login-page">
      {/* Left Side - Information */}
      <div className="login-info-side">
        <div className="info-content">
          <h1>🌊 Sri Lanka Disaster Relief</h1>
          <h2>Connecting Communities in Times of Crisis</h2>
          
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🆘</span>
              <div>
                <h3>Request Emergency Help</h3>
                <p>Submit urgent assistance requests during disasters</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <div>
                <h3>Find Missing Persons</h3>
                <p>Search and report missing people after disasters</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🌊</span>
              <div>
                <h3>Track Active Disasters</h3>
                <p>Stay informed about ongoing disaster situations</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🤝</span>
              <div>
                <h3>Volunteer & Help Others</h3>
                <p>Join relief efforts in your community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="login-form-side">
        <div className="login-box">
          <h1>
            {isSignupMode ? '📝 Create Account' : (isAdminLogin ? '🔐 Admin Login' : '👤 User Login')}
          </h1>
          <p>
            {isSignupMode 
              ? 'Join Sri Lanka Disaster Relief Community' 
              : (isAdminLogin ? 'Access admin dashboard' : 'Sign in to your account')}
          </p>

          {isSignupMode ? (
            // Signup Form
            <form className="login-form" onSubmit={handleSignup}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Username *</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                  minLength="3"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XXXXXXXX (optional)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address (optional)"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            // Login Form
            <form className="login-form" onSubmit={handleLogin}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : (isAdminLogin ? 'Login as Admin' : 'Login')}
              </button>
            </form>
          )}

          {!isAdminLogin && (
            <div className="signup-link">
              <p>
                {isSignupMode ? 'Already have an account? ' : "Don't have an account? "}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                  {isSignupMode ? 'Login here' : 'Sign up here'}
                </a>
              </p>
            </div>
          )}

          {!isSignupMode && (
            <div className="toggle-login">
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setIsAdminLogin(!isAdminLogin)}
              >
                {isAdminLogin ? '← Back to User Login' : '🔑 Admin Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
