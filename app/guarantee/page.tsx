import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '10-Year Renewable Guarantee | Ace Spaces India — Architectural Warranty',
  description:
    'Comprehensive 10-Year Renewable Product and Fabrication Guarantee for DuPont™ Corian® solid surfaces by Ace Spaces in Bengaluru. Infinite on-site refinishing, zero-silica safety, and full warranty transferability.',
  keywords: [
    '10 year Corian warranty India',
    'solid surface renewable guarantee',
    'DuPont Quality Network Partner warranty Bangalore',
    'architectural warranty transferrable',
    'solid surface refinishing service',
  ],
};

export default function GuaranteePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)', fontFamily: 'Manrope, system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/about" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', textDecoration: 'none' }}>
            Practice &amp; Atelier
          </Link>
          <span style={{ color: 'var(--muted, #788078)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', fontWeight: 600 }}>
            10-Year Renewable Guarantee
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 33, 29, 0.05)', border: '1px solid rgba(30, 33, 29, 0.12)', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#73c991', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1d19', fontWeight: 600 }}>
              DuPont™ Corian® Quality Network Partner Warranty · Certified In Bengaluru
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.02, margin: '0 0 24px', letterSpacing: '-0.05em', color: 'var(--ink, #1e211d)' }}>
            10-Year Renewable
            <br />
            Material <i>guarantee.</i>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#4a5249', maxWidth: '800px', margin: 0 }}>
            Architecture should outlive trends. Ace Spaces warrants every authentic DuPont™ Corian® solid surface installation with an industry-defining 10-Year Renewable Guarantee—covering both raw material formulation and atelier fabrication integrity.
          </p>
        </div>

        {/* Key Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>
          {[
            { label: 'Warranty Duration', value: '10 Full Years', sub: 'From certified installation handover and digital sign-off' },
            { label: 'Coverage Scope', value: 'Material + Joints', sub: 'Covers slab structural integrity and seamless molecular weld lines' },
            { label: 'Renewability', value: '100% On-Site', sub: 'Scratches, heat marks, and stains are fully buffable back to new' },
            { label: 'Transferability', value: 'Fully Transferable', sub: 'Warranty transfers to new property buyers and tenants' },
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

        {/* What "Renewable" Means Section */}
        <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '44px 36px', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#1a1d19' }}>
            What makes solid surface <i>renewable?</i>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
            <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#2f352e', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                Most luxury surfaces are disposable when damaged. If granite cracks, it must be jackhammered out. If marble is etched by lemon juice, the stone is permanently discolored. If quartz chips, the repair resin leaves an unsightly patch.
              </p>
              <p>
                <strong>Solid surface is fundamentally different because it is homogeneous through-body mineral.</strong> The color, aggregate pattern, and silky tactile density on the surface exists continuously through the entire 12mm or 19mm thickness of the slab.
              </p>
              <p>
                If your kitchen benchtop or commercial reception desk suffers heavy scratching after five years of intensive service, our atelier technician simply re-sands the surface using orbital fine-grit abrasives (120 to 600 grit) and buffs it back to original atelier finish right inside your space in under two hours—with zero dust and zero cabinet demolition.
              </p>
            </div>

            <div style={{ background: 'rgba(30, 33, 29, 0.03)', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', margin: '0 0 14px' }}>
                  [On-Site Restoration Protocol]
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4a5249' }}>
                  <li><strong>Stage 1:</strong> Chemical clean with micro-degreaser</li>
                  <li><strong>Stage 2:</strong> Feather-sanding to eliminate localized scratches</li>
                  <li><strong>Stage 3:</strong> Progressive orbital cross-hatch refinement</li>
                  <li><strong>Stage 4:</strong> Satin-matte polish &amp; lint-free handover</li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '16px', marginTop: '20px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', display: 'block' }}>
                  RESULT: ZERO VISIBLE WEAR · INFINITE LIFECYCLE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Coverage Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '56px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#1a1d19' }}>
              ✓ What Is Covered Under the 10-Year Guarantee
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: 1.6, color: '#2f352e' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓</span>
                <span><strong>Material Defects:</strong> Internal voids, factory discoloration, or bubbling in authentic DuPont™ Corian® sheets.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓</span>
                <span><strong>Joint De-lamination:</strong> Chemical weld failure along factory or site-joined seams executed by Ace Spaces technicians.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓</span>
                <span><strong>Integrated Sink Bonds:</strong> Separation of under-mounted solid surface washbasins or sinks from the countertop deck.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓</span>
                <span><strong>UV Color Stability:</strong> Premature fading or yellowing under standard interior architectural illumination.</span>
              </li>
            </ul>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 16px', color: '#1a1d19' }}>
              General Care &amp; Exclusions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: 1.6, color: '#596059' }}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#788078' }}>·</span>
                <span><strong>Thermal Shock:</strong> Direct placement of cookware straight from 250°C+ open gas flames without a silicone trivet.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#788078' }}>·</span>
                <span><strong>Severe Impact:</strong> Heavy blunt trauma or physical abuse using metal hammers or heavy tools.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#788078' }}>·</span>
                <span><strong>Harsh Industrial Solvents:</strong> Sustained soaking in methylene chloride paint strippers or concentrated drain acids.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: '#788078' }}>·</span>
                <span><strong>Unauthorized Modifications:</strong> Modifications or on-site cutting executed by non-certified third-party contractors.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Claim / Inspection Contact Card */}
        <div style={{ background: '#141713', color: '#e9e8e2', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#73c991', display: 'block', marginBottom: '8px' }}>
                Warranty Desk &amp; Atelier Service Handover
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 8px' }}>
                Need to register an installation or request surface renewal?
              </h3>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#aab4aa', margin: 0 }}>
                Every Ace Spaces project is catalogued with a digital fabrication dossier and material batch serial number.
              </p>
            </div>
            <Link
              href="/consultation"
              style={{
                background: '#e9e8e2',
                color: '#141713',
                padding: '12px 24px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Contact Warranty Desk →
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--line, rgba(30,33,29,0.18))', paddingTop: '28px' }}>
          <Link href="/certifications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none' }}>
            ← Inspect Architectural Certifications &amp; Standards
          </Link>
          <Link href="/consultation" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none', fontWeight: 600 }}>
            Project Consultation Form →
          </Link>
        </div>

      </main>
    </div>
  );
}
