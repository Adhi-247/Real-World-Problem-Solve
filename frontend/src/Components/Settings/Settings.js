import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    disasterAlerts: true,
    weeklyReports: false,
    theme: 'light',
    language: 'en',
    autoLocation: true,
    shareData: false
  });

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load user info
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email') || 'user@example.com';
    const phone = localStorage.getItem('phone') || '+94 XX XXX XXXX';
    setUserInfo({ username, email, phone });

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      disasterAlerts: true,
      weeklyReports: false,
      theme: 'light',
      language: 'en',
      autoLocation: true,
      shareData: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and notifications</p>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ Settings saved successfully!
        </div>
      )}

      <div className="settings-content">
        {/* Account Information */}
        <div className="settings-section">
          <h2>👤 Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{userInfo.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{userInfo.phone}</span>
            </div>
          </div>
          <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
            Edit Profile
          </button>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive updates via email</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>SMS Notifications</h3>
                <p>Receive text messages for urgent alerts</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Push Notifications</h3>
                <p>Receive browser push notifications</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Disaster Alerts</h3>
                <p>Emergency notifications for disasters</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.disasterAlerts}
                  onChange={() => handleToggle('disasterAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Weekly Reports</h3>
                <p>Receive weekly summary emails</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.weeklyReports}
                  onChange={() => handleToggle('weeklyReports')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <h2>🎨 Appearance</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Theme</h3>
              <p>Choose your preferred theme</p>
            </div>
            <select 
              className="setting-select"
              value={settings.theme}
              onChange={(e) => handleSelectChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Privacy */}
        <div className="settings-section">
          <h2>🔒 Privacy</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Auto Location Detection</h3>
                <p>Allow automatic location detection for disaster alerts</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.autoLocation}
                  onChange={() => handleToggle('autoLocation')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Share Data for Research</h3>
                <p>Help improve disaster response by sharing anonymized data</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.shareData}
                  onChange={() => handleToggle('shareData')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset to Default
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
