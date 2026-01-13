import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Cyclone.css';

function SafeImage({ src, alt, className, loading = 'lazy' }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return <div className={className} aria-hidden="true" />;

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setHidden(true)}
    />
  );
}

function GalleryImage({ src, alt }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="cyclone-image">
      <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} />
    </div>
  );
}

export default function Cyclone() {
  const navigate = useNavigate();
  const location = useLocation();

  // Images expected in: frontend/public/images
  const heroImage = '/images/cyclone1.jpg';

  const splitSections = [
    {
      title: 'What is a Cyclone?',
      body: [
        'A cyclone is a powerful rotating storm system that can bring strong winds, heavy rainfall, storm surge, and flooding. In Sri Lanka, cyclones and severe storms mainly affect coastal areas through rain, wind damage, and coastal flooding.',
        'Even if the cyclone center does not make direct landfall, outer rain bands can still cause serious floods and landslides.'
      ],
      image: '/images/cyclone-what-is.jpg',
      imageAlt: 'Cyclone clouds'
    },
    {
      title: 'Main Dangers',
      body: [
        'Strong winds that can damage roofs and power lines.',
        'Heavy rainfall causing floods in low-lying areas and cities.',
        'Storm surge and high waves on the coast.',
        'Secondary hazards like landslides in hilly regions.'
      ],
      image: '/images/cyclone-dangers.jpg',
      imageAlt: 'Storm surge',
      reverse: true
    }
  ];

  const imagePaths = [
    '/images/cyclone.jpg',
    '/images/cyclone-2.jpg',
    '/images/cyclone-3.jpg',
    '/images/cyclone-4.jpg',
    '/images/cyclone-5.jpg',
    '/images/cyclone-6.jpg'
  ];

  const topQuestions = [
    {
      q: 'What should I do when a cyclone warning is issued?',
      a: 'Secure loose items, charge phones/power banks, store clean water, and follow official warnings. If told to evacuate, leave early.'
    },
    {
      q: 'Is it safe to go outside during the calm “eye”?',
      a: 'No. Conditions can change suddenly and winds can return quickly from the opposite direction. Stay sheltered until the all-clear.'
    },
    {
      q: 'What is storm surge?',
      a: 'Storm surge is abnormal sea-level rise driven by wind and low pressure. It can push seawater inland and cause coastal flooding.'
    }
  ];

  const prefersReducedMotion = useMemo(() => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }, []);

  const getScrollOffset = () => {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
    return navbarHeight + 12;
  };

  const scrollToHash = (hash, behavior = 'smooth') => {
    const id = (hash || '').replace('#', '').trim();
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : behavior });

    try {
      window.history.replaceState(null, '', `#${id}`);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!location.hash) return;
    const hash = location.hash;
    const t = window.setTimeout(() => scrollToHash(hash, 'auto'), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  return (
    <div className="cyclone-page">
      <header className="cyclone-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container">
          <div className="cyclone-hero-overlay">
            <div className="cyclone-hero-glass">
              <div className="cyclone-hero-content">
                <h1>Cyclone</h1>
                <p>Wind, rain, coastal risk, and what to do.</p>
                <div className="cyclone-hero-actions">
                  <button className="btn btn-primary" onClick={() => navigate('/request-help')}>
                    Request Help
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/missing-persons')}>
                    Missing Persons
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container cyclone-main">
        <nav className="cyclone-jumplinks" aria-label="Quick navigation">
          <a className="cyclone-jumplink" href="#what-is" onClick={(e) => { e.preventDefault(); scrollToHash('#what-is'); }}>
            What is cyclone?
          </a>
          <a className="cyclone-jumplink" href="#sri-lanka" onClick={(e) => { e.preventDefault(); scrollToHash('#sri-lanka'); }}>
            Sri Lanka situation
          </a>
          <a className="cyclone-jumplink" href="#safety" onClick={(e) => { e.preventDefault(); scrollToHash('#safety'); }}>
            Safety rules
          </a>
          <a className="cyclone-jumplink" href="#top-questions" onClick={(e) => { e.preventDefault(); scrollToHash('#top-questions'); }}>
            Top questions
          </a>
          <a className="cyclone-jumplink" href="#what-to-do" onClick={(e) => { e.preventDefault(); scrollToHash('#what-to-do'); }}>
            What to do
          </a>
          <a className="cyclone-jumplink" href="#gallery" onClick={(e) => { e.preventDefault(); scrollToHash('#gallery'); }}>
            Gallery
          </a>
        </nav>

        <div className="cyclone-grid">
          <section className="cyclone-content">
            {splitSections.map((section, idx) => (
              <div
                key={section.title + idx}
                id={idx === 0 ? 'what-is' : undefined}
                className={`card cyclone-card cyclone-split ${section.reverse ? 'reverse' : ''}`}
              >
                <div className="cyclone-split-text">
                  <h2>{section.title}</h2>
                  {Array.isArray(section.body) ? (
                    section.body.every((line) => line.length < 140 && (line.endsWith('.') || line.endsWith(')'))) &&
                    section.body.length > 2 ? (
                      <ul className="cyclone-list">
                        {section.body.map((line, i) => (
                          <li key={line + i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      section.body.map((line, i) => (
                        <p key={line + i} className={i === section.body.length - 1 ? 'cyclone-muted' : undefined}>
                          {line}
                        </p>
                      ))
                    )
                  ) : (
                    <p>{section.body}</p>
                  )}
                </div>

                <div className="cyclone-split-media">
                  <div className="cyclone-split-image">
                    <SafeImage src={section.image} alt={section.imageAlt} loading="lazy" />
                  </div>
                </div>
              </div>
            ))}

            <div className="card cyclone-card" id="sri-lanka">
              <h2>Cyclones and Sri Lanka (Context)</h2>

              <div className="cyclone-pills" aria-label="Quick facts">
                <span className="cyclone-pill cyclone-pill--season">Season: Nov–Dec</span>
                <span className="cyclone-pill cyclone-pill--rain">Heavy rain + flooding</span>
                <span className="cyclone-pill cyclone-pill--wind">Extreme winds</span>
              </div>

              <p>
                Cyclones are relatively rare for Sri Lanka compared to some other Indian Ocean nations, but their
                impacts can be devastating when they occur. Most form in the Bay of Bengal and strike during the
                November–December cyclone season, bringing extreme winds, heavy rains, flooding, and secondary hazards.
              </p>
              <p>
                Historical records include severe storms such as the 1964 Rameswaram cyclone, which caused widespread
                loss of life and property damage in the region.
              </p>

              <div className="cyclone-callouts">
                <div className="cyclone-callout cyclone-callout--warning">
                  <strong>Secondary hazards:</strong> Torrential rain can trigger floods and landslides far from the coast.
                </div>
                <div className="cyclone-callout cyclone-callout--info">
                  <strong>Preparedness:</strong> Robust planning, resilient infrastructure, and coordinated response reduce
                  impacts.
                </div>
              </div>

              <h3 className="cyclone-muted">Key takeaway</h3>
              <p className="cyclone-muted">
                Sri Lanka’s risk can increase in a warming climate, so early warnings and community readiness matter.
              </p>

              <div className="cyclone-inlineGallery" aria-label="Sri Lanka cyclone images">
                <GalleryImage src="/images/cyclone-sri-lanka-1.jpg" alt="Cyclone impacts in Sri Lanka" />
                <GalleryImage src="/images/cyclone-sri-lanka-2.jpg" alt="Flooding and storm damage" />
              </div>
            </div>

            <div className="card cyclone-card" id="safety">
              <h2>Key Safety Rules</h2>
              <div className="cyclone-callouts">
                <div className="cyclone-callout cyclone-callout--danger">
                  <strong>Stay indoors:</strong> Keep away from windows and unsecured roofs.
                </div>
                <div className="cyclone-callout cyclone-callout--warning">
                  <strong>Avoid coastlines:</strong> High waves and storm surge can flood coastal areas.
                </div>
                <div className="cyclone-callout cyclone-callout--info">
                  <strong>Follow alerts:</strong> Trust official warnings and evacuate if instructed.
                </div>
              </div>
            </div>

            <div className="card cyclone-card" id="top-questions">
              <h2>Top Questions</h2>
              <div className="cyclone-faq">
                {topQuestions.map((item) => (
                  <details key={item.q} className="cyclone-faqItem">
                    <summary className="cyclone-faqSummary">{item.q}</summary>
                    <div className="cyclone-faqBody">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="card cyclone-card" id="what-to-do">
              <h2>What To Do In This Situation</h2>
              <div className="cyclone-steps">
                <div>
                  <h3>Before</h3>
                  <ul className="cyclone-list">
                    <li>Secure loose items outside; trim weak branches if possible.</li>
                    <li>Store water, food, and essential medicines for several days.</li>
                    <li>Charge devices; keep a torch and batteries.</li>
                  </ul>
                </div>
                <div>
                  <h3>During</h3>
                  <ul className="cyclone-list">
                    <li>Stay indoors; avoid travel unless evacuation is ordered.</li>
                    <li>Keep away from windows and metal roofs.</li>
                    <li>Do not walk/drive through floodwater.</li>
                  </ul>
                </div>
                <div>
                  <h3>After</h3>
                  <ul className="cyclone-list">
                    <li>Watch for downed lines and damaged buildings.</li>
                    <li>Use safe water; avoid contaminated areas.</li>
                    <li>Request help and report missing persons via this platform.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card cyclone-card" id="gallery">
              <h2>Image Gallery</h2>
              <div className="cyclone-gallery">
                {imagePaths.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Cyclone reference ${idx + 1}`} />
                ))}
              </div>
            </div>
          </section>

          <aside className="cyclone-sidebar">
            <div className="card cyclone-card">
              <h2>How We Help (Platform)</h2>
              <ul className="cyclone-list">
                <li>Submit a help request with location + urgency</li>
                <li>Report / search missing persons</li>
                <li>Volunteer support for relief work</li>
              </ul>
              <div className="cyclone-sidebar-actions">
                <button className="btn btn-accent" onClick={() => navigate('/request-help')}>
                  Create Help Request
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer')}>
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="card cyclone-card">
              <h2>Emergency Numbers (Sri Lanka)</h2>
              <ul className="cyclone-list">
                <li><strong>Police:</strong> 119</li>
                <li><strong>Ambulance:</strong> 1990</li>
                <li><strong>Fire:</strong> 110</li>
                <li><strong>Disaster Management:</strong> 117</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
