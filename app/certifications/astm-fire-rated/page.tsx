import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ASTM Class 1 Fire Rated Solid Surface Systems | Ace Spaces India',
  description:
    'Ace Spaces solid surface panels and claddings achieve ASTM E84 Class 1 (Class A) fire resistance rating. Flame spread index < 25, low smoke generation, and endothermic fire-retardant ATH mineral chemistry for commercial high-rises and public buildings.',
  keywords: [
    'ASTM Class 1 fire rated solid surface',
    'ASTM E84 Class A Corian India',
    'flame spread index solid surface',
    'fire resistant wall cladding Bangalore',
    'commercial interior fire safety compliance',
    'NFPA 255 compliant surfaces',
  ],
};

export default function AstmFireRatedPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/certifications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', textDecoration: 'none' }}>
            Technical Governance &amp; Standards
          </Link>
          <span style={{ color: 'var(--muted, #788078)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', fontWeight: 600 }}>
            ASTM E84 Class 1 (Class A)
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 33, 29, 0.05)', border: '1px solid rgba(30, 33, 29, 0.12)', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#73c991', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1d19', fontWeight: 600 }}>
              Fire Safety Code Certified · ASTM E84 / NFPA 255 Class A
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            ASTM Class 1 Fire Rated Certification
          </h1>
          <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '18px', lineHeight: 1.6, color: '#4a5249', maxWidth: '780px', margin: 0 }}>
            Achieving the highest possible building material fire performance classification—ASTM E84 Class 1 (Class A). Formulated with 66% mineral Aluminium Trihydrate to naturally extinguish flame propagation and prevent lethal smoke asphyxiation in commercial architecture.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {[
            { label: 'Flame Spread Index (FSI)', value: 'FSI < 25 (Typ. 15)', sub: 'Tested per Steiner Tunnel ASTM E84 Standard' },
            { label: 'Smoke Developed Index', value: 'SDI < 50', sub: 'Far superior to the maximum allowable limit of 450' },
            { label: 'Fire Rating Class', value: 'Class 1 / Class A', sub: 'Approved for public egress routes and atriums' },
            { label: 'Flaming Droplets', value: 'None (Non-dripping)', sub: 'Prevents secondary fire ignition below vertical claddings' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em' }}>
                {stat.label}
              </span>
              <div style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '30px', fontWeight: 500, color: '#1a1d19', margin: '14px 0 6px' }}>
                {stat.value}
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#596059', margin: 0, lineHeight: 1.5 }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Chemistry Explanation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', marginBottom: '64px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '28px', fontWeight: 400, margin: '0 0 16px' }}>
              The Endothermic Fire Defense Chemistry of Mineral ATH
            </h2>
            <div style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '15px', lineHeight: 1.8, color: '#2f352e', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                Unlike standard plastic laminates, foams, or wood millwork that ignite and fuel indoor flames, <strong>DuPont™ Corian® solid surfaces supplied by Ace Spaces</strong> rely on the unique physics of Aluminium Trihydrate [Al(OH)₃].
              </p>
              <p>
                When subjected to thermal temperatures exceeding 200°C (392°F), the mineral ATH undergoes an <strong>endothermic decomposition reaction</strong>:
              </p>
              <div style={{ background: 'rgba(30, 33, 29, 0.04)', padding: '14px 18px', borderLeft: '3px solid #1a1d19', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
                2 Al(OH)₃ + Heat ➔ Al₂O₃ + 3 H₂O (Steam)
              </div>
              <p>
                This reaction absorbs intense caloric heat energy from the surrounding fire, cooling the substrate below its ignition threshold while releasing pure microscopic water vapor. The released vapor starves oxygen from the fire zone and creates an impervious mineral char layer that stops vertical flame crawl.
              </p>
              <p>
                Because no halogenated fire retardants (chlorine, bromine, antimony) are used, the material emits zero toxic acid gases during high-temperature exposure.
              </p>
            </div>
          </div>

          {/* Code Compliance Table */}
          <div style={{ background: 'rgba(30, 33, 29, 0.03)', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
            <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', color: '#1a1d19' }}>
              [Building Code Equivalencies &amp; Approvals]
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
              {[
                { standard: 'ASTM E84 (Steiner Tunnel)', rating: 'Class 1 / Class A', note: 'FSI ≤ 25, SDI ≤ 50' },
                { standard: 'NFPA 255 (Life Safety Code)', rating: 'Class A Approved', note: 'Exit Corridors' },
                { standard: 'UL 723 (Standard for Safety)', rating: 'Class A Classified', note: 'UL Directory Listed' },
                { standard: 'EN 13501-1 (Euroclass)', rating: 'B-s1, d0', note: 'European Reaction to Fire' },
                { standard: 'NBC India (Part 4 Fire Safety)', rating: 'Type 1 Non-Combustible Core', note: 'Indian Building Code' },
              ].map((row, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(30,33,29,0.1)', paddingBottom: '10px' }}>
                  <div>
                    <strong style={{ color: '#1a1d19', display: 'block' }}>{row.standard}</strong>
                    <span style={{ color: '#788078', fontSize: '11px' }}>{row.note}</span>
                  </div>
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>{row.rating}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specification Clause */}
        <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '36px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078' }}>
              Commercial Fire Engineering Tender Clause
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '3px 8px' }}>
              CSI MasterFormat Specification
            </span>
          </div>
          <pre style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            lineHeight: 1.7,
            color: '#1a1d19',
            background: 'rgba(30, 33, 29, 0.02)',
            padding: '20px',
            border: '1px solid rgba(30,33,29,0.1)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}>
{`"Interior feature wall claddings, column surrounds, elevator lobby panels, and reception desk monoliths shall be fabricated from certified 12mm DuPont™ Corian® solid surface sheets meeting ASTM E84 Class 1 (Class A) surface burning characteristics with Flame Spread Index not exceeding 25 and Smoke Developed Index not exceeding 50. Material shall generate no burning droplets (d0 rating per EN 13501-1). Submittal shall include manufacturer fire test certificates. Fabricated and installed by Ace Spaces, Bengaluru."`}
          </pre>
        </div>

        {/* Cross Navigation */}
        <div style={{ borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingTop: '40px' }}>
          <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078', marginBottom: '20px' }}>
            Related Technical Standards &amp; Warranties
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Link href="/certifications/greenguard-gold" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>AIR QUALITY</span>
              <strong style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '16px' }}>GREENGUARD Gold →</strong>
            </Link>
            <Link href="/certifications/nsf-ansi-51" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>HYGIENE &amp; FOOD SAFETY</span>
              <strong style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '16px' }}>NSF/ANSI 51 Food Safe →</strong>
            </Link>
            <Link href="/guarantee" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>WARRANTY</span>
              <strong style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '16px' }}>10-Year Renewable Guarantee →</strong>
            </Link>
            <Link href="/consultation" style={{ padding: '20px', background: '#141713', color: '#fff', border: '1px solid #141713', textDecoration: 'none' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#97a397', display: 'block', marginBottom: '6px' }}>SPECIFIER DESK</span>
              <strong style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '16px', color: '#fff' }}>Consultation Form →</strong>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
