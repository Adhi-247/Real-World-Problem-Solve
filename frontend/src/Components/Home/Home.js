import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

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
    <div className="image-carousel">
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
          <button className="carousel-arrow carousel-prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
            ‹
          </button>
          <button className="carousel-arrow carousel-next" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
            ›
          </button>
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              />
            ))}
          </div>
          <span className="carousel-counter">{currentIndex + 1}/{images.length}</span>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [stats, setStats] = useState({
    helpRequests: 0,
    activeDisasters: 0,
    peopleAffected: 0,
    missingPersons: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      
      // Fetch help requests (these are the disaster reports from users)
      const helpRes = await fetch('http://localhost:5000/api/help-requests');
      const helpData = await helpRes.json();
      
      // Fetch missing persons count
      const missingRes = await fetch('http://localhost:5000/api/missing-persons');
      const missingData = await missingRes.json();
      
      if (helpData.success) {
        const requests = helpData.data || [];
        
        // Sort by urgency level (critical > high > medium > low)
        const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const sortedRequests = [...requests].sort((a, b) => {
          return (urgencyOrder[a.urgency] || 4) - (urgencyOrder[b.urgency] || 4);
        });
        
        setDisasters(sortedRequests);
        
        // Calculate stats
        const totalPeople = requests.reduce((sum, r) => sum + (r.peopleAffected || 0), 0);
        const uniqueDisasters = new Set(requests.map(r => `${r.disasterType}-${r.district}`)).size;
        
        setStats({
          helpRequests: requests.length,
          activeDisasters: uniqueDisasters,
          peopleAffected: totalPeople,
          missingPersons: missingData.success ? (missingData.data?.length || 0) : 0
        });
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVolunteerClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/volunteer');
    } else {
      alert('Please login or create an account to become a volunteer');
      navigate('/login');
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sri Lanka Disaster Relief Platform</h1>
          <p>Helping communities during floods, tsunamis, and natural disasters</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/request-help')}>Request Help</button>
            <button className="btn-secondary" onClick={() => navigate('/missing-persons')}>Report Missing Person</button>
          </div>
        </div>
      </section>

      {/* Disaster Types Section */}
      <section className="disaster-types-section">
        <h2>Types of Disasters We Monitor</h2>
        <div className="disaster-types-grid">
          <div className="disaster-type-card" onClick={() => navigate('/disasters/tsunami')} role="button" tabIndex={0}>
            <div className="disaster-type-image">
              <img src="/images/tsunami.jpg" alt="Tsunami" />
            </div>
            <h3>Tsunami</h3>
          </div>
          <div className="disaster-type-card" onClick={() => navigate('/disasters/floods')} role="button" tabIndex={0}>
            <div className="disaster-type-image">
              <img src="/images/floods.jpg" alt="Floods" />
            </div>
            <h3>Floods</h3>
          </div>
          <div className="disaster-type-card" onClick={() => navigate('/disasters/wildfire')} role="button" tabIndex={0}>
            <div className="disaster-type-image">
              <img src="/images/wildfire.jpg" alt="Wildfire" />
            </div>
            <h3>Wildfire</h3>
          </div>
          <div className="disaster-type-card" onClick={() => navigate('/disasters/landslide')} role="button" tabIndex={0}>
            <div className="disaster-type-image">
              <img src="/images/landslide.jpg" alt="Landslide" />
            </div>
            <h3>Landslide</h3>
          </div>
          <div className="disaster-type-card" onClick={() => navigate('/disasters/cyclone')} role="button" tabIndex={0}>
            <div className="disaster-type-image">
              <img src="/images/cyclone.jpg" alt="Cyclone" />
            </div>
            <h3>Cyclone</h3>
          </div>
        </div>
      </section>

      {/* Active Disasters Section */}
      <section className="disasters-section">
        <h2>Current Active Disasters</h2>
        
        {/* Small Stats Boxes */}
        <div className="disaster-stats">
          <div className="disaster-stat-box">
            <h3>{stats.helpRequests}+</h3>
            <p>Help Requests</p>
          </div>
          <div className="disaster-stat-box">
            <h3>{stats.activeDisasters}</h3>
            <p>Active Disasters</p>
          </div>
          <div className="disaster-stat-box">
            <h3>{stats.peopleAffected.toLocaleString()}+</h3>
            <p>People Affected</p>
          </div>
          <div className="disaster-stat-box">
            <h3>{stats.missingPersons}</h3>
            <p>Missing Persons</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading disasters...</div>
        ) : disasters.length === 0 ? (
          <div className="no-disasters">
            <p>No active disasters reported at the moment.</p>
          </div>
        ) : (
          <>
            <div className="disasters-grid">
              {disasters.slice(0, 6).map(disaster => (
                <div key={disaster._id} className="disaster-card">
                  {/* Disaster Image Carousel */}
                  {disaster.images && disaster.images.length > 0 && (
                    <div className="disaster-card-image">
                      <ImageCarousel images={disaster.images} autoPlay={true} interval={4000} />
                    </div>
                  )}
                  <div className="disaster-card-content">
                    <div className="disaster-header">
                      <h3>{disaster.disasterType?.charAt(0).toUpperCase() + disaster.disasterType?.slice(1)}</h3>
                      <span className={`severity ${getSeverityClass(disaster.urgency)}`}>
                        {disaster.urgency?.charAt(0).toUpperCase() + disaster.urgency?.slice(1)}
                      </span>
                    </div>
                    <div className="disaster-info">
                      <p><span className="info-icon">📍</span> {disaster.location}, {disaster.district}</p>
                      <p><span className="info-icon">👥</span> {disaster.peopleAffected?.toLocaleString()} affected</p>
                      <p><span className="info-icon">📅</span> {formatDate(disaster.createdAt)}</p>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedDisaster(disaster)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {disasters.length > 6 && (
              <div className="view-all-container">
                <button className="view-all-btn" onClick={() => navigate('/active-disasters')}>
                  View All Disasters ({disasters.length})
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Disaster Detail Modal */}
      {selectedDisaster && (
        <div className="disaster-modal-overlay" onClick={() => setSelectedDisaster(null)}>
          <div className="disaster-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDisaster(null)}>×</button>
            
            {/* Image Gallery */}
            {selectedDisaster.images && selectedDisaster.images.length > 0 && (
              <div className="modal-images">
                {selectedDisaster.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Disaster ${idx + 1}`} />
                ))}
              </div>
            )}
            
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedDisaster.disasterType?.charAt(0).toUpperCase() + selectedDisaster.disasterType?.slice(1)}</h2>
                <span className={`severity ${getSeverityClass(selectedDisaster.urgency)}`}>
                  {selectedDisaster.urgency?.charAt(0).toUpperCase() + selectedDisaster.urgency?.slice(1)}
                </span>
              </div>
              
              <div className="modal-details">
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
                    {selectedDisaster.needs.food && <span className="need-tag">🍚 Food</span>}
                    {selectedDisaster.needs.water && <span className="need-tag">💧 Water</span>}
                    {selectedDisaster.needs.medicine && <span className="need-tag">💊 Medicine</span>}
                    {selectedDisaster.needs.shelter && <span className="need-tag">🏠 Shelter</span>}
                    {selectedDisaster.needs.clothing && <span className="need-tag">👕 Clothing</span>}
                    {selectedDisaster.needs.blankets && <span className="need-tag">🛏️ Blankets</span>}
                    {selectedDisaster.needs.firstAid && <span className="need-tag">🩹 First Aid</span>}
                    {selectedDisaster.needs.rescue && <span className="need-tag">🚨 Rescue</span>}
                  </div>
                </div>
              )}
              
              <button className="modal-help-btn" onClick={() => navigate('/volunteer')}>
                Volunteer to Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <h2>How Can We Help?</h2>
        <div className="actions-grid">
          <div className="action-card">
            <span className="action-icon">🆘</span>
            <h3>Request Help</h3>
            <p>Need emergency assistance? Submit a help request</p>
            <button className="action-btn" onClick={() => navigate('/request-help')}>Get Help</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🔍</span>
            <h3>Find Missing Person</h3>
            <p>Search for or report missing persons</p>
            <button className="action-btn" onClick={() => navigate('/missing-persons')}>Search</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🌊</span>
            <h3>View Disasters</h3>
            <p>Check current disaster situations</p>
            <button className="action-btn" onClick={() => navigate('/active-disasters')}>View All</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🤝</span>
            <h3>Volunteer</h3>
            <p>Help others in your community</p>
            <button className="action-btn" onClick={handleVolunteerClick}>Join</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
