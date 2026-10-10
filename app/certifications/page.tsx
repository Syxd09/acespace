import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Architectural Technical Governance & Certifications | Ace Spaces',
  description:
    'Comprehensive technical certification registry for Ace Spaces solid surfaces: UL GREENGUARD Gold, NSF/ANSI 51 Food Safe, ASTM E84 Class 1 Fire Rated, Zero Silica compliance, and ISO quality assurances.',
  keywords: [
    'architectural material certifications',
    'solid surface standards India',
    'GREENGUARD Gold Corian',
    'NSF 51 food safe worktops',
    'ASTM Class 1 fire rating Bangalore',
    'zero silica architectural surfaces',
  ],
};

const CERTIFICATIONS = [
  {
    code: 'UL 2818',
    title: 'GREENGUARD Gold Certified',
    badge: 'Air Quality & Zero VOC',
    summary:
      'Rigorous limits on chemical emissions and zero respirable crystalline silica. Certified safe for children, schools, cleanrooms, and pediatric healthcare environments.',
    metrics: ['TVOC < 0.22 mg/m³', 'Zero Crystalline Silica (0.00% RCS)', 'LEED v4 EQ Credit'],
    href: '/certifications/greenguard-gold',
  },
  {
    code: 'NSF / ANSI 51',
    title: 'NSF/ANSI 51 Food Safe',
    badge: 'Hygiene & Culinary Contact',
    summary:
      'Certified for direct food contact and splash zones. Non-porous monolithic structure eliminates food grease absorption, cross-contamination, and microbial buildup.',
    metrics: ['Water Absorption < 0.04%', 'ASTM G21 Zero Fungal Growth', 'Coved Splashbacks'],
    href: '/certifications/nsf-ansi-51',
  },
  {
    code: 'ASTM E84',
    title: 'ASTM Class 1 Fire Rated',
    badge: 'Fire Code Life Safety',
    summary:
      'Class 1 (Class A) surface burning characteristics with Flame Spread Index < 25. Formulated with 66% mineral ATH that releases cooling steam under fire exposure.',
    metrics: ['FSI ≤ 25 (Typ. 15)', 'Smoke Index < 50', 'Zero Burning Droplets (d0)'],
    href: '/certifications/astm-fire-rated',
  },
  {
    code: 'ISO 9001 / 14001',
    title: 'Quality & Environmental Governance',
    badge: 'Foundry Standards',
    summary:
      'Precision manufacturing calibration, traceable slab batch chemistry, 5-axis CNC digital fabrication tolerances, and sustainable zero-landfill offcut recovery programs.',
    metrics: ['100% Traceable Slab Serialisation', '±0.5mm Atelier CNC Tolerance', 'Renewable Material Lifecycle'],
    href: '/about#foundation',
  },
];

export default function CertificationsHubPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', display: 'block', marginBottom: '12px' }}>
            Technical Governance · Material Safety · Building Compliance
          </span>
          <h1 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Architectural Certifications &amp; Standards
          </h1>
          <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '18px', lineHeight: 1.6, color: '#4a5249', maxWidth: '820px', margin: 0 }}>
            Ace Spaces supplies authentic DuPont™ Corian® solid surfaces fabricated to the highest global material benchmarks. Every calibrated mineral slab delivered from our Bengaluru foundry carries full laboratory verification across indoor air purity, commercial food safety, life-safety fire resistance, and worker safety mandates.
          </p>
        </div>

        {/* Certifications Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '64px' }}>
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.code}
              style={{
                background: '#fff',
                border: '1px solid var(--line, rgba(30, 33, 29, 0.18))',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', letterSpacing: '0.08em' }}>
                    [{cert.code}]
                  </span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '3px 8px', textTransform: 'uppercase' }}>
                    {cert.badge}
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '24px', fontWeight: 500, margin: '0 0 14px', color: '#1a1d19' }}>
                  {cert.title}
                </h2>

                <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', lineHeight: 1.7, color: '#4a5249', margin: '0 0 24px' }}>
                  {cert.summary}
                </p>

                <div style={{ borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '16px', marginBottom: '24px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cert.metrics.map((m, i) => (
                      <li key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#1a1d19', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#2e7d32' }}>✓</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={cert.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#1a1d19',
                  textDecoration: 'none',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line, rgba(30,33,29,0.18))',
                }}
              >
                Inspect Technical Dossier <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Global Compliance Statement */}
        <div style={{ background: '#141713', color: '#e9e8e2', padding: '48px 40px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#73c991', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                Zero Crystalline Silica Declaration (RCS Safety)
              </span>
              <h3 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '28px', fontWeight: 400, color: '#fff', margin: '0 0 16px' }}>
                100% Non-Hazardous to Cut, Route &amp; Polish
              </h3>
              <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', lineHeight: 1.7, color: '#c2cdc2', margin: 0 }}>
                Following nationwide bans on high-silica engineered stone in Australia and tightening occupational safety standards across Europe and North America, Ace Spaces confirms that our mineral solid surface slabs contain <strong>0.00% respirable crystalline silica</strong>. Safe for stone masons, CNC operators, site installers, and building occupants.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '32px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#fff' }}>
                ✓ Certified Zero RCS (Respirable Crystalline Silica)
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#fff' }}>
                ✓ Safe for Dry Cutting &amp; CNC Routing
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#fff' }}>
                ✓ Complies with OSHA &amp; Safe Work Australia Rules
              </div>
              <Link
                href="/consultation"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#e9e8e2',
                  color: '#141713',
                  padding: '12px 20px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  marginTop: '12px',
                  alignSelf: 'flex-start',
                }}
              >
                Request Specifier Certificate Dossier →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--line, rgba(30,33,29,0.18))', paddingTop: '28px' }}>
          <Link href="/guarantee" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none' }}>
            ← Inspect 10-Year Renewable Guarantee
          </Link>
          <Link href="/consultation" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none', fontWeight: 600 }}>
            Project Consultation Form →
          </Link>
        </div>

      </main>
    </div>
  );
}
