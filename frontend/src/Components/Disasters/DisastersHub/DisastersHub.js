import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DisastersHub.css';

export default function DisastersHub() {
  const navigate = useNavigate();

  const items = [
    { key: 'tsunami', label: 'Tsunami', to: '/disasters/tsunami', image: '/images/tsunami.jpg' },
    { key: 'floods', label: 'Floods', to: '/disasters/floods', image: '/images/floods.jpg' },
    { key: 'wildfire', label: 'Wildfire', to: '/disasters/wildfire', image: '/images/wildfire.jpg' },
    { key: 'landslide', label: 'Landslide', to: '/disasters/landslide', image: '/images/landslide.jpg' },
    { key: 'cyclone', label: 'Cyclone', to: '/disasters/cyclone', image: '/images/cyclone.jpg' },
  ];

  return (
    <div className="disasters-hub">
      <header className="disasters-hub__hero">
        <div className="container">
          <div className="disasters-hub__heroCard">
            <h1>Disasters</h1>
            <p>Learn about each disaster type and safety guidance.</p>
          </div>
        </div>
      </header>

      <main className="container disasters-hub__main">
        <div className="disasters-hub__grid">
          {items.map((item) => (
            <div
              key={item.key}
              className="disasters-hub__tile"
              role="button"
              tabIndex={0}
              onClick={() => navigate(item.to)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(item.to);
              }}
            >
              <div className="disasters-hub__image">
                <img src={item.image} alt={item.label} loading="lazy" />
              </div>
              <div className="disasters-hub__label">
                <h2>{item.label}</h2>
                <span className="disasters-hub__cta">Open →</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
