import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MissingPerson.css';

const MissingPerson = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  useEffect(() => {
    if (activeTab === 'report') {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAuthWarning(true);
      } else {
        setShowAuthWarning(false);
      }
    }
  }, [activeTab]);

  return (
    <div className="missing-person-page">
      <div className="missing-person-header">
        <h1>🔍 Find Missing Person</h1>
        <p>Search for or report missing persons</p>
      </div>

      <div className="missing-person-container">
        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔎 Search Missing Person
          </button>
          <button 
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            📢 Report Missing Person
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'search' ? (
          <SearchMissingPerson />
        ) : showAuthWarning ? (
          <div className="auth-warning">
            <div className="auth-message">
              <h3>🔒 Authentication Required</h3>
              <p>You must be signed in to report a missing person</p>
              <div className="auth-buttons">
                <button onClick={() => navigate('/login')} className="login-btn">
                  Sign In
                </button>
                <button onClick={() => navigate('/login')} className="signup-btn">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ReportMissingPerson />
        )}
      </div>
    </div>
  );
};

// Search Missing Person Component
const SearchMissingPerson = () => {
  const [searchData, setSearchData] = useState({
    name: '',
    district: '',
    ageRange: '',
    gender: '',
    lastSeenDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      const queryParams = new URLSearchParams();
      
      if (searchData.name) queryParams.append('name', searchData.name);
      if (searchData.district) queryParams.append('district', searchData.district);
      if (searchData.ageRange) queryParams.append('ageRange', searchData.ageRange);
      if (searchData.gender) queryParams.append('gender', searchData.gender);
      if (searchData.lastSeenDate) queryParams.append('lastSeenDate', searchData.lastSeenDate);

      const response = await fetch(`http://localhost:5000/api/missing-persons/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        alert(`Found ${data.count} missing person(s)`);
        console.log('Search results:', data.data);
      } else {
        alert('Search failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Failed to search. Please try again.');
    }
  };

  return (
    <div className="search-section">
      <h2>Search for Missing Person</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={searchData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>District</label>
            <select 
              name="district"
              value={searchData.district}
              onChange={handleChange}
            >
              <option value="">All Districts</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Mannar">Mannar</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Ampara">Ampara</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Badulla">Badulla</option>
              <option value="Monaragala">Monaragala</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Kegalle">Kegalle</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age Range</label>
            <select 
              name="ageRange"
              value={searchData.ageRange}
              onChange={handleChange}
            >
              <option value="">Any Age</option>
              <option value="child">Child (0-12)</option>
              <option value="teen">Teen (13-17)</option>
              <option value="adult">Adult (18-60)</option>
              <option value="senior">Senior (60+)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select 
              name="gender"
              value={searchData.gender}
              onChange={handleChange}
            >
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Last Seen Date</label>
          <input 
            type="date" 
            name="lastSeenDate"
            value={searchData.lastSeenDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="search-btn">🔍 Search</button>
      </form>
    </div>
  );
};

// Report Missing Person Component
const ReportMissingPerson = () => {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    missingPersonName: '',
    age: '',
    gender: '',
    lastSeenLocation: '',
    district: '',
    lastSeenDate: '',
    lastSeenTime: '',
    height: '',
    weight: '',
    clothingDescription: '',
    identifyingFeatures: '',
    additionalInfo: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB. Please choose a smaller image.');
        e.target.value = '';
        return;
      }
      
      setFormData({
        ...formData,
        photo: file
      });
    }
  };

  // Convert image to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert photo to Base64 if exists
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await convertToBase64(formData.photo);
      }

      const reportData = {
        reporterName: formData.reporterName,
        reporterPhone: formData.reporterPhone,
        missingPersonName: formData.missingPersonName,
        age: parseInt(formData.age),
        gender: formData.gender,
        lastSeenLocation: formData.lastSeenLocation,
        district: formData.district,
        lastSeenDate: formData.lastSeenDate,
        lastSeenTime: formData.lastSeenTime,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        clothingDescription: formData.clothingDescription,
        identifyingFeatures: formData.identifyingFeatures,
        additionalInfo: formData.additionalInfo,
        photo: photoBase64
      };

      const response = await fetch('http://localhost:5000/api/missing-persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Missing person report submitted successfully!');
        // Reset form
        setFormData({
          reporterName: '',
          reporterPhone: '',
          missingPersonName: '',
          age: '',
          gender: '',
          lastSeenLocation: '',
          district: '',
          lastSeenDate: '',
          lastSeenTime: '',
          height: '',
          weight: '',
          clothingDescription: '',
          identifyingFeatures: '',
          additionalInfo: '',
          photo: null
        });
      } else {
        alert('Failed to submit report: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="report-section">
      <h2>Report Missing Person</h2>
      <form className="report-form" onSubmit={handleSubmit}>
        
        {/* Reporter Information */}
        <div className="form-section">
          <h3>Your Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input 
                type="text" 
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Phone Number *</label>
              <input 
                type="tel" 
                name="reporterPhone"
                value={formData.reporterPhone}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
                required
              />
            </div>
          </div>
        </div>

        {/* Missing Person Information */}
        <div className="form-section">
          <h3>Missing Person Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Missing Person's Name *</label>
              <input 
                type="text" 
                name="missingPersonName"
                value={formData.missingPersonName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input 
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Last Seen Information */}
        <div className="form-section">
          <h3>Last Seen Information</h3>
          
          <div className="form-group">
            <label>Last Seen Location *</label>
            <input 
              type="text" 
              name="lastSeenLocation"
              value={formData.lastSeenLocation}
              onChange={handleChange}
              placeholder="Specific location or landmark"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>District *</label>
              <select 
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select district</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Last Seen Date *</label>
              <input 
                type="date" 
                name="lastSeenDate"
                value={formData.lastSeenDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Seen Time</label>
              <input 
                type="time" 
                name="lastSeenTime"
                value={formData.lastSeenTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Physical Description */}
        <div className="form-section">
          <h3>Physical Description</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 170"
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 65"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Clothing Description</label>
            <textarea 
              name="clothingDescription"
              value={formData.clothingDescription}
              onChange={handleChange}
              placeholder="What was the person wearing when last seen?"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Identifying Features</label>
            <textarea 
              name="identifyingFeatures"
              value={formData.identifyingFeatures}
              onChange={handleChange}
              placeholder="Scars, tattoos, birthmarks, or other distinctive features"
              rows="3"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="form-section">
          <h3>Photo</h3>
          <div className="form-group">
            <label>Upload Photo of Missing Person</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <small>Please upload a recent, clear photo</small>
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label>Any Additional Details</label>
            <textarea 
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other information that might help locate this person"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">📢 Submit Report</button>
      </form>
    </div>
  );
};

export default MissingPerson;
