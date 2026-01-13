import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Floods.css';

function GalleryImage({ src, alt }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="floods-image">
      <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} />
    </div>
  );
}

const Floods = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const heroImage = '/images/floods1.jpg';

  const splitSections = [
    {
      title: 'What is a Flood?',
      body: [
        'A flood happens when water covers land that is normally dry. In Sri Lanka, floods often follow intense monsoon rain, overflowing rivers, and drainage that can’t carry water away fast enough.',
        'Flooding can be sudden (flash floods) or slow (river floods), and both can become dangerous very quickly.'
      ],
      image: '/images/floods1.jpg',
      imageAlt: 'Flooded road'
    },
    {
      title: 'Why Flood Risk is Increasing',
      body: [
        'Heavier rainfall events are becoming more common, and flood impacts increase when cities grow without enough drainage.',
        'Loss of wetlands and natural water-absorbing areas makes flooding worse, especially around urban zones.',
        'Blocked canals, river encroachment, and unsafe development near floodplains increase damage and displacement.'
      ],
      image: '/images/floods-risk.jpg',
      imageAlt: 'High water level',
      reverse: true
    }
  ];

  const imagePaths = [
    '/images/floods.jpg',
    '/images/floods-2.jpg',
    '/images/floods-3.jpg',
    '/images/floods-4.jpg',
    '/images/floods-5.jpg',
    '/images/floods-6.jpg'
  ];

  const sriLankaFloodHistoryImages = [
    '/images/floods-history-1.jpeg',
    '/images/floods-history-2.jpg'
  ];

  const topQuestions = [
    {
      q: 'What should I do first if water starts rising?',
      a: 'Move family members to higher ground, switch off electricity if safe, and follow official warnings. Avoid walking or driving through floodwater.'
    },
    {
      q: 'Is floodwater dangerous even if it looks shallow?',
      a: 'Yes. Floodwater can hide open drains and debris, contain sewage or chemicals, and moving water can knock you down even at ankle/knee depth.'
    },
    {
      q: 'When is it safe to return home?',
      a: 'Return only when authorities say it’s safe. Check for structural damage, gas leaks, and electrical hazards before using power.'
    },
    {
      q: 'How can I reduce flood risk at home?',
      a: 'Keep drains clear, store valuables higher, prepare sandbags if needed, and know evacuation routes. If you live in a floodplain, plan early for relocation during heavy rain warnings.'
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
    <div className="floods-page">
      <header className="floods-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container">
          <div className="floods-hero-overlay">
            <div className="floods-hero-glass">
              <div className="floods-hero-content">
                <h1>Floods</h1>
                <p>Sri Lanka flood risk, why it happens, and what to do.</p>
                <div className="floods-hero-actions">
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

      <main className="container floods-main">
        <nav className="floods-jumplinks" aria-label="Quick navigation">
          <a className="floods-jumplink" href="#what-is" onClick={(e) => { e.preventDefault(); scrollToHash('#what-is'); }}>
            What is a flood?
          </a>
          <a className="floods-jumplink" href="#sri-lanka" onClick={(e) => { e.preventDefault(); scrollToHash('#sri-lanka'); }}>
            Sri Lanka context
          </a>
          <a className="floods-jumplink" href="#safety" onClick={(e) => { e.preventDefault(); scrollToHash('#safety'); }}>
            Safety rules
          </a>
          <a className="floods-jumplink" href="#top-questions" onClick={(e) => { e.preventDefault(); scrollToHash('#top-questions'); }}>
            Top questions
          </a>
          <a className="floods-jumplink" href="#what-to-do" onClick={(e) => { e.preventDefault(); scrollToHash('#what-to-do'); }}>
            What to do
          </a>
          <a className="floods-jumplink" href="#gallery" onClick={(e) => { e.preventDefault(); scrollToHash('#gallery'); }}>
            Gallery
          </a>
        </nav>

        <div className="floods-grid">
          <section className="floods-content">
            {splitSections.map((section, idx) => (
              <div
                key={section.title + idx}
                id={idx === 0 ? 'what-is' : idx === 1 ? 'risk-increasing' : undefined}
                className={`card floods-card floods-split ${section.reverse ? 'reverse' : ''}`}
              >
                <div className="floods-split-text">
                  <h2>{section.title}</h2>
                  {Array.isArray(section.body) ? (
                    section.body.every((line) => line.length < 140 && (line.endsWith('.') || line.endsWith(')'))) &&
                    section.body.length > 2 ? (
                      <ul className="floods-list">
                        {section.body.map((line, i) => (
                          <li key={line + i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      section.body.map((line, i) => (
                        <p key={line + i} className={i === section.body.length - 1 ? 'muted' : undefined}>
                          {line}
                        </p>
                      ))
                    )
                  ) : (
                    <p>{section.body}</p>
                  )}
                </div>

                <div className="floods-split-media">
                  <div className="floods-split-image">
                    <img src={section.image} alt={section.imageAlt} />
                  </div>
                </div>
              </div>
            ))}

            <div className="card floods-card" id="sri-lanka">
              <h2>Sri Lanka: A Pattern of Repeated Flooding (Summary)</h2>
              <p>
                Sri Lanka’s flood history shows a shift from older, less frequent events to more regular, wider-area flooding in recent decades.
                Public reporting points to a combination of intense rainfall, unplanned urban growth, reduced wetlands, and development in floodplains.
              </p>
              <div className="floods-miniGallery" aria-label="Flood history images">
                {sriLankaFloodHistoryImages.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Flood history reference ${idx + 1}`} />
                ))}
              </div>
              <ul className="floods-list">
                <li><strong>Hill country rivers</strong> can overflow after heavy rain, disrupting roads and rail.</li>
                <li><strong>Eastern / dry-zone systems</strong> can flood during extreme rain and cyclones.</li>
                <li><strong>Urban flooding</strong> increases when wetlands shrink and drainage is blocked.</li>
              </ul>
              <p className="muted">
                This section is a paraphrased summary inspired by public reporting (not copied text).
              </p>
            </div>

            <div className="card floods-card" id="safety">
              <h2>Key Safety Rules</h2>
              <div className="floods-callouts">
                <div className="floods-callout floods-callout--danger">
                  <strong>Don’t enter floodwater:</strong> Avoid walking or driving through it.
                </div>
                <div className="floods-callout floods-callout--warning">
                  <strong>Electricity risk:</strong> Switch off power if safe. Stay away from downed lines.
                </div>
                <div className="floods-callout floods-callout--info">
                  <strong>Move early:</strong> If water rises fast, go to higher ground and follow official alerts.
                </div>
              </div>
            </div>

            <div className="card floods-card" id="top-questions">
              <h2>Top Questions</h2>
              <div className="floods-faq">
                {topQuestions.map((item) => (
                  <details key={item.q} className="floods-faqItem">
                    <summary className="floods-faqSummary">{item.q}</summary>
                    <div className="floods-faqBody">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="card floods-card" id="what-to-do">
              <h2>What To Do In This Situation</h2>
              <div className="floods-steps">
                <div>
                  <h3>Before</h3>
                  <ul className="floods-list">
                    <li>Check weather warnings and know your nearest safe shelter.</li>
                    <li>Keep documents in a waterproof bag and charge phones/power banks.</li>
                    <li>Clear drains near your home; keep sandbags if you are in a flood-prone area.</li>
                  </ul>
                </div>
                <div>
                  <h3>During</h3>
                  <ul className="floods-list">
                    <li>Move to higher ground; evacuate early if instructed.</li>
                    <li>Avoid bridges over fast-flowing water and do not cross flooded roads.</li>
                    <li>Keep children away from drains/canals and open water.</li>
                  </ul>
                </div>
                <div>
                  <h3>After</h3>
                  <ul className="floods-list">
                    <li>Return only when authorities say it’s safe.</li>
                    <li>Use clean water only; floodwater may be contaminated.</li>
                    <li>Report hazards and request help through this platform if needed.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card floods-card" id="gallery">
              <h2>Image Gallery</h2>
              <div className="floods-gallery">
                {imagePaths.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Floods reference ${idx + 1}`} />
                ))}
              </div>
            </div>
          </section>

          <aside className="floods-sidebar">
            <div className="card floods-card">
              <h2>How We Help (Platform)</h2>
              <ul className="floods-list">
                <li>Submit a help request with location + urgency</li>
                <li>Report / search missing persons</li>
                <li>Volunteer support for relief work</li>
              </ul>
              <div className="floods-sidebar-actions">
                <button className="btn btn-accent" onClick={() => navigate('/request-help')}>
                  Create Help Request
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer')}>
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="card floods-card">
              <h2>Emergency Numbers (Sri Lanka)</h2>
              <ul className="floods-list">
                <li>
                  <strong>Police:</strong> 119
                </li>
                <li>
                  <strong>Ambulance:</strong> 1990
                </li>
                <li>
                  <strong>Fire:</strong> 110
                </li>
                <li>
                  <strong>Disaster Management:</strong> 117
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Floods;
