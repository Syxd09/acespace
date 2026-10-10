import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GREENGUARD Gold Certified Solid Surface | Ace Spaces India',
  description:
    'Ace Spaces architectural solid surfaces are certified UL GREENGUARD Gold (UL 2818) for ultra-low chemical emissions, zero crystalline silica, and compliance with pediatric healthcare and educational clean-air mandates.',
  keywords: [
    'GREENGUARD Gold solid surface',
    'UL 2818 certified Corian',
    'zero VOC countertops',
    'zero silica solid surfaces Bangalore',
    'LEED v4 low emitting materials',
    'healthcare architectural surfaces India',
  ],
};

export default function GreenguardGoldPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)', fontFamily: 'Manrope, system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Breadcrumb & Technical Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/certifications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', textDecoration: 'none' }}>
            Technical Governance &amp; Standards
          </Link>
          <span style={{ color: 'var(--muted, #788078)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', fontWeight: 600 }}>
            UL 2818 GREENGUARD Gold
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 33, 29, 0.05)', border: '1px solid rgba(30, 33, 29, 0.12)', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#73c991', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1d19', fontWeight: 600 }}>
              Standard UL 2818 · Certification Active &amp; Calibrated
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.02, margin: '0 0 24px', letterSpacing: '-0.05em', color: 'var(--ink, #1e211d)' }}>
            GREENGUARD Gold
            <br />
            Air Quality <i>certification.</i>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#4a5249', maxWidth: '780px', margin: 0 }}>
            Ace Spaces architectural solid surfaces fulfill the world’s most stringent chemical emissions thresholds, safeguarding indoor air quality for neonatal wards, educational facilities, and luxury residential environments with verified zero volatile organic compounds and zero crystalline silica.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {[
            { label: 'TVOC Emission Limit', value: '< 0.22 mg/m³', sub: '90% lower than standard commercial grade thresholds' },
            { label: 'Formaldehyde Content', value: '< 0.0073 ppm', sub: 'Below limits of human olfactory and pulmonary detection' },
            { label: 'Crystalline Silica', value: '0.00% (Zero RCS)', sub: '100% natural mineral ATH + acrylic resin matrix' },
            { label: 'LEED & WELL Alignment', value: 'Credit EQ 4.1', sub: 'Complies with CDPH Standard Method v1.2' },
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

        {/* Detailed Technical Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', marginBottom: '64px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#1a1d19' }}>
              Why air quality matters in <i>specification.</i>
            </h2>
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#2f352e', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                Standard synthetic laminates, engineered quartz with volatile solvent glues, and traditional solvent-based varnishes continually off-gas volatile organic compounds (VOCs) into sealed interior spaces. These micro-pollutants compromise building occupant wellness, aggravate respiratory conditions, and fail modern sustainable design codes.
              </p>
              <p>
                The <strong>UL GREENGUARD Gold standard</strong> was engineered specifically to protect sensitive individuals—including children in schools and patients in intensive healthcare environments. Solid surface materials supplied and fabricated by Ace Spaces in Bengaluru undergo rigorous dynamic environmental chamber testing over 168-hour cycles to ensure total chemical safety under real-world ambient conditions.
              </p>
              <p>
                Because our material consists of high-purity Aluminium Trihydrate (ATH) bound in high-performance acrylic polymer, it does not release off-gassing particles, plasticizers, or toxic aldehydes over its entire multi-decade service life.
              </p>
            </div>
          </div>

          {/* Testing Criteria Matrix */}
          <div style={{ background: 'rgba(30, 33, 29, 0.03)', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
            <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px', color: '#1a1d19' }}>
              [Technical Chamber Limits · UL 2818]
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>
              {[
                { param: 'Individual VOCs', limit: '≤ 1/100th TLV', status: 'Passed' },
                { param: 'Formaldehyde (HCHO)', limit: '≤ 9.0 µg/m³', status: 'Passed' },
                { param: 'Total Aldehydes', limit: '≤ 0.043 ppm', status: 'Passed' },
                { param: 'Target CREG Carcinogens', limit: 'None Detected', status: 'Passed' },
                { param: 'Phthalate Esters', limit: 'None Detected', status: 'Passed' },
              ].map((row, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(30,33,29,0.1)', paddingBottom: '10px' }}>
                  <span style={{ color: '#2f352e' }}>{row.param}</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#788078' }}>{row.limit}</span>
                    <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ {row.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifier Tender Copy Block */}
        <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '36px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078' }}>
              Architectural Specification Clause (CSI Section 06 61 16)
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '3px 8px' }}>
              Ready for Studio Tender Docs
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
{`"Solid surface fabrication and horizontal/vertical interior wall lining shall be DuPont™ Corian® solid surface material, certified under UL 2818 GREENGUARD Gold for Low Chemical Emissions. The composite shall exhibit Total VOC emissions not exceeding 0.22 mg/m³, contain 0.00% respirable crystalline silica, and comply with CDPH Standard Method v1.2 for classroom and healthcare occupancies. Fabrication by Ace Spaces, Bengaluru with seamless thermo-welded joints."`}
          </pre>
        </div>

        {/* Cross-Navigation to Other Technical Governance Pages */}
        <div style={{ borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingTop: '40px' }}>
          <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078', marginBottom: '20px' }}>
            Related Technical Standards &amp; Warranties
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Link href="/certifications/nsf-ansi-51" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>HYGIENE &amp; FOOD SAFETY</span>
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>NSF/ANSI 51 Food Safe →</strong>
            </Link>
            <Link href="/certifications/astm-fire-rated" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>FIRE SAFETY CODE</span>
              <strong style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>ASTM Class 1 Fire Rated →</strong>
            </Link>
            <Link href="/guarantee" style={{ padding: '20px', background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.18))', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block', marginBottom: '6px' }}>WARRANTY ASSURANCE</span>
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
