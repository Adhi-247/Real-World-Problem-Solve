import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  // Sample disaster data
  const disasters = [
    {
      id: 1,
      type: 'Flood',
      location: 'Colombo District',
      severity: 'High',
      affectedPeople: 5000,
      date: '2025-12-05'
    },
    {
      id: 2,
      type: 'Flood',
      location: 'Gampaha District',
      severity: 'Medium',
      affectedPeople: 2500,
      date: '2025-12-06'
    },
    {
      id: 3,
      type: 'Landslide',
      location: 'Kandy District',
      severity: 'High',
      affectedPeople: 1200,
      date: '2025-12-04'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sri Lanka Disaster Relief Platform</h1>
          <p>Helping communities during floods, tsunamis, and natural disasters</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/request-help')}>Request Help</button>
            <button className="btn-secondary">Report Missing Person</button>
          </div>
        </div>
      </section>

      {/* Disaster Types Section */}
      <section className="disaster-types-section">
        <h2>Types of Disasters We Monitor</h2>
        <div className="disaster-types-grid">
          <div className="disaster-type-card">
            <div className="disaster-type-image">
              <img src="/images/tsunami.jpg" alt="Tsunami" />
            </div>
            <h3>Tsunami</h3>
          </div>
          <div className="disaster-type-card">
            <div className="disaster-type-image">
              <img src="/images/floods.jpg" alt="Floods" />
            </div>
            <h3>Floods</h3>
          </div>
          <div className="disaster-type-card">
            <div className="disaster-type-image">
              <img src="/images/wildfire.jpg" alt="Wildfire" />
            </div>
            <h3>Wildfire</h3>
          </div>
          <div className="disaster-type-card">
            <div className="disaster-type-image">
              <img src="/images/landslide.jpg" alt="Landslide" />
            </div>
            <h3>Landslide</h3>
          </div>
          <div className="disaster-type-card">
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
            <h3>150+</h3>
            <p>Help Requests</p>
          </div>
          <div className="disaster-stat-box">
            <h3>3</h3>
            <p>Active Disasters</p>
          </div>
          <div className="disaster-stat-box">
            <h3>8,700+</h3>
            <p>People Affected</p>
          </div>
          <div className="disaster-stat-box">
            <h3>45</h3>
            <p>Missing Persons</p>
          </div>
        </div>

        <div className="disasters-grid">
          {disasters.map(disaster => (
            <div key={disaster.id} className="disaster-card">
              <div className="disaster-header">
                <h3>{disaster.type}</h3>
                <span className={`severity ${disaster.severity.toLowerCase()}`}>
                  {disaster.severity}
                </span>
              </div>
              <div className="disaster-info">
                <p><strong>📍 Location:</strong> {disaster.location}</p>
                <p><strong>👥 Affected:</strong> {disaster.affectedPeople.toLocaleString()} people</p>
                <p><strong>📅 Date:</strong> {disaster.date}</p>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          ))}
        </div>
      </section>

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
            <button className="action-btn" onClick={() => navigate('/disasters')}>View All</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🤝</span>
            <h3>Volunteer</h3>
            <p>Help others in your community</p>
            <button className="action-btn">Join</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
