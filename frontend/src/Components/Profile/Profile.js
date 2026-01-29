import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    medicalInfo: '',
    role: ''
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load profile data
    const data = {
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || 'user@example.com',
      phone: localStorage.getItem('phone') || '+94 XX XXX XXXX',
      location: localStorage.getItem('location') || 'Colombo, Sri Lanka',
      address: localStorage.getItem('address') || '',
      emergencyContact: localStorage.getItem('emergencyContact') || '',
      emergencyPhone: localStorage.getItem('emergencyPhone') || '',
      bloodType: localStorage.getItem('bloodType') || '',
      medicalInfo: localStorage.getItem('medicalInfo') || '',
      role: localStorage.getItem('userRole') || 'user'
    };

    setProfileData(data);
    setOriginalData(data);
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    Object.keys(profileData).forEach(key => {
      if (key !== 'role' && key !== 'username') {
        localStorage.setItem(key, profileData[key]);
      }
    });

    setOriginalData(profileData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h1>👤 My Profile</h1>
          <p>Manage your personal information and emergency details</p>
        </div>
        <div className="header-actions">
          {!isEditing ? (
            <button className="edit-btn" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-section profile-picture-section">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profileData.username.charAt(0).toUpperCase()}
            </div>
            {isEditing && (
              <button className="change-photo-btn">
                📷 Change Photo
              </button>
            )}
          </div>
          <div className="user-info">
            <h2>{profileData.username}</h2>
            <p className="user-role">{profileData.role === 'admin' ? '👨‍💼 Administrator' : '👤 User'}</p>
            <p className="user-location">📍 {profileData.location}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <h2>📋 Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={profileData.username}
                disabled
                className="form-input disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
              />
            </div>

            <div className="form-group full-width">
              <label>Full Address</label>
              <textarea 
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className={`form-textarea ${!isEditing ? 'disabled-input' : ''}`}
                rows="3"
                placeholder="Enter your full address"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="profile-section">
          <h2>🚨 Emergency Contact</h2>
          <p className="section-description">
            This information will be used to contact someone on your behalf during emergencies
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input 
                type="text" 
                value={profileData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
                placeholder="Contact person name"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Phone</label>
              <input 
                type="tel" 
                value={profileData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
                placeholder="+94 XX XXX XXXX"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="profile-section">
          <h2>🏥 Medical Information</h2>
          <p className="section-description">
            Optional but important for emergency responders
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label>Blood Type</label>
              <select 
                value={profileData.bloodType}
                onChange={(e) => handleInputChange('bloodType', e.target.value)}
                disabled={!isEditing}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Medical Conditions / Allergies</label>
              <textarea 
                value={profileData.medicalInfo}
                onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
                disabled={!isEditing}
                className={`form-textarea ${!isEditing ? 'disabled-input' : ''}`}
                rows="3"
                placeholder="Any medical conditions, allergies, or special requirements"
              />
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="profile-section">
          <h2>📊 Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🤝</div>
              <div className="stat-info">
                <h3>0</h3>
                <p>Help Requests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🙏</div>
              <div className="stat-info">
                <h3>0</h3>
                <p>Times Helped</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>5.0</h3>
                <p>Rating</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>30</h3>
                <p>Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-section">
          <h2>⚠️ Danger Zone</h2>
          <div className="danger-actions">
            <div className="danger-item">
              <div>
                <h4>Deactivate Account</h4>
                <p>Temporarily disable your account</p>
              </div>
              <button className="danger-btn-outline">Deactivate</button>
            </div>
            <div className="danger-item">
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="danger-btn">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
