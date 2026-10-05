import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import JsonLd from '@/components/JsonLd';
import AboutScrollHandler from '@/components/AboutScrollHandler';

export const metadata: Metadata = {
  title: 'About Us - Architectural Atelier, Lineage & Coro Crafted Collective Partnership',
  description:
    'Ace Spaces is a Bengaluru-based architectural fabrication atelier and master raw material distributor for DuPont™ Corian®. Discover our code-meets-craft philosophy, 0% silica commitment, and symbiotic partnership powering Coro Crafted Collective.',
  keywords: [
    'about Ace Spaces',
    'Coro Crafted Collective sister brand',
    'DuPont Corian partner India',
    'architectural solid surface foundry',
    'zero-silica atelier Bengaluru',
    'monolithic architecture practice',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/about',
  },
  openGraph: {
    title: 'About Us - Architectural Practice & Atelier | Ace Spaces',
    description:
      'We are architects, digital fabricators, and master joiners founded in Bengaluru to dissolve the seams that divide contemporary space.',
    url: 'https://acespacesindia.vercel.app/about',
    images: [
      {
        url: '/images/images/app_commercial_bleached_nuwood.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Atelier Craft & Philosophy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Ace Spaces',
    description:
      'Architectural fabrication atelier, DuPont™ Corian® partnership, and the lineage powering Coro Crafted Collective in India.',
    images: ['/images/images/app_commercial_bleached_nuwood.jpg'],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ace Spaces',
  url: 'https://acespacesindia.vercel.app/about',
  description:
    'Ace Spaces is an architectural fabrication atelier, mineral solid surface distributor, and engineering facility in Bengaluru, India.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Ace Spaces',
    legalName: 'Ace Spaces Private Limited',
    foundingLocation: 'Bengaluru, India',
    knowsAbout: ['DuPont™ Corian® Solid Surface', 'Zero-Silica Mineral Craft', '5-Axis CNC Milling', 'Thermoforming'],
    subOrganization: {
      '@type': 'Organization',
      name: 'Coro Crafted Collective',
      description: 'Bespoke spatial interiors and collectible monolithic furniture powered by Ace Spaces.',
    },
  },
};

export default function AboutPage() {
  const philosophyPillars = [
    {
      num: '01',
      title: 'Monolithic Continuity',
      subtitle: 'Dissolving the Joint',
      body: 'We believe modern architecture is compromised when fragmented by visible joints. Through molecularly fused acrylic bonding and inconspicuous seam chemistry, our surfaces flow uninterrupted across kitchen islands, wall planes, and wet areas, eliminating visual clutter and grime-harboring grout lines.',
    },
    {
      num: '02',
      title: 'The Symbiosis of Code & Hand',
      subtitle: 'Digital Precision + Artisan Mastery',
      body: 'True spatial luxury cannot be achieved by machine or hand alone. Our 5-axis CNC routers mill CAD cutouts to under 0.2mm tolerances, while our seasoned joiners and thermoforming craftsmen hand-shape complex curvatures and finish every edge with a 600-grit velvety satin touch.',
    },
    {
      num: '03',
      title: 'Radical Material Honesty & Health',
      subtitle: 'Zero-Silica Mineral Substrates',
      body: 'We refuse to specify materials that jeopardize the health of stone fabricators or homeowners. Unlike engineered quartz that releases lethal crystalline silica dust, our mineral-acrylic matrix contains 100% zero crystalline silica, is non-porous, NSF food-safe, and repairable in situ for life.',
    },
    {
      num: '04',
      title: 'Architect-to-Architect Co-Creation',
      subtitle: "Your Studio's Technical Extension",
      body: 'We are not a distant building supply outlet. We act as an active fabrication partner for architects and interior designers across India. From initial CAD shop drawings and structural sub-framing calculations to laser templating and on-site assembly, we bring ambitious concepts to reality.',
    },
    {
      num: '05',
      title: 'Thermoformed Spatial Fluidity',
      subtitle: 'Curvature Beyond the Cartesian Grid',
      body: 'Architecture is not confined to rigid 90-degree planes. Through precise thermoforming at 160°C over custom CNC formwork, we shape mineral acrylic into seamless curved plinths, organic fluted islands, and ergonomic coved wall transitions that embrace natural human movement.',
    },
    {
      num: '06',
      title: 'Circular Longevity & In-Situ Renewal',
      subtitle: 'Restored to Day-One Stillness',
      body: 'A luxury surface should outlast transient design trends. Because our material is homogeneous throughout, it never delaminates. Decades of heavy commercial or residential wear, minor scratches, or accidental blemishes can be effortlessly renewed on-site to factory-fresh perfection.',
    },
  ];

  const atelierTeams = [
    {
      role: 'Parametric CAD/CAM Engineers',
      focus: 'Digital Unfolding & 3D Toolpaths',
      description: 'Translate complex architectural models (Rhino, Revit, AutoCAD) into sub-millimeter nested CNC cutting paths, undercut sink rebates, and internal steel reinforcement frameworks.',
    },
    {
      role: 'Master Thermoformers',
      focus: 'Thermal Platen Ovens & Vacuum Pressing',
      description: 'Form heated 160 deg C mineral acrylic sheets over custom CNC timber bucks to achieve organic compound curves, gentle flutes, and tight 25mm radii without blanching or structural stress.',
    },
    {
      role: 'Precision Joinery Technicians',
      focus: 'Molecular Fusion & Inconspicuous Seams',
      description: 'Apply reactive two-part color-matched methacrylate adhesives with specialized clamping jigs to physically fuse sheets, creating homogeneous joints with zero visible glue lines.',
    },
    {
      role: 'Artisan Finishers & Installers',
      focus: 'Progressive Honing & On-Site Assembly',
      description: 'Execute a 5-stage progressive diamond honing protocol (120 to 600-grit) for light-absorbing matte finishes, and handle white-glove site delivery, seam blending, and commissioning.',
    },
  ];

  return (
    <main className="page-main">
      <AboutScrollHandler />
      <JsonLd data={aboutJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>
            About Us / Notes on Practice, Craft &amp; Lineage
          </p>

          <h1 style={{ fontSize: 'clamp(48px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Form &amp;
            <br />
            <i>continuity.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            Ace Spaces is a Bengaluru-based architectural fabrication atelier and master solid surface practice. We unite computational 5-axis digital precision with master artisan joinery, crafting monolithic, zero-silica architectural planes.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#story">
              Our Architectural Story <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Visit Bengaluru Atelier <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Origin
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Bengaluru</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Atelier
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>15,000 sq.ft</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Material Standard
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>0% Silica</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg"
            alt="Monolithic architectural counter crafted by Ace Spaces"
            fill
            sizes="(max-width: 860px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Studio Discipline
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Architectural Monoliths &amp; Joinery
              </strong>
            </div>
            <Link href="#philosophy" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Philosophy <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Quick Anchor Bar */}
      <nav
        style={{
          display: 'flex',
          gap: 'clamp(12px, 3vw, 36px)',
          padding: '16px 5vw',
          borderBottom: '1px solid var(--line)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--muted)',
        }}
        aria-label="About page sections"
      >
        <a href="#story" style={{ color: 'inherit', textDecoration: 'none' }}>01 / Our Story</a>
        <a href="#philosophy" style={{ color: 'inherit', textDecoration: 'none' }}>02 / Design Philosophy</a>
        <a href="#team" style={{ color: 'inherit', textDecoration: 'none' }}>03 / The Atelier &amp; Makers</a>
        <a href="#dupont" style={{ color: 'inherit', textDecoration: 'none' }}>04 / DuPont™ Alliance</a>
        <a href="#locations" style={{ color: 'inherit', textDecoration: 'none' }}>05 / Locations &amp; Gallery</a>
      </nav>

      {/* Section 01: The Architectural Story */}
      <section id="story" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 01 · Origin &amp; Vision</p>
          </div>

          <div className="about-two-col">
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
                Why we exist:
                <br />
                Dissolving the friction
                <br />
                <i>of the joint.</i>
              </h2>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.6, margin: '0 0 4px' }}>
                Founded in Bengaluru to bridge the divide between pure architectural intent and physical craft.
              </p>

              {/* Company Family & Leadership Photo Space */}
              {(() => {
                const familyPhotoDir = path.join(process.cwd(), 'public', 'images', 'about');
                const supportedFamilyExts = ['jpg', 'jpeg', 'png', 'webp'];
                let familyPhotoSrc: string | null = null;
                for (const ext of supportedFamilyExts) {
                  if (fs.existsSync(path.join(familyPhotoDir, `company-family.${ext}`))) {
                    familyPhotoSrc = `/images/about/company-family.${ext}`;
                    break;
                  }
                }

                return (
                  <div
                    style={{
                      marginTop: '28px',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid var(--line)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {/* Photo Frame */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4 / 3',
                        background: '#f4f0e8',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {familyPhotoSrc ? (
                        <Image
                          src={familyPhotoSrc}
                          alt="Ace Spaces Founding Family and Atelier Leadership"
                          fill
                          sizes="(max-width: 768px) 100vw, 480px"
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        /* Architectural Placeholder Frame if image file not placed yet */
                        <div
                          style={{
                            padding: '24px 20px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            border: '2px dashed rgba(26, 29, 25, 0.18)',
                            margin: '8px',
                            background: 'rgba(255, 255, 255, 0.4)',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: 'rgba(30, 33, 29, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '10px',
                              color: 'var(--ink)',
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </div>

                          <span
                            style={{
                              fontFamily: 'DM Mono, monospace',
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: 'var(--muted)',
                              marginBottom: '4px',
                            }}
                          >
                            Family Portrait Space
                          </span>

                          <strong style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600, marginBottom: '6px' }}>
                            Ready for Your Family Photo
                          </strong>

                          <p style={{ fontSize: '11px', lineHeight: 1.45, color: '#6e766c', margin: '0 0 8px', maxWidth: '280px' }}>
                            Drop your photo at:
                          </p>
                          <code style={{ background: 'rgba(0,0,0,0.06)', padding: '4px 8px', borderRadius: '2px', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)', wordBreak: 'break-all', display: 'inline-block', maxWidth: '100%' }}>
                            public/images/about/company-family.jpg
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Caption & Context Block */}
                    <div style={{ padding: '16px 18px', borderTop: '1px solid var(--line)', background: 'rgba(255, 255, 255, 0.95)' }}>
                      <span
                        style={{
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: 'var(--muted)',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        01.A · Origin &amp; Stewardship
                      </span>

                      <strong
                        style={{
                          display: 'block',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: '2px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        The Family Behind Ace Spaces
                      </strong>

                      <div
                        style={{
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '11px',
                          color: '#7a8479',
                          marginBottom: '6px',
                        }}
                      >
                        Founders &amp; Atelier Leadership · Bengaluru
                      </div>

                      <p
                        style={{
                          fontSize: '12px',
                          lineHeight: 1.5,
                          color: '#555e54',
                          margin: 0,
                        }}
                      >
                        United by a generational commitment to architectural stillness, physical craft, and personal stewardship.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '16px', lineHeight: 1.7, color: '#4a5249' }}>
              <p>
                For generations, architects and interior designers were constrained by the physical limits of traditional stone and ceramic tiles. Natural marble fractures along concealed fissures; quartz harbors lethal crystalline silica dust; and ceramic slabs inevitably require grout lines that attract grime, harbor bacteria, and shatter visual tranquility.
              </p>
              <p>
                <strong>Ace Spaces was born to eliminate these compromises.</strong> Operating from our central fabrication atelier and material stockyard in Bengaluru, we provide architects with an uncompromising, monolithic canvas: ultra-refined mineral acrylic solid surfaces that can be shaped with sub-millimeter robotic precision and fused with molecularly invisible seams.
              </p>
              <p>
                An entire 6-meter kitchen island with an integrated seamless sink basin, a curving reception desk with concealed ambient backlighting, or a continuous clinical wet-wall can now read as a single, uninterrupted sculpture carved from pure geological stillness.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid var(--line)' }}>
                  <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)', marginBottom: '4px' }}>
                    0.0 mm
                  </strong>
                  <span style={{ fontSize: '12px', color: '#6e766c', lineHeight: 1.4, display: 'block' }}>
                    Visible seam width once thermo-welded and honed by our joiners.
                  </span>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid var(--line)' }}>
                  <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)', marginBottom: '4px' }}>
                    25 mm
                  </strong>
                  <span style={{ fontSize: '12px', color: '#6e766c', lineHeight: 1.4, display: 'block' }}>
                    Minimum thermoformed internal radius achievable without surface blanching.
                  </span>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid var(--line)' }}>
                  <strong style={{ display: 'block', fontSize: '20px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)', marginBottom: '4px' }}>
                    100%
                  </strong>
                  <span style={{ fontSize: '12px', color: '#6e766c', lineHeight: 1.4, display: 'block' }}>
                    Zero-silica mineral composition, safe for fabricators and occupants.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Our Design Philosophy */}
      <section id="philosophy" className="section-pad" style={{ borderBottom: '1px solid var(--line)', background: '#ece8df' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 02 · Architectural Philosophy</p>
          </div>

          <div className="about-two-col-wide" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: 0, letterSpacing: '-0.04em' }}>
                Principles of
                <br />
                <i>spatial stillness.</i>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', margin: 0 }}>
                Every counter, sink, plinth, and wall plane crafted in our workshop is governed by six core architectural convictions. We do not chase decorative trends; we pursue timeless geometry, tactile warmth, and permanent structural honesty.
              </p>
            </div>
          </div>

          <div className="philosophy-accordion-grid">
            {philosophyPillars.map((pillar) => (
              <details key={pillar.num} className="philosophy-detail-card" open>
                <summary className="philosophy-summary">
                  <div>
                    <span className="philosophy-num">{pillar.num} / Philosophy</span>
                    <h3 className="philosophy-title">{pillar.title}</h3>
                  </div>
                  <span className="philosophy-indicator" aria-hidden="true" />
                </summary>
                <div className="philosophy-content">
                  <div className="philosophy-subtitle">{pillar.subtitle}</div>
                  <p className="philosophy-body">{pillar.body}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Client enhancement: On mobile, collapse cards 02-06 into compact accordion */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function syncPhilosophyCards() {
                    try {
                      if (window.innerWidth <= 768) {
                        var cards = document.querySelectorAll('.philosophy-detail-card');
                        for (var i = 1; i < cards.length; i++) {
                          cards[i].removeAttribute('open');
                        }
                      } else {
                        var cards = document.querySelectorAll('.philosophy-detail-card');
                        for (var j = 0; j < cards.length; j++) {
                          cards[j].setAttribute('open', '');
                        }
                      }
                    } catch(e) {}
                  }
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', syncPhilosophyCards);
                  } else {
                    syncPhilosophyCards();
                  }
                  window.addEventListener('resize', syncPhilosophyCards);
                })();
              `,
            }}
          />
        </div>
      </section>

      {/* Section 03: The Atelier & Craftsmen */}
      <section id="team" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 03 · The Atelier &amp; Makers</p>
          </div>

          <div className="about-two-col-team" style={{ marginBottom: '44px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.04em' }}>
                The hands behind
                <br />
                <i>the surfaces.</i>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555e54', margin: '0 0 24px' }}>
                Our integrated facility in Bengaluru operates as an architectural laboratory. Here, industrial machinery is guided by the discerning eyes of computational designers, thermoforming masters, and artisanal finishers.
              </p>
              <div style={{ padding: '20px', background: 'rgba(30, 33, 29, 0.04)', borderLeft: '3px solid var(--ink)' }}>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)', marginBottom: '4px' }}>
                  White-Glove Architectural Execution
                </strong>
                <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                  We maintain full chain-of-custody from raw slab arrival and CNC cut-sheets to on-site assembly across India.
                </p>
              </div>
            </div>

            <div className="about-units-grid">
              {atelierTeams.map((team, idx) => (
                <div
                  key={team.role}
                  style={{
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    Unit 0{idx + 1}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>
                    {team.role}
                  </h4>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#7a8479', marginBottom: '10px' }}>
                    {team.focus}
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#6e766c', margin: 0 }}>
                    {team.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop Visual Feature */}
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '2px',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <div
              style={{
                position: 'relative',
                height: 'clamp(280px, 42vw, 480px)',
                width: '100%',
                overflow: 'hidden',
                background: '#ece8df',
              }}
            >
              <Image
                src="/images/images/app_residential_calacatta_greige_1.jpg"
                alt="Ace Spaces fabrication workshop and finished monolithic installation"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '3px',
                  }}
                >
                  Fabrication Atelier · Bengaluru
                </span>
                <strong
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    display: 'block',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Continuous 4.2-Meter Island with Integrated Sub-Surface Sink
                </strong>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: '#555e54',
                  margin: 0,
                  maxWidth: '460px',
                }}
              >
                Fabricated with 45° mitred waterfalls and zero visible joints at our Bengaluru studio atelier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Material Foundation & DuPont™ Alliance */}
      <section
        id="dupont"
        className="section-pad"
        style={{
          position: 'relative',
          borderBottom: '1px solid var(--line)',
          background: '#ece8df',
          scrollMarginTop: '20px',
        }}
      >
        {/* Anchor aliases for #foundation, #partnership, and #alliance */}
        <div
          id="foundation"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1px',
            height: '1px',
            pointerEvents: 'none',
            opacity: 0,
            scrollMarginTop: '96px',
          }}
        />
        <div
          id="partnership"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1px',
            height: '1px',
            pointerEvents: 'none',
            opacity: 0,
            scrollMarginTop: '96px',
          }}
        />
        <div
          id="alliance"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1px',
            height: '1px',
            pointerEvents: 'none',
            opacity: 0,
            scrollMarginTop: '96px',
          }}
        />
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 04 · Material Foundation &amp; Sourcing Alliance</p>
          </div>

          <div className="about-two-col" style={{ marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
                Our studio is the vision.
                <br />
                <i>DuPont™ is our medium.</i>
              </h2>
              <div style={{ padding: '18px 22px', background: 'rgba(255, 255, 255, 0.75)', border: '1px solid var(--line)', borderRadius: '2px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                  Strategic Alliance Status
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  Official DuPont™ Corian® Quality Network Industrial Partner
                </div>
                <div style={{ fontSize: '12px', color: '#6e766c', marginTop: '6px', lineHeight: 1.5 }}>
                  Certified industrial master fabricator and stockist backed by DuPont's official 10-year installed manufacturer warranty.
                </div>
              </div>

              {/* Official Alliance Brand Logos Lockup */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '24px 20px',
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
                    Official Partner Endorsement
                  </span>
                </div>

                {/* Official Quality Network Industrial Partner Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 0',
                    width: '100%',
                    maxWidth: '300px',
                    margin: '0 auto',
                  }}
                >
                  <Image
                    src="/assets/dupont-corian-quality-network-partner.png"
                    alt="DuPont™ Corian® Quality Network Industrial Partner Official Badge"
                    width={320}
                    height={110}
                    style={{ height: 'auto', width: '100%', maxWidth: '270px', objectFit: 'contain' }}
                    priority
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <Image
                    src="/assets/Corian-Red-logo.png.webp"
                    alt="Corian® Solid Surface"
                    width={160}
                    height={64}
                    style={{ height: '40px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    color: '#6e766c',
                    borderTop: '1px solid var(--line)',
                    paddingTop: '12px',
                    width: '100%',
                    letterSpacing: '0.04em',
                    lineHeight: 1.5,
                  }}
                >
                  Authorized Master Fabricator · 10-Year Installed Warranty
                </div>
              </div>
            </div>

            <div>
              <p className="lead" style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '18px' }}>
                To achieve true architectural permanence, craftsmanship must be grounded in verified material science. Ace Spaces is an official <strong>Quality Network Industrial Partner of DuPont™ Corian®</strong>, supplying and fabricating genuine solid surfaces across India.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555e54', marginBottom: '18px' }}>
                Invented by DuPont scientists, Corian® blends approximately two-thirds natural Aluminium Trihydrate (ATH, purified bauxite mineral) with high-grade acrylic polymer (PMMA). This precise formula guarantees through-body consistency, complete non-porosity, and total freedom from crystalline silica hazards.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555e54', marginBottom: '28px' }}>
                As an accredited Quality Network partner, our fabrication foundry adheres strictly to DuPont's technical specifications. Every raw slab dispatched from our stockyard carries genuine chemical traceability, NSF/ANSI 51 food-contact safety certification, Greenguard Gold compliance, and DuPont's 10-year installed warranty.
              </p>

              {/* The 3-Entity Ecosystem Clarification */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '20px 18px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      Material Origin &amp; Accreditation
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0 14px', flexWrap: 'wrap' }}>
                      <Image
                        src="/assets/dupont-corian-quality-network-partner.png"
                        alt="DuPont™ Corian® Quality Network Industrial Partner"
                        width={180}
                        height={60}
                        style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
                      />
                      <div style={{ width: '1px', height: '24px', background: 'var(--line)' }} />
                      <Image
                        src="/assets/Corian-Red-logo.png.webp"
                        alt="Corian® Solid Surface"
                        width={120}
                        height={48}
                        style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>Quality Network Partner</h4>
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                      Official DuPont™ Corian® Industrial Partner. Certified ATH + PMMA chemistry, 10-year warranty, zero-silica safety.
                    </p>
                  </div>
                </div>
                <div style={{ padding: '20px 18px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      Practice &amp; Atelier
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', height: '34px', margin: '12px 0 14px' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ink)' }}>
                        ACE SPACES
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>Ace Spaces</h4>
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                      The architectural atelier, 5-axis CNC router, thermoforming workshop, stockyard, and nationwide installer.
                    </p>
                  </div>
                </div>
                <div style={{ padding: '20px 18px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      Spatial Living Brand
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '34px', margin: '12px 0 14px' }}>
                      <Image
                        src="/images/coro-emblem.png"
                        alt="Coro Crafted Collective Emblem"
                        width={30}
                        height={36}
                        style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                      />
                      <Image
                        src="/images/coro-wordmark.png"
                        alt="Coro Crafted Collective Wordmark"
                        width={90}
                        height={26}
                        style={{ height: '18px', width: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>Coro Crafted Collective</h4>
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                      Our sister spatial studio and collectible furniture label, creating bespoke interior architecture powered by Ace Spaces.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Studio Headquarters */}
      <section id="locations" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 05 · Studio Headquarters</p>
          </div>

          <div className="about-two-col-wide" style={{ marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
                Visit our studio
                <br />
                <i>in Bengaluru.</i>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', margin: '0 0 20px' }}>
                Ace Spaces and Coro Crafted Collective share one single, unified studio and headquarters in Bengaluru. We welcome architects, interior designers, and clients for tactile consultations, custom mockups, and private material reviews under one roof.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '9px 18px', textDecoration: 'none' }}
                >
                  Open on Google Maps ↗
                </a>
                <Link
                  href="/contact"
                  className="button"
                  style={{ fontSize: '11px', padding: '9px 18px', background: 'transparent', border: '1px solid var(--ink)', textDecoration: 'none' }}
                >
                  Book Studio Visit ↗
                </Link>
              </div>
            </div>

            {/* Single Unified Headquarters Card */}
            <div style={{ padding: '32px', background: 'rgba(255, 255, 255, 0.75)', border: '1px solid var(--line)', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                    Single Unified Studio Headquarters
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
                    Coro Crafted Collective &amp; Ace Spaces Studio Headquarters
                  </h3>
                </div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '4px 10px', background: 'var(--ink)', color: '#fff', borderRadius: '2px', textTransform: 'uppercase' }}>
                  Bengaluru · Headquarters
                </span>
              </div>

              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#444d43', margin: '0 0 24px' }}>
                Bengaluru, Karnataka, India · Our unified facility brings together the tactile design gallery, full-scale 20+ calibrated slab library, 5-axis CNC digital fabrication suite, and vacuum thermoforming ovens in one singular address.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
                <div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                    Design Gallery &amp; Specifier Library
                  </span>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6e766c', lineHeight: 1.7 }}>
                    • 20+ Calibrated Full-Scale Slabs on Display
                    <br />
                    • Backlit Translucent Light Simulator Suite
                    <br />
                    • Complimentary Physical Specifier Sample Trays
                    <br />
                    • Dedicated Architect &amp; Designer Consultation Desks
                  </div>
                </div>

                <div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                    Fabrication Atelier &amp; CNC Suite
                  </span>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6e766c', lineHeight: 1.7 }}>
                    • 5-Axis CNC Precision Milling &amp; Sub-Surface Joinery
                    <br />
                    • Industrial Vacuum Membrane Thermoforming Ovens
                    <br />
                    • Monolithic Pre-Assembly &amp; Custom Mockup Testing
                    <br />
                    • Direct Pan-India Dispatch &amp; Installation Logistics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Studio Specification Directory */}
      <section className="spec-table">
        <div className="spec-row">
          <span>Practice Name</span>
          <div>Ace Spaces - Architectural Solid Surface Atelier &amp; Precision Fabrication Practice</div>
        </div>
        <div className="spec-row">
          <span>Founding Ethos</span>
          <div>Eliminating seams and visual friction in contemporary architecture through monolithic mineral surfaces</div>
        </div>
        <div className="spec-row">
          <span>Material Alliance</span>
          <div>Authorized DuPont™ Corian® Distributor &amp; Certified Master Fabricator</div>
        </div>
        <div className="spec-row">
          <span>Studio Headquarters</span>
          <div>Coro Crafted Collective &amp; Ace Spaces Studio Headquarters, Bengaluru, Karnataka, India (Single Unified Facility: Design Gallery, Full-Scale Slab Library &amp; CNC Fabrication Atelier)</div>
        </div>
        <div className="spec-row">
          <span>Google Maps</span>
          <div>
            <a href="https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Direct Navigation: maps.app.goo.gl/eNFxtR7WPqRS8gpd7 ↗
            </a>
          </div>
        </div>
        <div className="spec-row">
          <span>Services for Architects</span>
          <div>CAD/Rhino shop drawing translation, custom thermoform buck tooling, laser templating, on-site monolithic assembly</div>
        </div>
        <div className="spec-row">
          <span>Health &amp; Safety Standard</span>
          <div>100% Zero Crystalline Silica, NSF/ANSI 51 Food-Safe, Greenguard Gold Ultra-Low VOC, Class A ASTM E84 Fire Rating</div>
        </div>
        <div className="spec-row">
          <span>Ecosystem Synergy</span>
          <div>Ace Spaces (Material &amp; Fabrication Atelier) → Coro Crafted Collective (Turnkey Spatial &amp; Collectible Furniture Studio)</div>
        </div>
      </section>

      {/* Coro Crafted Collective Synergy Callout */}
      <section className="callout about-coro-callout" id="coro">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.45)', border: '1px solid var(--line)', padding: '28px 20px', borderRadius: '4px' }}>
          <img src="/images/coro-emblem.png" alt="Coro Crafted Collective Architectural Emblem" style={{ width: '80px', height: '100px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
          <img src="/images/coro-wordmark.png" alt="Coro Crafted Collective Wordmark" style={{ width: '130px', height: '36px', objectFit: 'contain', display: 'block' }} />
        </div>
        <div>
          <p className="eyebrow">Studio Synergy · Sister Spatial Brand</p>
          <h2>
            Powering
            <br />
            <i>Coro Crafted Collective.</i>
          </h2>
          <p>
            Coro Crafted Collective was born out of Ace Spaces to showcase what is possible when our monolithic surfaces are shaped into turnkey living spaces, sculptural reception monoliths, and bespoke collectible furniture.
          </p>
          <p style={{ marginTop: '14px', color: '#6e766c', fontSize: '15px' }}>
            Independent architects and designers enjoy direct access to the very same precision fabrication atelier and raw mineral materials that make Coro's spaces celebrated.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '28px', flexWrap: 'wrap' }}>
            <Link className="button button-dark" href="/materials">
              Browse Material Palette <span>↗</span>
            </Link>
            <Link className="button" href="/contact" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              Start Architectural Consultation <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
