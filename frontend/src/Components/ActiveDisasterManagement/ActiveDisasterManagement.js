import React, { useState, useEffect, useCallback } from 'react';
import './ActiveDisasterManagement.css';

// Image Carousel Component for Admin
const ImageCarousel = ({ images, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length, nextSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div className="admin-carousel">
      <div className="admin-carousel-slides">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`admin-carousel-slide ${idx === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="admin-carousel-arrow prev" onClick={prevSlide}>‹</button>
          <button className="admin-carousel-arrow next" onClick={nextSlide}>›</button>
          <div className="admin-carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`admin-carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
          <span className="admin-carousel-counter">{currentIndex + 1}/{images.length}</span>
        </>
      )}
    </div>
  );
};

const ActiveDisasterManagement = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // Form state for adding new disaster
  const [formData, setFormData] = useState({
    disasterType: '',
    location: '',
    district: '',
    address: '',
    urgency: 'medium',
    peopleAffected: '',
    description: '',
    images: []
  });

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/help-requests');
      const data = await response.json();

      if (data.success) {
        setDisasters(data.data);
      } else {
        setError('Failed to fetch disasters');
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
      setError('Failed to fetch disasters');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (disaster) => {
    setSelectedDisaster(disaster);
    setShowModal(true);
  };

  const handleStatusUpdate = async (disasterId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/help-requests/${disasterId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert('Status updated successfully');
        fetchDisasters();
        if (selectedDisaster && selectedDisaster._id === disasterId) {
          setSelectedDisaster({ ...selectedDisaster, status: newStatus });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (disasterId) => {
    if (!window.confirm('Are you sure you want to delete this disaster record?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/help-requests/${disasterId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Disaster record deleted successfully');
        fetchDisasters();
        setShowModal(false);
      } else {
        alert('Failed to delete disaster record');
      }
    } catch (error) {
      console.error('Error deleting disaster:', error);
      alert('Failed to delete disaster record');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  // Handle image upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Each image must be less than 2MB');
        return;
      }
    }

    const base64Images = await Promise.all(files.map(file => convertToBase64(file)));
    setFormData({ ...formData, images: [...formData.images, ...base64Images] });
  };

  const removeImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // Submit new disaster
  const handleAddDisaster = async (e) => {
    e.preventDefault();

    if (!formData.disasterType || !formData.location || !formData.district || !formData.description || !formData.peopleAffected) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const requestData = {
        name: 'Admin Report',
        phone: 'N/A',
        disasterType: formData.disasterType,
        location: formData.location,
        district: formData.district,
        address: formData.address || '',
        urgency: formData.urgency,
        peopleAffected: parseInt(formData.peopleAffected),
        needs: { food: false, water: false, medicine: false, shelter: false, clothing: false, blankets: false, firstAid: false, rescue: false, other: '' },
        description: formData.description,
        images: formData.images
      };

      const response = await fetch('http://localhost:5000/api/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Disaster added successfully');
        setShowAddModal(false);
        setFormData({
          disasterType: '',
          location: '',
          district: '',
          address: '',
          urgency: 'medium',
          peopleAffected: '',
          description: '',
          images: []
        });
        fetchDisasters();
      } else {
        alert('Failed to add disaster: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding disaster:', error);
      alert('Failed to add disaster');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredDisasters = disasters.filter(d => {
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    const typeMatch = filterType === 'all' || d.disasterType === filterType;
    const urgencyMatch = filterUrgency === 'all' || d.urgency === filterUrgency;
    return statusMatch && typeMatch && urgencyMatch;
  });

  if (loading) {
    return <div className="loading">Loading active disasters...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="active-disaster-management">
      <div className="management-header">
        <h2>🌊 Active Disasters Management</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            ➕ Add Disaster
          </button>
          <button className="refresh-btn" onClick={fetchDisasters}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Disaster Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="tsunami">Tsunami</option>
            <option value="floods">Floods</option>
            <option value="wildfire">Wildfire</option>
            <option value="landslide">Landslide</option>
            <option value="cyclone">Cyclone</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Urgency:</label>
          <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)}>
            <option value="all">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <h3>{disasters.length}</h3>
          <p>Total Reports</p>
        </div>
        <div className="stat-card pending">
          <h3>{disasters.filter(d => d.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card in-progress">
          <h3>{disasters.filter(d => d.status === 'in-progress').length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card completed">
          <h3>{disasters.filter(d => d.status === 'completed').length}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* Disaster Cards Grid */}
      <div className="disaster-cards-grid">
        {filteredDisasters.length === 0 ? (
          <div className="no-data">No disaster reports found</div>
        ) : (
          filteredDisasters.map((disaster) => (
            <div key={disaster._id} className="admin-disaster-card">
              {/* Image Carousel */}
              {disaster.images && disaster.images.length > 0 && (
                <div className="admin-card-image">
                  <ImageCarousel images={disaster.images} autoPlay={true} interval={4000} />
                </div>
              )}
              
              <div className="admin-card-content">
                <div className="admin-card-header">
                  <h3>{disaster.disasterType?.charAt(0).toUpperCase() + disaster.disasterType?.slice(1)}</h3>
                  <span className="urgency-badge" style={{ backgroundColor: getUrgencyColor(disaster.urgency) }}>
                    {disaster.urgency}
                  </span>
                </div>

                <div className="admin-card-info">
                  <p><span>📍</span> {disaster.location}, {disaster.district}</p>
                  <p><span>👥</span> {disaster.peopleAffected} people affected</p>
                  <p><span>📅</span> {new Date(disaster.createdAt).toLocaleDateString()}</p>
                  <p><span>📞</span> {disaster.phone}</p>
                </div>

                <div className="admin-card-status">
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(disaster.status) }}>
                    {disaster.status}
                  </span>
                </div>

                <div className="admin-card-actions">
                  <button className="view-btn" onClick={() => handleViewDetails(disaster)}>
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedDisaster && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Disaster Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Images */}
              {selectedDisaster.images && selectedDisaster.images.length > 0 && (
                <div className="detail-section">
                  <h3>Images</h3>
                  <div className="modal-images-grid">
                    {selectedDisaster.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Disaster ${idx + 1}`} className="modal-image" />
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Reporter Information</h3>
                <p><strong>Name:</strong> {selectedDisaster.name}</p>
                <p><strong>Phone:</strong> {selectedDisaster.phone}</p>
              </div>

              <div className="detail-section">
                <h3>Disaster Information</h3>
                <p><strong>Type:</strong> {selectedDisaster.disasterType}</p>
                <p><strong>Location:</strong> {selectedDisaster.location}</p>
                <p><strong>District:</strong> {selectedDisaster.district}</p>
                <p><strong>Address:</strong> {selectedDisaster.address}</p>
                <p>
                  <strong>Urgency:</strong>
                  <span className="urgency-badge" style={{ backgroundColor: getUrgencyColor(selectedDisaster.urgency), marginLeft: '8px' }}>
                    {selectedDisaster.urgency}
                  </span>
                </p>
                <p><strong>People Affected:</strong> {selectedDisaster.peopleAffected}</p>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedDisaster.description}</p>
              </div>

              {selectedDisaster.needs && (
                <div className="detail-section">
                  <h3>Needs</h3>
                  <div className="needs-list">
                    {selectedDisaster.needs.food && <span className="need-badge">🍚 Food</span>}
                    {selectedDisaster.needs.water && <span className="need-badge">💧 Water</span>}
                    {selectedDisaster.needs.medicine && <span className="need-badge">💊 Medicine</span>}
                    {selectedDisaster.needs.shelter && <span className="need-badge">🏠 Shelter</span>}
                    {selectedDisaster.needs.clothing && <span className="need-badge">👕 Clothing</span>}
                    {selectedDisaster.needs.blankets && <span className="need-badge">🛏️ Blankets</span>}
                    {selectedDisaster.needs.firstAid && <span className="need-badge">🏥 First Aid</span>}
                    {selectedDisaster.needs.rescue && <span className="need-badge">🚁 Rescue</span>}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button className="status-btn pending-btn" onClick={() => handleStatusUpdate(selectedDisaster._id, 'pending')}>
                    Pending
                  </button>
                  <button className="status-btn progress-btn" onClick={() => handleStatusUpdate(selectedDisaster._id, 'in-progress')}>
                    In Progress
                  </button>
                  <button className="status-btn completed-btn" onClick={() => handleStatusUpdate(selectedDisaster._id, 'completed')}>
                    Resolved
                  </button>
                  <button className="status-btn rejected-btn" onClick={() => handleStatusUpdate(selectedDisaster._id, 'rejected')}>
                    Rejected
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button className="delete-btn" onClick={() => handleDelete(selectedDisaster._id)}>
                  🗑️ Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Disaster Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Disaster</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form className="add-form" onSubmit={handleAddDisaster}>
              <div className="form-row">
                <div className="form-group">
                  <label>Disaster Type *</label>
                  <select name="disasterType" value={formData.disasterType} onChange={handleInputChange} required>
                    <option value="">Select type</option>
                    <option value="tsunami">Tsunami</option>
                    <option value="floods">Floods</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="landslide">Landslide</option>
                    <option value="cyclone">Cyclone</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Urgency Level *</label>
                  <select name="urgency" value={formData.urgency} onChange={handleInputChange} required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Malabe" required />
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <select name="district" value={formData.district} onChange={handleInputChange} required>
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
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Vavuniya">Vavuniya</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Ampara">Ampara</option>
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

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Detailed address (optional)" />
              </div>

              <div className="form-group">
                <label>People Affected *</label>
                <input type="number" name="peopleAffected" value={formData.peopleAffected} onChange={handleInputChange} placeholder="Number of people affected" min="1" required />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the disaster situation..." rows="4" required />
              </div>

              <div className="form-group">
                <label>Images (max 5)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                {formData.images.length > 0 && (
                  <div className="image-previews">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="image-preview">
                        <img src={img} alt={`Preview ${idx + 1}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(idx)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Disaster</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDisasterManagement;
