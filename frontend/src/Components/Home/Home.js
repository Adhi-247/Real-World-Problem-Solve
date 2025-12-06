import React from 'react';
import './Home.css';

const Home = () => {
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
            <button className="btn-primary">Request Help</button>
            <button className="btn-secondary">Report Missing Person</button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <h2>150+</h2>
            <p>Active Help Requests</p>
          </div>
          <div className="stat-card">
            <h2>3</h2>
            <p>Current Disasters</p>
          </div>
          <div className="stat-card">
            <h2>8,700+</h2>
            <p>People Affected</p>
          </div>
          <div className="stat-card">
            <h2>45</h2>
            <p>Missing Persons</p>
          </div>
        </div>
      </section>

      {/* Active Disasters Section */}
      <section className="disasters-section">
        <h2>Current Active Disasters</h2>
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
            <button className="action-btn">Get Help</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🔍</span>
            <h3>Find Missing Person</h3>
            <p>Search for or report missing persons</p>
            <button className="action-btn">Search</button>
          </div>
          <div className="action-card">
            <span className="action-icon">🌊</span>
            <h3>View Disasters</h3>
            <p>Check current disaster situations</p>
            <button className="action-btn">View All</button>
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
