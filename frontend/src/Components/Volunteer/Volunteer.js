import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Volunteer.css';

const Volunteer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    skills: '',
    availability: 'Weekdays',
    experienceYears: 0,
    previousExperience: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    reasonToVolunteer: ''
  });
  const [loading, setLoading] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Only alert once using a flag
      const hasAlerted = sessionStorage.getItem('authAlert');
      if (!hasAlerted) {
        sessionStorage.setItem('authAlert', 'true');
        alert('⚠️ Please login to become a volunteer');
      }
      navigate('/login');
    } else {
      fetchMyApplications();
    }
    
    // Cleanup: remove flag when component unmounts
    return () => sessionStorage.removeItem('authAlert');
  }, [navigate]);

  const fetchMyApplications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`http://localhost:5000/api/volunteers/user/${userId}`);
        if (response.data.success) {
          setMyApplications(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('http://localhost:5000/api/volunteers', {
        ...formData,
        userId
      });

      if (response.data.success) {
        alert('Volunteer application submitted successfully! We will review and get back to you soon.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          dateOfBirth: '',
          occupation: '',
          skills: '',
          availability: 'Weekdays',
          experienceYears: 0,
          previousExperience: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          reasonToVolunteer: ''
        });
        fetchMyApplications();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected'
    };
    return badges[status] || 'status-pending';
  };

  return (
    <div className="volunteer-page">
      <div className="volunteer-header">
        <h1>🤝 Become a Volunteer</h1>
        <p>Help your community during disasters and emergencies</p>
      </div>

      <div className="volunteer-container">
        <div className="volunteer-info">
          <h2>Why Volunteer?</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">💪</span>
              <div>
                <h3>Make a Difference</h3>
                <p>Help save lives and rebuild communities</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🎓</span>
              <div>
                <h3>Gain Experience</h3>
                <p>Learn disaster management and relief skills</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🤝</span>
              <div>
                <h3>Build Community</h3>
                <p>Connect with like-minded helpers</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⭐</span>
              <div>
                <h3>Recognition</h3>
                <p>Receive certificates and appreciation</p>
              </div>
            </div>
          </div>

          {myApplications.length > 0 && (
            <div className="my-applications-section">
              <button 
                className="toggle-applications-btn"
                onClick={() => setShowApplications(!showApplications)}
              >
                {showApplications ? '▼' : '▶'} My Applications ({myApplications.length})
              </button>
              
              {showApplications && (
                <div className="applications-list">
                  {myApplications.map((app) => (
                    <div key={app._id} className="application-card">
                      <div className="app-header">
                        <h4>{app.fullName}</h4>
                        <span className={`status-badge ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <p><strong>Skills:</strong> {app.skills}</p>
                      <p><strong>Availability:</strong> {app.availability}</p>
                      <p><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                      {app.adminNotes && (
                        <p className="admin-notes"><strong>Admin Notes:</strong> {app.adminNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="volunteer-form-container">
          <h2>Volunteer Application Form</h2>
          <form onSubmit={handleSubmit} className="volunteer-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="07XXXXXXXX"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Your full address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  placeholder="Your occupation"
                />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Skills & Expertise *</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="e.g., First Aid, Construction, Medical, Logistics, etc."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Availability *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Both">Both Weekdays & Weekends</option>
                <option value="Anytime">Anytime (24/7)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Previous Volunteer Experience</label>
              <textarea
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleChange}
                placeholder="Describe any previous volunteer or disaster relief experience (optional)"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name *</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  required
                  placeholder="Contact person name"
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone *</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  required
                  placeholder="Contact person phone"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Why do you want to volunteer? *</label>
              <textarea
                name="reasonToVolunteer"
                value={formData.reasonToVolunteer}
                onChange={handleChange}
                required
                placeholder="Tell us what motivates you to become a volunteer"
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : '✓ Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
