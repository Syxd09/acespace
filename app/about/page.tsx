import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Ace Spaces | Authorized DuPont™ Corian® Partner & Raw Material Source',
  description: 'Learn about Ace Spaces as the parent company, authorized DuPont™ Corian® solid surface partner, and primary architectural raw material provider for architects, designers, and Coro Collective.',
};

export default function AboutPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">About Ace Spaces / Parent Company &amp; Authorized DuPont™ Partner</p>
        <h1>
          The foundation of
          <br />
          <i>raw material.</i>
        </h1>
        <p>
          Ace Spaces is the parent company, authorized DuPont™ Corian® solid surface partner, and primary raw material source supplying architects, interior designers, and our spatial brand Coro Collective with certified solid surfaces, mineral substrates, and precision workshop fabrication.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          Where materials
          <br />
          originate for
          <br />
          <i>creators.</i>
        </h2>
        <div className="page-copy">
          <p>
            Operating from our central facility and stockyard in Bangalore, Ace Spaces is the dedicated sourcing and fabrication hub for architects and luxury interior designers across India. We supply full-dimension raw slabs, precision-cut fabrication blanks, and bespoke thermoformed assemblies engineered for demanding residential, hospitality, healthcare, and commercial installations.
          </p>
          <p>
            Through our strategic partnership with global surface pioneer <strong>DuPont™</strong>, we maintain extensive inventory of authentic <strong>DuPont™ Corian®</strong> solid surfaces alongside our proprietary mineral collections. Every sheet is backed by certified chemical composition, zero-silica safety standards, and genuine 10-year manufacturer warranties.
          </p>
          <p>
            Ace Spaces also stands as the foundational parent entity powering Coro Collective — our sister spatial and interior architecture studio. While Coro conceives complete, finished architectural environments and bespoke collectible furniture, every monolithic plane and sculpted volume is born from the raw materials engineered here at Ace Spaces.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link className="button" href="/materials">
              Browse Raw Materials <span>↗</span>
            </Link>
            <a className="button" href="#dupont" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              DuPont™ Partnership <span>↓</span>
            </a>
            <a className="button" href="#coro" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              The Coro Connection <span>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Strategic DuPont Partnership Section */}
      <section id="dupont" className="section-pad" style={{ borderTop: '1px solid var(--line)', background: '#ece8df' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ink)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Strategic Alliance · DuPont™ Corian®</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr', gap: '48px', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '38px', lineHeight: 1.15, fontWeight: 400, margin: '0 0 20px' }}>
                Global material standard.
                <br />
                <i>Precision workshop craft.</i>
              </h2>
              <div style={{ padding: '18px 22px', background: 'rgba(255,255,255,0.6)', border: '1px solid var(--line)', borderRadius: '2px', marginTop: '24px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                  Official Partnership Status
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  Authorized DuPont™ Corian® Distributor &amp; Fabricator
                </div>
                <div style={{ fontSize: '12px', color: '#6e766c', marginTop: '6px', lineHeight: 1.5 }}>
                  Central distribution stockyard &amp; CNC fabrication facility located in Bangalore, serving architects, contractors, and luxury design firms across India.
                </div>
              </div>
            </div>

            <div>
              <p className="lead" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--ink)', marginBottom: '18px' }}>
                Ace Spaces partners directly with DuPont™ to deliver authentic DuPont™ Corian® solid surfaces — the original, non-porous mineral substrate celebrated worldwide by architects and design institutions.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', marginBottom: '18px' }}>
                Combining natural bauxite mineral fillers (Aluminium Trihydrate / ATH) with high-purity acrylic resin, DuPont™ Corian® delivers complete through-body uniformity with zero crystalline silica risks. Our facility provides certified sheet inventory, factory-matched color joint adhesives, and advanced vacuum thermoforming capabilities allowing fluid, organic curves down to tight 25mm radii.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', marginBottom: '28px' }}>
                Every slab specified through Ace Spaces carries DuPont’s official 10-year limited installed product warranty, full NSF/ANSI 51 food-contact hygiene certification, and Greenguard Gold indoor air quality compliance.
              </p>

              {/* 4 Pillars of DuPont & Ace Spaces */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>01 / Supply</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>Continuous Slab Stock</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>Full 3660 × 760mm slabs in 12mm and 19mm thickness ready for rapid project dispatch.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>02 / Fabrication</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>Certified Thermoforming</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>Precision oven forming and CNC shaping with inconspicuous, monolithic seams.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>03 / Health &amp; Safety</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>Zero-Silica Composition</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>100% non-hazardous mineral matrix, safe for craftsmen, workspaces, and occupants.</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>04 / Assurance</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 4px' }}>10-Year Warranty</h4>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#6e766c', margin: 0 }}>Manufacturer-backed product warranty on all certified installations and fabrications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="spec-table">
        <div className="spec-row">
          <span>Company Identity</span>
          <div>Ace Spaces — Parent Company, Direct Architectural Raw Material Provider &amp; Stockist</div>
        </div>
        <div className="spec-row">
          <span>Strategic Alliance</span>
          <div>Authorized DuPont™ Corian® Solid Surface Distributor &amp; Certified Fabricator</div>
        </div>
        <div className="spec-row">
          <span>Central Facility</span>
          <div>Bangalore Workshop &amp; Distribution Yard, Karnataka, India · Pan-India Dispatch</div>
        </div>
        <div className="spec-row">
          <span>Who We Supply</span>
          <div>Architects / Interior Designers / Luxury Millworkers / Institutional Specifiers / Coro Collective</div>
        </div>
        <div className="spec-row">
          <span>Raw Material Offerings</span>
          <div>DuPont™ Corian® Slabs (12mm / 19mm) / Proprietary Mineral Substrates / Custom Sheets / CNC Blanks</div>
        </div>
        <div className="spec-row">
          <span>Fabrication Capabilities</span>
          <div>Monolithic Inconspicuous Jointing / Vacuum Membrane Thermoforming (≥25mm R) / 5-Axis CNC Milling</div>
        </div>
        <div className="spec-row">
          <span>Certifications &amp; Safety</span>
          <div>Zero Crystalline Silica / NSF/ANSI 51 Food Safe / Greenguard Gold / ASTM E84 Class A Fire Rating / 10-Yr DuPont Warranty</div>
        </div>
        <div className="spec-row">
          <span>Connected Ecosystem</span>
          <div>Ace Spaces (Parent &amp; Material Provider) &rarr; Coro Collective (Spatial &amp; Interior Design Studio)</div>
        </div>
      </section>

      <section className="callout" id="coro" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 2fr', gap: '36px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.45)', border: '1px solid var(--line)', padding: '28px 20px', borderRadius: '4px' }}>
          <img src="/images/coro-emblem.png" alt="Coro Collective Architectural Emblem" style={{ width: '80px', height: '100px', objectFit: 'contain', marginBottom: '12px', display: 'block' }} />
          <img src="/images/coro-wordmark.png" alt="Coro Collective Wordmark" style={{ width: '130px', height: '36px', objectFit: 'contain', display: 'block' }} />
        </div>
        <div>
          <p className="eyebrow">Parent &amp; Ecosystem Synergy</p>
          <h2>
            Powering
            <br />
            <i>Coro Collective.</i>
          </h2>
          <p>
            Coro Collective was born from Ace Spaces to showcase what is possible when our raw materials are shaped into complete spatial concepts, bespoke furniture, and interior architecture.
          </p>
          <p style={{ marginTop: '14px', color: '#6e766c', fontSize: '15px' }}>
            Independent architects and designers enjoy direct access to the very same raw materials that make Coro’s spaces celebrated.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '28px', flexWrap: 'wrap' }}>
            <Link className="button" href="/materials">
              Source Materials <span>↗</span>
            </Link>
            <Link className="button" href="/contact" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              Start a Consultation <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
