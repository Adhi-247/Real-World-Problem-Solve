import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Wildfire.css';

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
    <div className="wildfire-image">
      <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} />
    </div>
  );
}

export default function Wildfire() {
  const navigate = useNavigate();
  const location = useLocation();

  // Images expected in: frontend/public/images
  const heroImage = '/images/wildfire1.jpg';

  const splitSections = [
    {
      title: 'What is a Wildfire?',
      body: [
        'A wildfire is an uncontrolled fire in vegetation such as forests, grasslands, or scrub. It can spread quickly depending on wind, dryness, and fuel (dry leaves/grass).',
        'Many wildfires are started by human activity (burning, discarded cigarettes, sparks), and spread faster during hot, dry periods.'
      ],
      image: '/images/wildfire-what-is.jpg',
      imageAlt: 'Wildfire smoke'
    },
    {
      title: 'Monitoring Fires (Sri Lanka)',
      body: [
        'Fire risk changes over time. Dashboards like Global Forest Watch show fire alerts and trends using satellite data (VIIRS).',
        'Use official local alerts first. Satellite alerts are helpful for awareness but are not the same as an evacuation order.'
      ],
      image: '/images/wildfire-monitoring.jpg',
      imageAlt: 'Forest fire monitoring',
      reverse: true
    }
  ];

  const imagePaths = [
    '/images/wildfire.jpg',
    '/images/wildfire-2.jpg',
    '/images/wildfire-3.jpg',
    '/images/wildfire-4.jpg',
    '/images/wildfire-5.jpg',
    '/images/wildfire-6.jpg'
  ];

  const topQuestions = [
    {
      q: 'What should I do if smoke is near my home?',
      a: 'Stay indoors if possible, close windows/doors, and use a mask if you must go outside. If authorities advise evacuation, leave early.'
    },
    {
      q: 'Should I try to fight the fire myself?',
      a: 'Only attempt small spot fires if it is safe and you have the right tools. Do not risk your life—call emergency services and evacuate if fire is spreading.'
    },
    {
      q: 'What causes most wildfires?',
      a: 'Common causes are human activities (burning waste/land clearing, unattended cooking fires, cigarettes) plus dry weather and wind that help fires spread.'
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
    <div className="wildfire-page">
      <header className="wildfire-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container">
          <div className="wildfire-hero-overlay">
            <div className="wildfire-hero-glass">
              <div className="wildfire-hero-content">
                <h1>Wildfire</h1>
                <p>What it is, how it spreads, and what to do.</p>
                <div className="wildfire-hero-actions">
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

      <main className="container wildfire-main">
        <nav className="wildfire-jumplinks" aria-label="Quick navigation">
          <a className="wildfire-jumplink" href="#what-is" onClick={(e) => { e.preventDefault(); scrollToHash('#what-is'); }}>
            What is wildfire?
          </a>
          <a className="wildfire-jumplink" href="#sri-lanka" onClick={(e) => { e.preventDefault(); scrollToHash('#sri-lanka'); }}>
            Sri Lanka situation
          </a>
          <a className="wildfire-jumplink" href="#safety" onClick={(e) => { e.preventDefault(); scrollToHash('#safety'); }}>
            Safety rules
          </a>
          <a className="wildfire-jumplink" href="#top-questions" onClick={(e) => { e.preventDefault(); scrollToHash('#top-questions'); }}>
            Top questions
          </a>
          <a className="wildfire-jumplink" href="#what-to-do" onClick={(e) => { e.preventDefault(); scrollToHash('#what-to-do'); }}>
            What to do
          </a>
          <a className="wildfire-jumplink" href="#gallery" onClick={(e) => { e.preventDefault(); scrollToHash('#gallery'); }}>
            Gallery
          </a>
        </nav>

        <div className="wildfire-grid">
          <section className="wildfire-content">
            {splitSections.map((section, idx) => (
              <div
                key={section.title + idx}
                id={idx === 0 ? 'what-is' : undefined}
                className={`card wildfire-card wildfire-split ${section.reverse ? 'reverse' : ''}`}
              >
                <div className="wildfire-split-text">
                  <h2>{section.title}</h2>
                  {Array.isArray(section.body) ? (
                    section.body.every((line) => line.length < 140 && (line.endsWith('.') || line.endsWith(')'))) &&
                    section.body.length > 2 ? (
                      <ul className="wildfire-list">
                        {section.body.map((line, i) => (
                          <li key={line + i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      section.body.map((line, i) => (
                        <p key={line + i} className={i === section.body.length - 1 ? 'wildfire-muted' : undefined}>
                          {line}
                        </p>
                      ))
                    )
                  ) : (
                    <p>{section.body}</p>
                  )}
                </div>

                <div className="wildfire-split-media">
                  <div className="wildfire-split-image">
                    <SafeImage src={section.image} alt={section.imageAlt} loading="lazy" />
                  </div>
                </div>
              </div>
            ))}

            <div className="card wildfire-card" id="sri-lanka">
              <h2>Wildfires in Sri Lanka (Recent Situation)</h2>

              <div className="wildfire-pills" aria-label="Quick facts">
                <span className="wildfire-pill wildfire-pill--warm">Dry seasons: Feb–Mar</span>
                <span className="wildfire-pill wildfire-pill--warm">Dry seasons: Jul–Aug</span>
                <span className="wildfire-pill wildfire-pill--neutral">Mostly human-caused</span>
              </div>

              <p>
                Wildfires in Sri Lanka, though not as vast or frequent as those in some other countries, have become an
                increasing environmental concern, especially during dry periods in the February–March and July–August
                seasons.
              </p>
              <p>
                Most forest fires on the island are caused by humans—often from slash-and-burn agriculture, land
                clearing, unattended campfires, or discarded cigarettes—rather than natural ignition sources like
                lightning.
              </p>

              <div className="wildfire-callouts">
                <div className="wildfire-callout wildfire-callout--warning">
                  <strong>Early 2025 snapshot:</strong> Sri Lanka recorded more than 40 small and large fires.
                </div>
                <div className="wildfire-callout wildfire-callout--danger">
                  <strong>Ravana Ella Sanctuary:</strong> A significant blaze destroyed over 240 hectares of forest habitat,
                  threatening biodiversity and local ecosystems.
                </div>
              </div>

              <div className="wildfire-inlineGallery" aria-label="Sri Lanka wildfire images">
                <GalleryImage src="/images/wildfire-sri-lanka-1.jpg" alt="Wildfire impact in Sri Lanka" />
                <GalleryImage src="/images/wildfire-sri-lanka-2.jpg" alt="Forest habitat affected by fire" />
              </div>

              <h3 className="wildfire-muted">Why the risk can increase</h3>
              <ul className="wildfire-list">
                <li>
                  Climate change is expected to raise drought frequency and temperatures, drying fuels and increasing
                  fire likelihood.
                </li>
                <li>
                  Strong dry winds and lower humidity can accelerate spread in grasslands and forests.
                </li>
                <li>
                  Limited firefighting resources can make suppression difficult, especially in rugged terrain.
                </li>
              </ul>

              <p className="wildfire-muted">
                This is why prevention and monitoring matter—protecting both people and wildlife.
              </p>
            </div>

            <div className="card wildfire-card" id="safety">
              <h2>Key Safety Rules</h2>
              <div className="wildfire-callouts">
                <div className="wildfire-callout wildfire-callout--danger">
                  <strong>Evacuate early:</strong> If authorities advise evacuation, leave immediately.
                </div>
                <div className="wildfire-callout wildfire-callout--warning">
                  <strong>Smoke is dangerous:</strong> Limit exposure; keep children/elderly safe.
                </div>
                <div className="wildfire-callout wildfire-callout--info">
                  <strong>Stay informed:</strong> Follow official updates; avoid rumors.
                </div>
              </div>
            </div>

            <div className="card wildfire-card" id="top-questions">
              <h2>Top Questions</h2>
              <div className="wildfire-faq">
                {topQuestions.map((item) => (
                  <details key={item.q} className="wildfire-faqItem">
                    <summary className="wildfire-faqSummary">{item.q}</summary>
                    <div className="wildfire-faqBody">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="card wildfire-card" id="what-to-do">
              <h2>What To Do In This Situation</h2>
              <div className="wildfire-steps">
                <div>
                  <h3>Before</h3>
                  <ul className="wildfire-list">
                    <li>Clear dry leaves/grass near your home if you live near vegetation.</li>
                    <li>Prepare a go-bag (water, meds, documents, flashlight, power bank).</li>
                    <li>Plan evacuation routes and a family meeting point.</li>
                  </ul>
                </div>
                <div>
                  <h3>During</h3>
                  <ul className="wildfire-list">
                    <li>Follow evacuation orders; do not wait until smoke is thick.</li>
                    <li>Keep windows/doors closed; use a mask if outside.</li>
                    <li>Avoid driving through heavy smoke.</li>
                  </ul>
                </div>
                <div>
                  <h3>After</h3>
                  <ul className="wildfire-list">
                    <li>Return only when authorities say it’s safe.</li>
                    <li>Watch for hotspots/embers; report fire re-ignition.</li>
                    <li>Use this platform to request help or report missing persons.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card wildfire-card" id="gallery">
              <h2>Image Gallery</h2>
              <div className="wildfire-gallery">
                {imagePaths.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Wildfire reference ${idx + 1}`} />
                ))}
              </div>
            </div>
          </section>

          <aside className="wildfire-sidebar">
            <div className="card wildfire-card">
              <h2>How We Help (Platform)</h2>
              <ul className="wildfire-list">
                <li>Submit a help request with location + urgency</li>
                <li>Report / search missing persons</li>
                <li>Volunteer support for relief work</li>
              </ul>
              <div className="wildfire-sidebar-actions">
                <button className="btn btn-accent" onClick={() => navigate('/request-help')}>
                  Create Help Request
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer')}>
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="card wildfire-card">
              <h2>Emergency Numbers (Sri Lanka)</h2>
              <ul className="wildfire-list">
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
