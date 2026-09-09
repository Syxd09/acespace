import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Architectural Specification | Ace Spaces',
  description: 'Terms of architectural specification, material supply tolerances, and 10-year renewable guarantee for Ace Spaces solid surfaces.',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)' }}>
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '140px 24px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)' }}>
            Foundry Specification Standards
          </span>
          <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: '42px', fontWeight: 400, margin: '8px 0 16px', letterSpacing: '-0.02em' }}>
            Terms of Architectural Specification
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#596059' }}>
            Edition 2026.1 · Certified Mineral Composites & Monolithic Slabs
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontFamily: 'var(--sans, sans-serif)', lineHeight: 1.8, fontSize: '15px', color: '#2f352e' }}>
          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              1. Material Consistency & Natural Mineral Formulation
            </h2>
            <p>
              Ace Spaces surfaces are formulated from premium aluminum trihydrate (ATH) and advanced cross-linked acrylic resins. While solid color formulations (Noma series) maintain rigorous Delta E &lt; 0.5 color consistency, particulate, terrazzo, and veined collections (Alto &amp; Strata series) exhibit organic particulate dispersion inherent to cast mineral production.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              2. Fabrication & Seamless Thermo-Welding Standards
            </h2>
            <p>
              To achieve imperceptible joint lines (&lt; 0.08mm) and maintain the monolithic integrity of Ace Spaces architectural features, fabrication must follow our certified adhesive guidelines. Only Ace Spaces two-component reactive methacrylate color-matched adhesives may be specified for structural seams.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              3. Sample Specimen Orders & Delivery
            </h2>
            <p>
              Standard 100mm × 100mm curated specimens and bespoke custom sample boxes ordered via the Sample Tray are provided complimentary to registered architectural practices, interior designers, and commercial specifiers. Specimens represent typical color and finish at the time of casting.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              4. 10-Year Renewable Guarantee
            </h2>
            <p>
              All properly fabricated and installed Ace Spaces interior surfaces are backed by our 10-Year Renewable Guarantee covering material delamination, structural cracking under standard thermal conditions, and porosity breakdown. Because our surfaces are solid through-body, scratches or surface blemishes are 100% renewable on-site with standard orbital honing pads.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '1px solid var(--line, #ddd8ce)' }}>
          <Link href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1d19', textDecoration: 'none' }}>
            ← Return to Ace Spaces Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
