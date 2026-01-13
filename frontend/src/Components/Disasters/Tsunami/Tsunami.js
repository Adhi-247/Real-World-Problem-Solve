import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Tsunami.css';

function GalleryImage({ src, alt }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="tsunami-image">
      <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} />
    </div>
  );
}

const Tsunami = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const heroImage = '/images/tsunami.jpg';

  const splitSections = [
    {
      title: 'What is a Tsunami?'
      ,
      body: [
        'A tsunami is a series of long, powerful waves caused by sudden movement of water. The first wave is not always the largest.',
        'If you are near the coast and feel strong shaking, treat it as a natural warning and evacuate immediately.'
      ],
      image: '/images/tsunami-what-is.jpg',
      imageAlt: 'Tsunami waves'
    },
    {
      title: 'Natural Warning Signs'
      ,
      body: [
        'Strong or long earthquake shaking (especially near the coast).',
        'The sea suddenly recedes (water pulls back) exposing the sea floor.',
        'A loud roar from the ocean or unusual rapid changes in sea level.'
      ],
      image: '/images/tsunami-warning-signs.jpg',
      imageAlt: 'Coastal warning sign',
      reverse: true
    }
  ];

  const imagePaths = [
    '/images/tsunami.jpg',
    '/images/tsunami-2.jpg',
    '/images/tsunami-3.jpg',
    '/images/tsunami-4.jpg',
    '/images/tsunami-5.jpg',
    '/images/tsunami-6.jpg'
  ];

  const sriLanka2004Images = [
    '/images/sri-lanka-train-2004.jpg',
    '/images/sri-lanka-tsunami-2004.jpg'
  ];

  const topQuestions = [
    {
      q: 'What is a tsunami?',
      a: 'A tsunami is a series of long waves created by a sudden movement of water, most often from a large undersea earthquake. Waves can arrive minutes to hours apart, and the first wave is not always the largest.'
    },
    {
      q: 'What are the natural warning signs?',
      a: 'Strong or long earthquake shaking near the coast, the sea suddenly pulling back (rapid sea-level drop), or a loud roar from the ocean. If you notice these, evacuate immediately.'
    },
    {
      q: 'How long does a tsunami last?',
      a: 'Tsunami activity can continue for hours. Multiple waves may arrive, and dangerous currents can persist even when the water looks calm.'
    },
    {
      q: 'When is it safe to return?',
      a: 'Return only when local authorities issue an all-clear. Do not return after the first wave.'
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
    <div className="tsunami-page">
      <header className="tsunami-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container">
          <div className="tsunami-hero-overlay">
            <div className="tsunami-hero-glass">
              <div className="tsunami-hero-content">
                <h1>Tsunami</h1>
                <p>What it is, how it starts, and what to do during a tsunami.</p>
                <div className="tsunami-hero-actions">
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

      <main className="container tsunami-main">
        <nav className="tsunami-jumplinks" aria-label="Quick navigation">
          <a className="tsunami-jumplink" href="#what-is" onClick={(e) => { e.preventDefault(); scrollToHash('#what-is'); }}>
            What is a tsunami?
          </a>
          <a className="tsunami-jumplink" href="#sri-lanka-2004" onClick={(e) => { e.preventDefault(); scrollToHash('#sri-lanka-2004'); }}>
            Sri Lanka 2004
          </a>
          <a className="tsunami-jumplink" href="#safety-rules" onClick={(e) => { e.preventDefault(); scrollToHash('#safety-rules'); }}>
            Safety rules
          </a>
          <a className="tsunami-jumplink" href="#top-questions" onClick={(e) => { e.preventDefault(); scrollToHash('#top-questions'); }}>
            Top questions
          </a>
          <a className="tsunami-jumplink" href="#how-starts" onClick={(e) => { e.preventDefault(); scrollToHash('#how-starts'); }}>
            How it starts
          </a>
          <a className="tsunami-jumplink" href="#alerts" onClick={(e) => { e.preventDefault(); scrollToHash('#alerts'); }}>
            Alerts
          </a>
          <a className="tsunami-jumplink" href="#what-to-do" onClick={(e) => { e.preventDefault(); scrollToHash('#what-to-do'); }}>
            What to do
          </a>
          <a className="tsunami-jumplink" href="#gallery" onClick={(e) => { e.preventDefault(); scrollToHash('#gallery'); }}>
            Gallery
          </a>
        </nav>
        <div className="tsunami-grid">
          <section className="tsunami-content">
            {splitSections.map((section, idx) => (
              <div
                key={section.title + idx}
                id={idx === 0 ? 'what-is' : idx === 1 ? 'warning-signs' : undefined}
                className={`card tsunami-card tsunami-split ${section.reverse ? 'reverse' : ''}`}
              >
                <div className="tsunami-split-text">
                  <h2>{section.title}</h2>
                  {Array.isArray(section.body) ? (
                    section.body.every((line) => line.length < 140 && (line.endsWith('.') || line.endsWith(')'))) && section.body.length > 2 ? (
                      <ul className="tsunami-list">
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

                <div className="tsunami-split-media">
                  <div className="tsunami-split-image">
                    <img src={section.image} alt={section.imageAlt} />
                  </div>
                </div>
              </div>
            ))}

            <div className="card tsunami-card">
              <h2>Tsunami Basics (Quick Read)</h2>
              <ul className="tsunami-list">
                <li>A tsunami is usually triggered by a large undersea earthquake.</li>
                <li>The first wave is not always the largest—later waves can be stronger.</li>
                <li>Even small waves can create deadly currents in ports, rivers, and channels.</li>
                <li>Near the coast, strong shaking can be your only warning—evacuate immediately.</li>
              </ul>
            </div>

            <div className="card tsunami-card" id="sri-lanka-2004">
              <h2>2004 Sri Lanka: Tsunami Train Disaster (Peraliya)</h2>
              <p>
                During the 26 December 2004 Indian Ocean tsunami, an overcrowded coastal passenger
                train (the Matara Express, sometimes called the “Queen of the Sea” line) was hit near the
                village of Peraliya. Reports describe a first surge flooding carriages, followed by a larger
                wave minutes later that pushed the train off the track and into nearby trees and homes.
              </p>
              <div className="tsunami-miniGallery" aria-label="Sri Lanka 2004 images">
                {sriLanka2004Images.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Sri Lanka 2004 reference ${idx + 1}`} />
                ))}
              </div>
              <ul className="tsunami-list">
                <li>
                  The train was reported to carry <strong>1,800+</strong> passengers.
                </li>
                <li>
                  Only around <strong>150</strong> passengers were reported to survive.
                </li>
                <li>
                  Death-toll estimates reported around <strong>1,700</strong>, with fewer bodies recovered.
                </li>
              </ul>
              <p className="muted">
                Key lesson: if you are near the coast and feel strong shaking or see sudden sea-level
                changes, do not wait. Move to higher ground immediately.
              </p>
            </div>

            <div className="card tsunami-card" id="safety-rules">
              <h2>Key Safety Rules</h2>
              <div className="tsunami-callouts">
                <div className="tsunami-callout tsunami-callout--danger">
                  <strong>Natural warning:</strong> If you feel strong shaking near the coast, evacuate to higher
                  ground immediately.
                </div>
                <div className="tsunami-callout tsunami-callout--warning">
                  <strong>Multiple waves:</strong> Do not return after the first wave. Waves and dangerous currents
                  can continue for hours.
                </div>
                <div className="tsunami-callout tsunami-callout--info">
                  <strong>If unsure:</strong> Choose safety—go uphill/inland and follow official instructions.
                </div>
              </div>
            </div>

            <div className="card tsunami-card" id="top-questions">
              <h2>Top Questions</h2>
              <div className="tsunami-faq">
                {topQuestions.map((item) => (
                  <details key={item.q} className="tsunami-faqItem">
                    <summary className="tsunami-faqSummary">{item.q}</summary>
                    <div className="tsunami-faqBody">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="card tsunami-card" id="how-starts">
              <h2>How a Tsunami Starts</h2>
              <ul className="tsunami-list">
                <li>Strong undersea earthquake (most common cause)</li>
                <li>Underwater landslide or coastal landslide</li>
                <li>Volcanic eruption near/under the sea</li>
                <li>Meteor impact (rare)</li>
              </ul>
              <p className="muted">
                Natural warning signs include strong shaking, sudden sea level drop, or a loud roar from
                the ocean.
              </p>
            </div>

            <div className="card tsunami-card" id="alerts">
              <h2>Tsunami Alerts & Warning Systems</h2>
              <p>
                A tsunami can arrive in minutes (near-source) or hours (far-source). Official alerts may
                come from sirens, radio/TV, SMS alerts, or local authorities. Never wait for an “all clear”
                if you feel strong shaking near the coast—evacuate first.
              </p>
              <ul className="tsunami-list">
                <li>
                  <strong>Warning:</strong> A tsunami is expected—move inland/uphill immediately.
                </li>
                <li>
                  <strong>Advisory:</strong> Strong currents possible—stay away from beaches and harbors.
                </li>
                <li>
                  <strong>Watch:</strong> A tsunami is possible—stay alert and prepare to evacuate.
                </li>
              </ul>
              <div className="tsunami-callout tsunami-callout--info">
                <strong>Tip:</strong> If you’re unsure, choose safety—go to higher ground.
              </div>
            </div>

            <div className="card tsunami-card" id="what-to-do">
              <h2>What To Do In This Situation</h2>
              <div className="tsunami-steps">
                <div>
                  <h3>Before</h3>
                  <ul className="tsunami-list">
                    <li>Know your nearest high ground and evacuation routes.</li>
                    <li>Prepare a small emergency bag (water, meds, flashlight, power bank).</li>
                    <li>Save emergency numbers and keep a charged phone.</li>
                    <li>Talk with family about a meeting point if you get separated.</li>
                  </ul>
                </div>
                <div>
                  <h3>During</h3>
                  <ul className="tsunami-list">
                    <li>If you feel strong shaking: evacuate immediately to higher ground.</li>
                    <li>Do not go to the beach to “watch waves”.</li>
                    <li>Follow official instructions (sirens, police, local disaster authorities).</li>
                    <li>
                      If you’re in a vehicle and traffic is blocked, leave it and evacuate on foot.
                    </li>
                    <li>
                      If you’re on a <strong>train/bus near the coast</strong>, get off and evacuate uphill/inland—don’t
                      remain in low-lying areas or wait for instructions if natural warning signs are present.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3>After</h3>
                  <ul className="tsunami-list">
                    <li>Stay away from the coast until authorities say it’s safe.</li>
                    <li>Check for injuries and give first aid if trained.</li>
                    <li>Use this platform to request help and report missing persons.</li>
                    <li>Watch out for downed power lines, gas leaks, and unstable buildings.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card tsunami-card" id="evacuation">
              <h2>Evacuation Tips (Quick)</h2>
              <ul className="tsunami-list">
                <li>
                  Go <strong>uphill or inland</strong>—even a small increase in elevation can help.
                </li>
                <li>
                  Avoid rivers and channels—tsunami waves can travel far inland through waterways.
                </li>
                <li>
                  If you can’t reach high ground, go to the <strong>upper floors</strong> of a strong building.
                </li>
                <li>Do not return after the first wave; multiple waves can follow.</li>
              </ul>
            </div>

            <div className="card tsunami-card" id="boat-harbor">
              <h2>If You’re at the Beach, Harbor, or on a Boat</h2>
              <ul className="tsunami-list">
                <li>
                  At the shore/harbor: move away from the coastline immediately; strong currents can be
                  deadly even without a huge wave.
                </li>
                <li>
                  If you’re on a boat in a harbor: follow harbor master instructions; don’t try to drive
                  through flooded streets to “save the boat”.
                </li>
                <li>
                  If you’re already offshore in deep water and have time: authorities may advise staying
                  at sea rather than entering a port (conditions vary—follow local guidance).
                </li>
              </ul>
              <p className="muted">Always follow official instructions when available.</p>
            </div>

            <div className="card tsunami-card" id="after-safety">
              <h2>Health & Safety After a Tsunami</h2>
              <ul className="tsunami-list">
                <li>Use clean water only; floodwater may be contaminated.</li>
                <li>Wear shoes/gloves if walking through debris.</li>
                <li>Check neighbors who may need help (elderly, children, injured).</li>
                <li>Document damage if it’s safe, and report hazards to authorities.</li>
              </ul>
            </div>

            <div className="card tsunami-card" id="gallery">
              <h2>Image Gallery</h2>

              <div className="tsunami-gallery">
                {imagePaths.map((src, idx) => (
                  <GalleryImage key={src + idx} src={src} alt={`Tsunami reference ${idx + 1}`} />
                ))}
              </div>
            </div>
          </section>

          <aside className="tsunami-sidebar">
            <div className="card tsunami-card">
              <h2>How We Help (Platform)</h2>
              <ul className="tsunami-list">
                <li>Submit a help request with location + urgency</li>
                <li>Report / search missing persons</li>
                <li>Apply as a volunteer to support relief work</li>
              </ul>
              <div className="tsunami-sidebar-actions">
                <button className="btn btn-accent" onClick={() => navigate('/request-help')}>
                  Create Help Request
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer')}>
                  Become a Volunteer
                </button>
              </div>
            </div>

            <div className="card tsunami-card">
              <h2>Emergency Numbers (Sri Lanka)</h2>
              <ul className="tsunami-list">
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

export default Tsunami;
