import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NSF/ANSI 51 Food Safe Certified Solid Surfaces | Ace Spaces India',
  description:
    'Ace Spaces solid surface systems are certified to NSF/ANSI Standard 51 for direct food contact and splash zones. Monolithic non-porous surfaces eliminating bacterial growth, mold, and silicone seam degradation.',
  keywords: [
    'NSF ANSI 51 certified solid surface',
    'food safe countertops India',
    'commercial kitchen Corian Bangalore',
    'seamless hygienic surfaces',
    'zero porosity worktops',
    'hospital washplanes certified',
  ],
};

export default function NsfAnsi51Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)', fontFamily: 'Manrope, system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/certifications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', textDecoration: 'none' }}>
            Technical Governance &amp; Standards
          </Link>
          <span style={{ color: 'var(--muted, #788078)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', fontWeight: 600 }}>
            NSF/ANSI Standard 51
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 33, 29, 0.05)', border: '1px solid rgba(30, 33, 29, 0.12)', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#73c991', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1d19', fontWeight: 600 }}>
              Food Zone &amp; Direct Contact Certified · NSF International
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.02, margin: '0 0 24px', letterSpacing: '-0.05em', color: 'var(--ink, #1e211d)' }}>
            NSF/ANSI 51
            <br />
            Food Safe <i>certification.</i>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#4a5249', maxWidth: '780px', margin: 0 }}>
            Certified by NSF International for direct food contact across all commercial culinary environments, fine dining plating counters, healthcare washplanes, and residential master kitchens. A non-porous monolithic matrix engineered to prevent bacterial harboring.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {[
            { label: 'Water Absorption Rate', value: '< 0.04%', sub: 'Total hydraulic barrier prevents bacterial fluid absorption' },
            { label: 'Food Contact Rating', value: 'Food Zone Splash', sub: 'Certified for direct food contact without sealant barriers' },
            { label: 'Bacterial & Fungal Growth', value: 'Zero Growth (0 Rating)', sub: 'Tested per ASTM G21 & ASTM G22 protocols' },
            { label: 'Seam Construction', value: 'Seamless Fusion', sub: 'Eliminates dirty silicone lines and food grease traps' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em' }}>
                {stat.label}
              </span>
              <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#1a1d19', margin: '14px 0 6px' }}>
                {stat.value}
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#596059', margin: 0, lineHeight: 1.5 }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', marginBottom: '64px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#1a1d19' }}>
              Molecular non-porosity vs. <i>porous stone.</i>
            </h2>
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#2f352e', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                Natural granites and marbles possess microscopic capillary fissures that absorb oils, moisture, poultry juices, and acids. To maintain hygiene, natural stone requires frequent re-sealing with synthetic topical sealers that wear away with daily wiping and dishwashing soaps.
              </p>
              <p>
                In contrast, <strong>Ace Spaces solid surfaces</strong> are manufactured through high-vacuum casting of pure methyl methacrylate (PMMA) acrylic and high-purity mineral ATH. The resulting material is through-body non-porous. Liquid, stains, and microbes cannot penetrate beyond the micro-surface layer.
              </p>
              <p>
                Under <strong>NSF/ANSI Standard 51</strong>, materials are rigorously evaluated for toxic chemical migration, cleanability, corrosion resistance, and abrasion durability under industrial food prep sanitation protocols.
              </p>
            </div>
          </div>

          {/* Cleanability & Chemical Resistance Protocol */}
          <div style={{ background: 'rgba(30, 33, 29, 0.03)', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
            <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', color: '#1a1d19' }}>
              [Sanitization &amp; Reagent Testing · 16-Hour Contact]
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
              {[
                { reagent: 'Sodium Hypochlorite (Bleach 5%)', result: 'Zero Staining · Washable' },
                { reagent: 'Citric Acid / Lemon Juice', result: 'Zero Etching · Intact' },
                { reagent: 'Turmeric & Beet Extract', result: 'Fully Removable on-site' },
                { reagent: 'Boiling Water (100°C shock)', result: 'No Blistering / Crazing' },
                { reagent: 'Isopropyl Alcohol (70%)', result: 'Safe Disinfection' },
              ].map((row, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(30,33,29,0.1)', paddingBottom: '10px' }}>
                  <span style={{ color: '#2f352e' }}>{row.reagent}</span>
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ {row.result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specification Clause */}
        <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '36px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078' }}>
              Commercial Food Service Specification Clause
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '3px 8px' }}>
              Architectural Submittal Text
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
{`"All food prep counters, servery pass-through ledges, culinary plating islands, and integrated handwash troughs shall be fabricated from certified DuPont™ Corian® solid surface material, certified under NSF/ANSI Standard 51 for Food Equipment Materials (Food Zone Splash & Contact). Counter-to-wall splash junctions shall feature a continuous 10mm radius thermo-welded coved upstand, permanently eliminating mechanical silicone joints. Fabricated by Ace Spaces, Bengaluru."`}
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
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>GREENGUARD Gold →</strong>
            </Link>
            <Link href="/certifications/astm-fire-rated" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>FIRE RATING</span>
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>ASTM Class 1 Fire Rated →</strong>
            </Link>
            <Link href="/guarantee" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>WARRANTY</span>
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>10-Year Renewable Guarantee →</strong>
            </Link>
            <Link href="/consultation" style={{ padding: '20px', background: '#141713', color: '#fff', border: '1px solid #141713', textDecoration: 'none' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#97a397', display: 'block', marginBottom: '6px' }}>SPECIFIER DESK</span>
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', display: 'block' }}>Consultation Form →</strong>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
