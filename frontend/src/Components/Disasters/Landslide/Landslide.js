import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Landslide.css';

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
    <div className="landslide-image">
      <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} />
    </div>
  );
}

export default function Landslide() {
  const navigate = useNavigate();
  const location = useLocation();

  // Images expected in: frontend/public/images
  const heroImage = '/images/landslide1.jpg';

  const splitSections = [
    {
      title: 'What is a Landslide?',
      body: [
        'A landslide is the rapid movement of soil, rocks, and debris down a slope. Landslides can happen during or after heavy rain, especially in steep terrain.',
        'In Sri Lanka, landslides are a serious risk in hill-country areas during intense monsoon periods.'
      ],
      image: '/images/landslide-what-is.jpg',
      imageAlt: 'Landslide debris'
    },
    {
      title: 'Common Triggers',
      body: [
        'Prolonged heavy rainfall that saturates the soil.',
        'Slope cutting for roads/buildings without proper drainage.',
        'Deforestation and loss of vegetation that stabilizes soil.',
        'Blocked drains and poor water management on slopes.'
      ],
      image: '/images/landslide-triggers.jpg',
      imageAlt: 'Slope failure',
      reverse: true
    }
  ];

  const imagePaths = [
    '/images/landslide.jpg',
    '/images/landslide-2.jpg',
    '/images/landslide-3.jpg',
    '/images/landslide-4.jpg',
    '/images/landslide-5.jpg',
    '/images/landslide-6.jpg'
  ];

  const topQuestions = [
    {
      q: 'What are warning signs of a possible landslide?',
      a: 'New cracks in the ground or walls, doors/windows suddenly sticking, tilted trees/poles, unusual sounds (cracking/rumbling), or water suddenly appearing where it usually doesn’t.'
    },
    {
      q: 'Should I stay if rain is heavy?',
      a: 'If you are in a known risk area and authorities advise evacuation, leave early. Night-time landslides are especially dangerous because visibility is low.'
    },
    {
      q: 'Where is the safest place to go?',
      a: 'Move away from steep slopes and drainage channels. Go to stable higher ground and follow local evacuation guidance.'
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
    <div className="landslide-page">
      <header className="landslide-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container">
          <div className="landslide-hero-overlay">
            <div className="landslide-hero-glass">
              <div className="landslide-hero-content">
                <h1>Landslide</h1>
                <p>Warning signs, triggers, and what to do.</p>
                <div className="landslide-hero-actions">
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

      <main className="container landslide-main">
        <nav className="landslide-jumplinks" aria-label="Quick navigation">
          <a className="landslide-jumplink" href="#what-is" onClick={(e) => { e.preventDefault(); scrollToHash('#what-is'); }}>
            What is landslide?
          </a>
          <a className="landslide-jumplink" href="#sri-lanka" onClick={(e) => { e.preventDefault(); scrollToHash('#sri-lanka'); }}>
            Sri Lanka situation
          </a>
          <a className="landslide-jumplink" href="#safety" onClick={(e) => { e.preventDefault(); scrollToHash('#safety'); }}>
            Safety rules
          </a>
          <a className="landslide-jumplink" href="#top-questions" onClick={(e) => { e.preventDefault(); scrollToHash('#top-questions'); }}>
            Top questions
          </a>
          <a className="landslide-jumplink" href="#what-to-do" onClick={(e) => { e.preventDefault(); scrollToHash('#what-to-do'); }}>
            What to do
          </a>
          <a className="landslide-jumplink" href="#gallery" onClick={(e) => { e.preventDefault(); scrollToHash('#gallery'); }}>
            Gallery
          </a>
        </nav>

        <div className="landslide-grid">
          <section className="landslide-content">
            {splitSections.map((section, idx) => (
              <div
                key={section.title + idx}
                id={idx === 0 ? 'what-is' : undefined}
                className={`card landslide-card landslide-split ${section.reverse ? 'reverse' : ''}`}
              >
                <div className="landslide-split-text">
                  <h2>{section.title}</h2>
                  {Array.isArray(section.body) ? (
                    section.body.every((line) => line.length < 140 && (line.endsWith('.') || line.endsWith(')'))) &&
                    section.body.length > 2 ? (
                      <ul className="landslide-list">
                        {section.body.map((line, i) => (
                          <li key={line + i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      section.body.map((line, i) => (
                        <p key={line + i} className={i === section.body.length - 1 ? 'landslide-muted' : undefined}>
                          {line}
                        </p>
                      ))
                    )
                  ) : (
                    <p>{section.body}</p>
                  )}
                </div>

                <div className="landslide-split-media">
                  <div className="landslide-split-image">
                    <SafeImage src={section.image} alt={section.imageAlt} loading="lazy" />
                  </div>
                </div>
              </div>
            ))}

            <div className="card landslide-card" id="sri-lanka">
              <h2>Landslides in Sri Lanka (Context)</h2>

              <div className="landslide-pills" aria-label="Quick facts">
                <span className="landslide-pill landslide-pill--rain">Monsoon rain</span>
                <span className="landslide-pill landslide-pill--rain">Cyclone rain-bands</span>
                <span className="landslide-pill landslide-pill--neutral">Hilly regions risk</span>
              </div>

              <p>
                Landslides are a recurring natural hazard in Sri Lanka, mainly triggered by heavy monsoon rains,
                cyclones, and saturated soils in the central hilly and mountainous regions such as Badulla, Nuwara Eliya,
                Ratnapura, and Kandy.
              </p>
              <p>
                Historic events such as the 2014 Badulla landslide showed how intense rainfall can cause entire
                hillsides to collapse, killing dozens and displacing hundreds, while improper land use and deforestation
                worsen slope instability.
              </p>

              <div className="landslide-callouts">
                <div className="landslide-callout landslide-callout--warning">
                  <strong>Impacts:</strong> Landslides can bury homes and farmland, block roads, and disrupt rescue
                  operations.
                </div>
                <div className="landslide-callout landslide-callout--danger">
                  <strong>Heavy rain compounding risk:</strong> After major storm events, repeated slope failures are more
                  likely because soils stay saturated.
                </div>
              </div>

              <h3 className="landslide-muted">Why it matters</h3>
              <ul className="landslide-list">
                <li>Early warning systems help people evacuate sooner.</li>
                <li>Slope drainage and management reduce instability.</li>
                <li>Avoiding development in high-risk zones reduces loss of life and property.</li>
              </ul>

              <div className="landslide-inlineGallery" aria-label="Sri Lanka landslide images">
                <GalleryImage src="/images/landslide-sri-lanka-1.jpg" alt="Landslide impact in Sri Lanka" />
                <GalleryImage src="/images/landslide-sri-lanka-2.jpeg" alt="Slope collapse and debris" />
              </div>
            </div>

            <div className="card landslide-card" id="safety">
              <h2>Key Safety Rules</h2>
              <div className="landslide-callouts">
                <div className="landslide-callout landslide-callout--danger">
                  <strong>Leave early:</strong> If you are in a risk zone and heavy rain continues, evacuate early.
                </div>
                <div className="landslide-callout landslide-callout--warning">
                  <strong>Avoid slope paths:</strong> Stay away from steep slopes and drainage channels.
                </div>
                <div className="landslide-callout landslide-callout--info">
                  <strong>Watch for signs:</strong> Cracks, rumbling sounds, tilted trees, and sudden water flow changes.
                </div>
              </div>
            </div>

            <div className="card landslide-card" id="top-questions">
              <h2>Top Questions</h2>
              <div className="landslide-faq">
                {topQuestions.map((item) => (
                  <details key={item.q} className="landslide-faqItem">
                    <summary className="landslide-faqSummary">{item.q}</summary>
                    <div className="landslide-faqBody">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="card landslide-card" id="what-to-do">
              <h2>What To Do In This Situation</h2>
              <div className="landslide-steps">
                <div>
                  <h3>Before</h3>
                  <ul className="landslide-list">
                    <li>Know if your area is flagged as landslide-prone by authorities.</li>
                    <li>Keep drains clear; avoid letting water flow onto slopes.</li>
                    <li>Prepare an emergency bag and a family evacuation plan.</li>
                  </ul>
                </div>
                <div>
                  <h3>During</h3>
                  <ul className="landslide-list">
                    <li>Evacuate if warned; do not wait until night or until you hear rumbling.</li>
                    <li>Move away from the direction of the slide path.</li>
                    <li>Do not cross active slide areas or flooded slope roads.</li>
                  </ul>
                </div>
                <div>
                  <h3>After</h3>
                  <ul className="landslide-list">
                    <li>Stay away from the area; secondary slides can occur.</li>
                    <li>Report missing persons and request help using this platform.</li>
                    <li>Watch for damaged utilities and unstable structures.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card landslide-card" id="gallery">
              <h2>Image Gallery</h2>
              <div className="landslide-gallery">
                {imagePaths.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Landslide reference ${idx + 1}`} />
                ))}
              </div>
            </div>
          </section>

          <aside className="landslide-sidebar">
            <div className="card landslide-card">
              <h2>How We Help (Platform)</h2>
              <ul className="landslide-list">
                <li>Submit a help request with location + urgency</li>
                <li>Report / search missing persons</li>
                <li>Volunteer support for relief work</li>
              </ul>
              <div className="landslide-sidebar-actions">
                <button className="btn btn-accent" onClick={() => navigate('/request-help')}>
                  Create Help Request
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer')}>
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="card landslide-card">
              <h2>Emergency Numbers (Sri Lanka)</h2>
              <ul className="landslide-list">
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
