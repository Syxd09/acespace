import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Ace Spaces | Architectural Practice & Fabrication Atelier',
  description: 'Ace Spaces is a Bengaluru-based architectural fabrication atelier and design practice dedicated to monolithic, seamless solid surfaces, zero-silica mineral craft, and collaborative architectural engineering.',
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
      subtitle: 'Your Studio’s Technical Extension',
      body: 'We are not a distant building supply outlet. We act as an active fabrication partner for architects and interior designers across India. From initial CAD shop drawings and structural sub-framing calculations to laser templating and on-site assembly, we bring ambitious concepts to reality.',
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
      description: 'Form heated 160°C mineral acrylic sheets over custom CNC timber bucks to achieve organic compound curves, gentle flutes, and tight 25mm radii without blanching or structural stress.',
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
      {/* Editorial Split Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '20px' }}>
            07 / About Us · The Practice, Atelier &amp; Architectural Ethos
          </p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 104px)', lineHeight: 0.96, margin: '0 0 24px', letterSpacing: '-0.06em' }}>
            Form, continuity &amp;
            <br />
            <i>the seamless plane.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '540px', marginBottom: '32px' }}>
            Ace Spaces is a Bengaluru-based architectural fabrication atelier and design practice. We unite computational 5-axis digital precision with master artisan joinery, crafting monolithic, zero-silica solid surfaces that eliminate the visual friction of seams in modern space.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="#story">
              Our Architectural Story <span>↓</span>
            </Link>
            <Link className="button" href="/contact" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              Visit Bangalore Atelier <span>↗</span>
            </Link>
            <Link className="text-link" href="#foundation" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
              DuPont™ Material Foundation <span>↓</span>
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
                Discipline
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Solid Surfaces</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Fabrication Atelier
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>15,000 sq.ft</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Health Standard
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>0% Crystalline Silica</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/applications/stonecrest-smoke-hotel-lobby.jpg"
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
              <strong style={{ fontSize: '12px', color: 'var(--ink)', display: 'block' }}>
                Architectural Monoliths
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Quick Anchor Bar */}
      <nav
        style={{
          display: 'flex',
          gap: 'clamp(12px, 3vw, 36px)',
          padding: '16px 0',
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
        <a href="#foundation" style={{ color: 'inherit', textDecoration: 'none' }}>04 / DuPont™ Alliance</a>
        <a href="#locations" style={{ color: 'inherit', textDecoration: 'none' }}>05 / Locations &amp; Gallery</a>
      </nav>

      {/* Section 01: The Architectural Story */}
      <section id="story" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 01 · Origin &amp; Vision</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1.6fr', gap: '48px', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
                Why we exist:
                <br />
                Dissolving the friction
                <br />
                <i>of the joint.</i>
              </h2>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.6 }}>
                Founded in Bengaluru to bridge the divide between pure architectural intent and physical craft.
              </p>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '48px', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: 0, letterSpacing: '-0.04em' }}>
                Principles of
                <br />
                <i>spatial stillness.</i>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', margin: 0 }}>
                Every counter, sink, plinth, and wall plane crafted in our workshop is governed by four core architectural convictions. We do not chase decorative trends; we pursue timeless geometry, tactile warmth, and permanent structural honesty.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {philosophyPillars.map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  padding: '28px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                    {pillar.num} / Philosophy
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    {pillar.title}
                  </h3>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#7a8479', marginBottom: '14px' }}>
                    {pillar.subtitle}
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#555e54', margin: 0 }}>
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 03: The Atelier & Craftsmen */}
      <section id="team" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 03 · The Atelier &amp; Makers</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) 1.8fr', gap: '48px', alignItems: 'flex-start', marginBottom: '44px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.04em' }}>
                The hands behind
                <br />
                <i>the surfaces.</i>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#555e54', margin: '0 0 24px' }}>
                Our 15,000 sq.ft facility in Bengaluru’s Whitefield-Hoskote corridor operates as an architectural laboratory. Here, industrial machinery is guided by the discerning eyes of computational designers, thermoforming masters, and artisanal finishers.
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
              position: 'relative',
              height: '380px',
              width: '100%',
              overflow: 'hidden',
              border: '1px solid var(--line)',
            }}
          >
            <Image
              src="/assets/applications/calacatta-greige-kitchen.jpg"
              alt="Ace Spaces fabrication workshop and finished monolithic installation"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                background: 'rgba(20, 23, 19, 0.88)',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                padding: '16px 24px',
                maxWidth: '480px',
              }}
            >
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9da79d', display: 'block', marginBottom: '4px' }}>
                Fabrication Atelier · Bengaluru
              </span>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                Continuous 4.2-Meter Island with Integrated Sub-Surface Sink
              </strong>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#d2dad2', margin: 0 }}>
                Fabricated with 45° mitred waterfalls and zero visible joints at our Hoskote facility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Material Foundation & DuPont™ Alliance */}
      <section id="foundation" className="section-pad" style={{ borderBottom: '1px solid var(--line)', background: '#ece8df' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 04 · Material Foundation &amp; Sourcing Alliance</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1.6fr', gap: '48px', alignItems: 'flex-start', marginBottom: '36px' }}>
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
                  Authorized DuPont™ Corian® Solid Surface Partner &amp; Fabricator
                </div>
                <div style={{ fontSize: '12px', color: '#6e766c', marginTop: '6px', lineHeight: 1.5 }}>
                  Authentic ATH mineral substrates backed by DuPont’s official 10-year installed manufacturer warranty.
                </div>
              </div>
            </div>

            <div>
              <p className="lead" style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '18px' }}>
                To achieve true architectural permanence, craftsmanship must be grounded in verified material science. Ace Spaces partners directly with DuPont™ to supply and fabricate genuine <strong>DuPont™ Corian®</strong> solid surfaces across India.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555e54', marginBottom: '18px' }}>
                Invented by DuPont scientists, Corian® blends approximately two-thirds natural Aluminium Trihydrate (ATH, purified bauxite mineral) with high-grade acrylic polymer (PMMA). This precise formula guarantees through-body consistency, complete non-porosity, and total freedom from crystalline silica hazards.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555e54', marginBottom: '28px' }}>
                While Ace Spaces serves as the design practice, CNC fabricator, and custom engineering house, DuPont™ provides the world’s most rigorously tested mineral substrate. Every raw slab dispatched from our stockyard carries genuine chemical traceability, NSF/ANSI 51 food-contact safety certification, and Greenguard Gold compliance.
              </p>

              {/* The 3-Entity Ecosystem Clarification */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Material Origin
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>DuPont™ Corian®</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                    Global mineral manufacturer. Certified ATH + PMMA chemistry, 10-year warranty, zero-silica safety.
                  </p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Practice &amp; Atelier
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>Ace Spaces</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                    The architectural atelier, 5-axis CNC router, thermoforming workshop, stockyard, and nationwide installer.
                  </p>
                </div>
                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Spatial Living Brand
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>Coro Collective</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>
                    Our sister spatial studio and collectible furniture label, creating bespoke interior architecture powered by Ace Spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Locations & Specifier Gallery */}
      <section id="locations" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Chapter 05 · Locations &amp; Specifier Presence</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '48px', alignItems: 'flex-start', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.08, fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
                Visit our spaces
                <br />
                <i>in Bengaluru.</i>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', margin: 0 }}>
                We welcome architects, interior designers, and clients for tactile consultations, custom mockups, and private material reviews.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Location 1: Gallery */}
              <div style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid var(--line)' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                  Design Gallery &amp; Sample Library
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
                  Indiranagar Studio Gallery
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#555e54', margin: '0 0 16px' }}>
                  #42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038, India
                </p>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6e766c', lineHeight: 1.6 }}>
                  • 20+ Calibrated Full-Scale Slabs on Display
                  <br />
                  • Backlit Translucent Light Simulator
                  <br />
                  • Complimentary Physical Specifier Trays
                </div>
                <Link
                  href="/contact"
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '8px 16px', marginTop: '20px', display: 'inline-block' }}
                >
                  Book Studio Visit ↗
                </Link>
              </div>

              {/* Location 2: Atelier */}
              <div style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid var(--line)' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                  Fabrication Atelier &amp; Stockyard
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
                  Hoskote Industrial Plant
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#555e54', margin: '0 0 16px' }}>
                  Whitefield-Hoskote Industrial Corridor, Bengaluru, Karnataka, India
                </p>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6e766c', lineHeight: 1.6 }}>
                  • 15,000 sq.ft 5-Axis CNC Milling Suite
                  <br />
                  • Industrial Vacuum Membrane Thermoforming Ovens
                  <br />
                  • Pan-India Dispatch &amp; Installation Logistics
                </div>
                <Link
                  href="/fabrication"
                  className="button"
                  style={{ fontSize: '11px', padding: '8px 16px', marginTop: '20px', display: 'inline-block', background: 'transparent', border: '1px solid var(--ink)' }}
                >
                  Explore Machinery ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Studio Specification Directory */}
      <section className="spec-table">
        <div className="spec-row">
          <span>Practice Name</span>
          <div>Ace Spaces — Architectural Solid Surface Atelier &amp; Precision Fabrication Practice</div>
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
          <span>Central Atelier</span>
          <div>15,000 sq.ft CNC &amp; Thermoforming Facility, Whitefield-Hoskote Corridor, Bengaluru, India</div>
        </div>
        <div className="spec-row">
          <span>Design Gallery</span>
          <div>#42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038</div>
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
          <div>Ace Spaces (Material &amp; Fabrication Atelier) &rarr; Coro Collective (Turnkey Spatial &amp; Collectible Furniture Studio)</div>
        </div>
      </section>

      {/* Coro Collective Synergy Callout */}
      <section className="callout" id="coro" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 2fr', gap: '36px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.45)', border: '1px solid var(--line)', padding: '28px 20px', borderRadius: '4px' }}>
          <img src="/images/coro-emblem.png" alt="Coro Collective Architectural Emblem" style={{ width: '80px', height: '100px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
          <img src="/images/coro-wordmark.png" alt="Coro Collective Wordmark" style={{ width: '130px', height: '36px', objectFit: 'contain', display: 'block' }} />
        </div>
        <div>
          <p className="eyebrow">Studio Synergy · Sister Spatial Brand</p>
          <h2>
            Powering
            <br />
            <i>Coro Collective.</i>
          </h2>
          <p>
            Coro Collective was born out of Ace Spaces to showcase what is possible when our monolithic surfaces are shaped into turnkey living spaces, sculptural reception monoliths, and bespoke collectible furniture.
          </p>
          <p style={{ marginTop: '14px', color: '#6e766c', fontSize: '15px' }}>
            Independent architects and designers enjoy direct access to the very same precision fabrication atelier and raw mineral materials that make Coro’s spaces celebrated.
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
