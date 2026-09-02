import React from 'react';
import Link from 'next/link';
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
      description: 'In private homes, surfaces must balance effortless tactile beauty with complete non-porous resilience against cooking oils, heat, and daily life.',
      elements: ['Monolithic Kitchen Islands', 'Continuous Waterfall Gable Ends', 'Integrated Sink Basins with Zero Silicone', 'Floating Powder Room Vanities', 'Seamless Shower Enclosures & Wall Cladding'],
      recommendedMaterials: ['Alto / Ivory Vein', 'Noma / Chalk'],
      fabricationNote: 'Color-matched thermo-welded joints ensure zero grout lines and zero bacterial harborage.'
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Dining',
      tagline: 'Sculptural arrival and ambient depth',
      description: 'High-traffic hotels, lounge bars, and restaurants demand surfaces that hold up to rigorous commercial cleaning while creating dramatic ambient lighting moments.',
      elements: ['Curved Monolithic Reception Desks', 'Backlit Translucent Cocktail Bars', 'Heavy-duty Spill-proof Dining Tables', 'Feature Screen Partitions', 'Sculptural Washroom Troughs'],
      recommendedMaterials: ['Obsidian / Still', 'Lumen / Shell'],
      fabricationNote: 'Thermoformed curves and internal optical light cavities deliver soft, diffused illumination without hot-spots.'
    },
    {
      id: 'commercial',
      title: 'Commercial & Workplaces',
      tagline: 'Precision environments for focused collaboration',
      description: 'Modern studio spaces and corporate headquarters require durable, refined work surfaces that seamlessly conceal technology and wiring infrastructure.',
      elements: ['Executive Boardroom Monoliths', 'Sub-surface Wireless Charging Desks', 'Acoustic Wall Feature Panelling', 'High-traffic Pantry Bars', 'Auditorium Rostrums'],
      recommendedMaterials: ['Noma / Chalk', 'Obsidian / Coal'],
      fabricationNote: 'Sub-surface CNC milling allows Qi wireless charging fields to pass directly through the solid surface.'
    },
    {
      id: 'retail',
      title: 'Retail & Experience Centres',
      tagline: 'Curated stages for brand expression',
      description: 'Luxury retail interiors use solid surfaces as monolithic sculptural plinths and display counters that focus attention entirely on the product.',
      elements: ['Translucent Illuminated Product Pedestals', 'Point-of-Sale Monolithic Counters', 'Architectural Feature Archways', 'Branded Visual Merchandising Fixtures'],
      recommendedMaterials: ['Lumen / Shell', 'Strata / Silt'],
      fabricationNote: 'High-precision 5-axis CNC routing enables intricate lettering, logo relief engravings, and diffusers.'
    },
    {
      id: 'custom',
      title: 'Custom Architecture & Art',
      tagline: 'One-off elements shaped around pure intent',
      description: 'Beyond horizontal planes, solid surfaces can be heated, bent, carved, and hand-finished into complex 3-dimensional sculptural commissions.',
      elements: ['Thermoformed Spiral Staircase Wraps', 'Sculptural Organic Public Benches', 'Monumental Facade Features', 'Bespoke Lighting Installations'],
      recommendedMaterials: ['Alto / Ivory Vein', 'Obsidian / Coal'],
      fabricationNote: 'Custom CNC timber bucks and multi-stage vacuum thermoforming allow complex freeform geometry.'
    }
  ];

  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Applications / Spatial Typologies</p>
        <h1>
          Made to
          <br />
          <i>belong.</i>
        </h1>
        <p>
          Discover how Ace Spaces through-body mineral surfaces move through residential sanctuaries, dramatic hospitality settings, and monumental custom architecture.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          One material.
          <br />
          <i>Infinite form.</i>
        </h2>
        <div className="page-copy">
          <p>
            A surface can be quiet or expressive, intimate or monumental. Our role is to collaborate with architects and designers to find the right scale, the right edge, and the right joint detail for each spatial brief.
          </p>
          <p>
            Explore our core application sectors below to see recommended material pairings, edge details, and fabrication techniques.
          </p>
        </div>
      </section>

      {/* Sector Deep-Dive Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', marginBottom: '120px' }}>
        {sectors.map((sector, index) => (
          <section
            key={sector.id}
            id={sector.id}
            style={{
              paddingTop: '60px',
              borderTop: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) 1.6fr',
              gap: '60px'
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                Sector 0{index + 1}
              </span>
              <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', margin: '0 0 12px' }}>
                {sector.title.split(' ')[0]}
                <br />
                <i>{sector.title.split(' ').slice(1).join(' ')}</i>
              </h2>
              <p style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '24px' }}>
                {sector.tagline}
              </p>
              <Link className="text-link" href="/contact">
                Discuss a {sector.title.split(' ')[0]} Brief <span>↗</span>
              </Link>
            </div>

            <div>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#4a5249', marginBottom: '32px' }}>
                {sector.description}
              </p>

              <div style={{ background: '#dcd7cd', padding: '30px', border: '1px solid var(--line)', marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
                  Key Architectural Elements
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
                  {sector.elements.map((el) => (
                    <li key={el}>{el}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
