import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    location: ''
  });

  const [stats] = useState({
    helpRequests: 0,
    helpProvided: 0,
    missingPersonReports: 0,
    activeAlerts: 3
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [activeAlerts] = useState([
    {
      id: 1,
      type: 'Flood Warning',
      location: 'Colombo District',
      severity: 'high',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'Landslide Alert',
      location: 'Kandy District',
      severity: 'medium',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'Cyclone Watch',
      location: 'Eastern Province',
      severity: 'low',
      time: '1 day ago'
    }
  ]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load user data
    const username = localStorage.getItem('username') || 'User';
    const email = localStorage.getItem('email') || 'user@example.com';
    const role = localStorage.getItem('userRole') || 'user';
    const location = localStorage.getItem('location') || 'Colombo, Sri Lanka';

    setUserData({ username, email, role, location });

    // Load recent activity (mock data for now)
    setRecentActivity([
      {
        id: 1,
        type: 'help_request',
        action: 'Submitted help request',
        location: 'Colombo',
        time: '2 days ago'
      },
      {
        id: 2,
        type: 'volunteer',
        action: 'Registered as volunteer',
        location: 'Kandy',
        time: '1 week ago'
      }
    ]);
  }, [navigate]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#ffc107';
      default: return '#2196f3';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'help_request': return '🆘';
      case 'volunteer': return '🤝';
      case 'missing_person': return '🔍';
      default: return '📋';
    }
  };

  return (
    <div className="user-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userData.username}! 👋</h1>
          <p>Here's what's happening in your area</p>
        </div>
        <div className="header-actions">
          <Link to="/request-help" className="quick-action-btn emergency">
            🆘 Request Help
          </Link>
          <Link to="/volunteer" className="quick-action-btn">
            🤝 Volunteer
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            🆘
          </div>
          <div className="stat-details">
            <h3>{stats.helpRequests}</h3>
            <p>Help Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            🙏
          </div>
          <div className="stat-details">
            <h3>{stats.helpProvided}</h3>
            <p>Times Helped Others</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            🔍
          </div>
          <div className="stat-details">
            <h3>{stats.missingPersonReports}</h3>
            <p>Missing Person Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            🚨
          </div>
          <div className="stat-details">
            <h3>{stats.activeAlerts}</h3>
            <p>Active Alerts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Active Alerts */}
        <div className="dashboard-section alerts-section">
          <div className="section-header">
            <h2>🚨 Active Disaster Alerts</h2>
            <Link to="/active-disasters" className="view-all-link">
              View All →
            </Link>
          </div>
          <div className="alerts-list">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <div 
                  className="alert-severity-indicator" 
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                ></div>
                <div className="alert-content">
                  <h4>{alert.type}</h4>
                  <p>📍 {alert.location}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <div className="alert-actions">
                  <button className="alert-detail-btn">Details</button>
                </div>
              </div>
            ))}
          </div>
          {activeAlerts.length === 0 && (
            <div className="empty-state">
              <p>✓ No active alerts in your area</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <div className="section-header">
            <h2>📋 Recent Activity</h2>
          </div>
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.action}</h4>
                    <p>📍 {activity.location}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links-section">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-links-grid">
          <Link to="/request-help" className="quick-link-card">
            <div className="quick-link-icon">🆘</div>
            <h3>Request Help</h3>
            <p>Get assistance during emergencies</p>
          </Link>

          <Link to="/missing-persons" className="quick-link-card">
            <div className="quick-link-icon">🔍</div>
            <h3>Missing Persons</h3>
            <p>Report or search for missing people</p>
          </Link>

          <Link to="/volunteer" className="quick-link-card">
            <div className="quick-link-icon">🤝</div>
            <h3>Volunteer</h3>
            <p>Help others in your community</p>
          </Link>

          <Link to="/active-disasters" className="quick-link-card">
            <div className="quick-link-icon">🌊</div>
            <h3>View Disasters</h3>
            <p>See active disaster situations</p>
          </Link>

          <Link to="/settings" className="quick-link-card">
            <div className="quick-link-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your preferences</p>
          </Link>

          <Link to="/profile" className="quick-link-card">
            <div className="quick-link-icon">👤</div>
            <h3>Profile</h3>
            <p>Update your information</p>
          </Link>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="emergency-contact-section">
        <div className="emergency-banner">
          <h3>🚨 Emergency Contacts</h3>
          <div className="emergency-numbers">
            <div className="emergency-number">
              <span className="number-label">Police:</span>
              <a href="tel:119" className="number-value">119</a>
            </div>
            <div className="emergency-number">
              <span className="number-label">Fire & Rescue:</span>
              <a href="tel:110" className="number-value">110</a>
            </div>
            <div className="emergency-number">
              <span className="number-label">Ambulance:</span>
              <a href="tel:1990" className="number-value">1990</a>
            </div>
            <div className="emergency-number">
              <span className="number-label">Disaster Management:</span>
              <a href="tel:117" className="number-value">117</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
