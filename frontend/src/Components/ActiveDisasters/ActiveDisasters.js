import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveDisasters.css';

// Image Carousel Component
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
    <div className="carousel">
      <div className="carousel-slides">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`carousel-slide ${idx === currentIndex ? 'active' : ''}`}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="carousel-arrow prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>‹</button>
          <button className="carousel-arrow next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>›</button>
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }} />
            ))}
          </div>
          <span className="carousel-counter">{currentIndex + 1}/{images.length}</span>
        </>
      )}
    </div>
  );
};

const ActiveDisasters = () => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch from ACTIVE DISASTERS endpoint
      const res = await fetch('http://localhost:5000/api/active-disasters?status=active&limit=50');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        // Sort by urgency
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const sorted = [...(data.data || [])].sort((a, b) => 
          (urgencyOrder[a.urgency] || 4) - (urgencyOrder[b.urgency] || 4)
        );
        setDisasters(sorted);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
      setError(`Failed to load disasters: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisasterDetails = async (disasterId) => {
    try {
      setLoadingDetails(true);
      const res = await fetch(`http://localhost:5000/api/active-disasters/${disasterId}`);
      const data = await res.json();
      
      if (data.success) {
        setSelectedDisaster(data.data);
      }
    } catch (error) {
      console.error('Error fetching disaster details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getSeverityClass = (urgency) => {
    switch (urgency) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const filteredDisasters = disasters.filter(d => {
    const typeMatch = filterType === 'all' || d.disasterType === filterType;
    const urgencyMatch = filterUrgency === 'all' || d.urgency === filterUrgency;
    return typeMatch && urgencyMatch;
  });

  return (
    <div className="active-disasters-page">
      <header className="page-header">
        <div className="container">
          <h1>🌊 Active Disasters</h1>
          <p>All reported disasters in Sri Lanka</p>
        </div>
      </header>

      <main className="container">
        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-item">
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
          <div className="filter-item">
            <label>Risk Level:</label>
            <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="results-count">
            Showing {filteredDisasters.length} of {disasters.length} disasters
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading disasters...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchDisasters}>Retry</button>
          </div>
        ) : filteredDisasters.length === 0 ? (
          <div className="no-results">No disasters found matching your filters.</div>
        ) : (
          <div className="disasters-grid">
            {filteredDisasters.map(disaster => (
              <div key={disaster._id} className="disaster-card">
                {disaster.images && disaster.images.length > 0 && (
                  <div className="card-image">
                    <ImageCarousel images={disaster.images} autoPlay={true} interval={4000} />
                  </div>
                )}
                <div className="card-body">
                  <div className="card-header">
                    <h3>{disaster.disasterType?.charAt(0).toUpperCase() + disaster.disasterType?.slice(1)}</h3>
                    <span className={`badge ${getSeverityClass(disaster.urgency)}`}>
                      {disaster.urgency}
                    </span>
                  </div>
                  <div className="card-info">
                    <p>📍 {disaster.location}, {disaster.district}</p>
                    <p>👥 {disaster.peopleAffected?.toLocaleString()} affected</p>
                    <p>📅 {formatDate(disaster.createdAt)}</p>
                  </div>
                  <button className="details-btn" onClick={() => fetchDisasterDetails(disaster._id)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedDisaster && (
        <div className="modal-overlay" onClick={() => setSelectedDisaster(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedDisaster(null)}>×</button>
            
            {loadingDetails ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <p>Loading details...</p>
              </div>
            ) : (
              <>
                {selectedDisaster.images && selectedDisaster.images.length > 0 && (
                  <div className="modal-images">
                    {selectedDisaster.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Disaster ${idx + 1}`} />
                    ))}
                  </div>
                )}
            
            <div className="modal-body">
              <div className="modal-header">
                <h2>{selectedDisaster.disasterType?.charAt(0).toUpperCase() + selectedDisaster.disasterType?.slice(1)}</h2>
                <span className={`badge ${getSeverityClass(selectedDisaster.urgency)}`}>
                  {selectedDisaster.urgency}
                </span>
              </div>
              
              <div className="modal-info">
                <p><strong>📍 Location:</strong> {selectedDisaster.location}</p>
                <p><strong>🏘️ District:</strong> {selectedDisaster.district}</p>
                <p><strong>🏠 Address:</strong> {selectedDisaster.address}</p>
                <p><strong>👥 People Affected:</strong> {selectedDisaster.peopleAffected?.toLocaleString()}</p>
                <p><strong>📅 Reported:</strong> {formatDate(selectedDisaster.createdAt)}</p>
                <p><strong>📞 Contact:</strong> {selectedDisaster.phone}</p>
              </div>
              
              <div className="modal-description">
                <h4>Description</h4>
                <p>{selectedDisaster.description}</p>
              </div>
              
              {selectedDisaster.needs && (
                <div className="modal-needs">
                  <h4>Needs</h4>
                  <div className="needs-tags">
                    {selectedDisaster.needs.food && <span className="tag">🍚 Food</span>}
                    {selectedDisaster.needs.water && <span className="tag">💧 Water</span>}
                    {selectedDisaster.needs.medicine && <span className="tag">💊 Medicine</span>}
                    {selectedDisaster.needs.shelter && <span className="tag">🏠 Shelter</span>}
                    {selectedDisaster.needs.clothing && <span className="tag">👕 Clothing</span>}
                    {selectedDisaster.needs.blankets && <span className="tag">🛏️ Blankets</span>}
                    {selectedDisaster.needs.firstAid && <span className="tag">🩹 First Aid</span>}
                    {selectedDisaster.needs.rescue && <span className="tag">🚨 Rescue</span>}
                  </div>
                </div>
              )}
              
              <button className="volunteer-btn" onClick={() => navigate('/volunteer')}>
                🤝 Volunteer to Help
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDisasters;
