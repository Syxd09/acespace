import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architectural Applications — Ace Spaces',
  description: 'Explore how Ace Spaces architectural surfaces move through residential, hospitality, commercial, retail, and custom architectural spaces.',
};

export default function ApplicationsPage() {
  const sectors = [
    {
      id: 'residential',
      title: 'Residential Architecture',
      tagline: 'Quiet luxury for daily living',
      image: '/assets/hero-ace.png',
      description: 'In private homes, surfaces must balance effortless tactile beauty with complete non-porous resilience against cooking oils, heat, and daily life.',
      elements: ['Monolithic Kitchen Islands', 'Continuous Waterfall Gable Ends', 'Integrated Sink Basins with Zero Silicone', 'Floating Powder Room Vanities', 'Seamless Shower Enclosures & Wall Cladding'],
      recommendedMaterials: ['Alto / Ivory Vein', 'Noma / Chalk'],
      fabricationNote: 'Color-matched thermo-welded joints ensure zero grout lines and zero bacterial harborage.'
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Dining',
      tagline: 'Sculptural arrival and ambient depth',
      image: '/assets/material-macro.png',
      description: 'High-traffic hotels, lounge bars, and restaurants demand surfaces that hold up to rigorous commercial cleaning while creating dramatic ambient lighting moments.',
      elements: ['Curved Monolithic Reception Desks', 'Backlit Translucent Cocktail Bars', 'Heavy-duty Spill-proof Dining Tables', 'Feature Screen Partitions', 'Sculptural Washroom Troughs'],
      recommendedMaterials: ['Obsidian / Still', 'Lumen / Shell'],
      fabricationNote: 'Thermoformed curves and internal optical light cavities deliver soft, diffused illumination without hot-spots.'
    },
    {
      id: 'commercial',
      title: 'Commercial & Workplaces',
      tagline: 'Precision environments for focused collaboration',
      image: '/assets/hero-ace.png',
      description: 'Modern studio spaces and corporate headquarters require durable, refined work surfaces that seamlessly conceal technology and wiring infrastructure.',
      elements: ['Executive Boardroom Monoliths', 'Sub-surface Wireless Charging Desks', 'Acoustic Wall Feature Panelling', 'High-traffic Pantry Bars', 'Auditorium Rostrums'],
      recommendedMaterials: ['Noma / Chalk', 'Obsidian / Coal'],
      fabricationNote: 'Sub-surface CNC milling allows Qi wireless charging fields to pass directly through the solid surface.'
    },
    {
      id: 'retail',
      title: 'Retail & Experience Centres',
      tagline: 'Curated stages for brand expression',
      image: '/assets/material-macro.png',
      description: 'Luxury retail interiors use solid surfaces as monolithic sculptural plinths and display counters that focus attention entirely on the product.',
      elements: ['Translucent Illuminated Product Pedestals', 'Point-of-Sale Monolithic Counters', 'Architectural Feature Archways', 'Branded Visual Merchandising Fixtures'],
      recommendedMaterials: ['Lumen / Shell', 'Strata / Silt'],
      fabricationNote: 'High-precision 5-axis CNC routing enables intricate lettering, logo relief engravings, and diffusers.'
    },
    {
      id: 'custom',
      title: 'Custom Architecture & Art',
      tagline: 'One-off elements shaped around pure intent',
      image: '/assets/hero-ace.png',
      description: 'Beyond horizontal planes, solid surfaces can be heated, bent, carved, and hand-finished into complex 3-dimensional sculptural commissions.',
      elements: ['Thermoformed Spiral Staircase Wraps', 'Sculptural Organic Public Benches', 'Monumental Facade Features', 'Bespoke Lighting Installations'],
      recommendedMaterials: ['Alto / Ivory Vein', 'Obsidian / Coal'],
      fabricationNote: 'Custom CNC timber bucks and multi-stage vacuum thermoforming allow complex freeform geometry.'
    }
  ];

  return (
    <main className="page-main" style={{ paddingTop: '100px' }}>
      {/* Rich Split Architectural Hero */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.1fr) 0.9fr',
          gap: '6vw',
          alignItems: 'center',
          padding: '60px 0 90px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <p className="eyebrow" style={{ marginBottom: "20px" }}>Applications / Spatial Typologies</p>

          <h1 style={{ fontSize: 'clamp(56px, 7vw, 108px)', lineHeight: 0.92, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Made to
            <br />
            <i>belong.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            Discover how Ace Spaces through-body mineral surfaces move through residential sanctuaries, dramatic hospitality settings, and monumental custom architecture.
          </p>

          {/* Fast Navigation Jump Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {sectors.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  border: '1px solid var(--line)',
                  background: 'transparent',
                  color: 'var(--ink)',
                  transition: 'all 0.25s ease',
                }}
              >
                {s.title.split(' ')[0]} ↓
              </a>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Sectors
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>05 Typologies</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Joinery
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>100% Seamless</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Fabrication
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Bengaluru Hub</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div
          style={{
            position: 'relative',
            height: '520px',
            background: '#dcd7cd',
            border: '1px solid var(--line)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src="/assets/hero-ace.png"
            alt="Minimalist architectural kitchen island in private residence"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(233, 232, 226, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '16px 20px',
              border: '1px solid rgba(30,33,29,0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Featured Application
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Monolithic Island • Alto / Ivory Vein
              </strong>
            </div>
            <Link href="/projects/private-residence" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              View Case <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sector Deep-Dive Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', margin: '100px 0 120px' }}>
        {sectors.map((sector, index) => (
          <section
            key={sector.id}
            id={sector.id}
            style={{
              paddingTop: '70px',
              borderTop: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr',
              gap: '60px',
              alignItems: 'start',
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                Sector 0{index + 1}
              </span>
              <h2 style={{ fontSize: 'clamp(38px, 4.8vw, 64px)', margin: '0 0 12px', lineHeight: 0.95 }}>
                {sector.title.split(' ')[0]}
                <br />
                <i>{sector.title.split(' ').slice(1).join(' ')}</i>
              </h2>
              <p style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '28px' }}>
                {sector.tagline}
              </p>
              <Link className="button button-dark" href="/contact">
                Discuss a {sector.title.split(' ')[0]} Brief <span>↗</span>
              </Link>
            </div>

            <div>
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#4a5249', marginBottom: '32px' }}>
                {sector.description}
              </p>

              <div style={{ background: '#dcd7cd', padding: '32px', border: '1px solid var(--line)', marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                  Key Architectural Elements
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '14px', color: 'var(--ink)' }}>
                  {sector.elements.map((el) => (
                    <li key={el} style={{ lineHeight: 1.5 }}>{el}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--paper)', padding: '24px', border: '1px solid var(--line)' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                    Recommended Palette
                  </span>
                  <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {sector.recommendedMaterials.join(' • ')}
                  </strong>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                    Fabrication Advantage
                  </span>
                  <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {sector.fabricationNote}
                  </strong>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="callout">
        <p className="eyebrow">Architectural support</p>
        <h2>
          Bring us
          <br />
          <i>the spatial brief.</i>
        </h2>
        <p>From initial material selection to shop drawings and site installation, we guide your team every step of the way.</p>
        <Link className="button button-dark" href="/contact">
          Start a project consultation <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

