import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import EdgeProfileCatalog from '@/components/EdgeProfileCatalog';

export const metadata: Metadata = {
  title: 'Fabrication Craft & Machinery — Ace Spaces',
  description: 'Precision CNC routing, thermoforming, seamless joining, and hand-honed finishing for architectural solid surfaces in India.',
};

export default function FabricationPage() {
  const steps = [
    {
      num: '01',
      title: '5-Axis CNC & Precision Cutting',
      description: 'Our Bengaluru facility utilizes automated 5-axis CNC routing systems capable of achieving cutting tolerances under 0.2mm. Complex CAD geometries, sink cutouts, and sub-surface charging pockets are nested and milled with robotic repeatability.',
      specs: '0.2mm tolerance • Nested CAD/CAM • Integrated undercut sink routings'
    },
    {
      num: '02',
      title: 'Seamless Inconspicuous Joining',
      description: 'By pairing solid surface components with chemically active, color-matched acrylic adhesives, adjacent sheets are thermo-welded together. Once cured, the joint becomes completely homogeneous and invisible to touch and sight.',
      specs: 'Color-matched resin matrix • Zero dirt traps • Monolithic appearance'
    },
    {
      num: '03',
      title: 'Thermoforming & Organic Curvature',
      description: 'Heated to 160°C within calibrated industrial platen ovens, mineral sheets transition into a pliable state. They are formed over CNC-milled timber bucks using vacuum press technology to achieve compound curves and fluid radii.',
      specs: 'Vacuum membrane forming • 2D & 3D multi-radius • Zero surface blanching'
    },
    {
      num: '04',
      title: 'Hand Honing & Surface Finishing',
      description: 'Every fabricated piece undergoes a 5-stage progressive dry and wet hand-honing sequence, graduating from 120-grit up to 600-grit micro-abrasives. This creates an ultra-tactile matte or satin finish with flawless light absorption.',
      specs: '120 to 600-grit hand finish • Anti-glare chalk touch • Renewable surface'
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#dcd7cd', padding: '6px 14px', borderRadius: '100px', marginBottom: '24px', border: '1px solid var(--line)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ink)' }} />
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Bengaluru Workshop & Advanced Machinery
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(56px, 7vw, 108px)', lineHeight: 0.92, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            From sheet
            <br />
            to <i>space.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            We unite advanced digital fabrication with master joinery craft to turn raw mineral sheets into monumental, monolithic interior elements.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Discuss Fabrication Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#process">
              4-Stage Sequence <span>↓</span>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Tolerance
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>&lt; 0.2 mm</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Forming
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>3D Thermoform</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Finishing
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>600-Grit Honed</strong>
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
            src="/assets/material-macro.png"
            alt="Hand honing and CNC carving of monolithic mineral surface"
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
                Craft Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Hand-Honed Satin Edge • Sub-millimeter Tolerance
              </strong>
            </div>
            <Link href="#edges" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Edge Profiles <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Craft Sequence */}
      <section id="process" style={{ margin: '80px 0 100px' }}>
        <p className="eyebrow" style={{ marginBottom: '30px' }}>The 4-Stage Workshop Sequence</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: '#dcd7cd',
                padding: '35px 30px',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease',
              }}
            >
              <div>
                <span style={{ fontSize: '32px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '16px' }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 14px', lineHeight: 1.2 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '24px' }}>
                  {step.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '16px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                  Technical Parameters
                </span>
                <strong style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)' }}>
                  {step.specs}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Edge Profile Catalog */}
      <section id="edges" style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Architectural Detailing</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Edge Profile
              <br />
              <i>catalog.</i>
            </h2>
          </div>
          <p style={{ maxWidth: '380px', fontSize: '14px', color: '#5d665c', lineHeight: 1.6 }}>
            Select an edge detail below to explore how light, shadow, and tactile touch behave across different architectural profiles.
          </p>
        </div>

        <EdgeProfileCatalog />
      </section>

      {/* Workshop Specs Table */}
      <section style={{ marginBottom: '120px' }}>
        <p className="eyebrow">Workshop Specifications & Site Protocols</p>
        <div className="spec-table">
          <div className="spec-row">
            <span>Laser Digital Templating</span>
            <strong>On-site 3D laser digitizing ensuring sub-millimeter alignment with out-of-square walls and structural columns.</strong>
          </div>
          <div className="spec-row">
            <span>Workshop Pre-Assembly</span>
            <strong>All large architectural volumes are dry-fitted, clamped, and inspected in our workshop prior to site delivery.</strong>
          </div>
          <div className="spec-row">
            <span>On-Site Seamless Welding</span>
            <strong>Trained master fabricators execute final field joins, invisible polishing, and silicone-free perimeter integration.</strong>
          </div>
          <div className="spec-row">
            <span>Care & Refinishing Service</span>
            <strong>Full architectural maintenance, on-site scratch removal, and periodic honing services across major Indian metros.</strong>
          </div>
        </div>
      </section>

      <section className="callout">
        <p className="eyebrow">Technical fabrication consultation</p>
        <h2>
          Make the
          <br />
          <i>unusual possible.</i>
        </h2>
        <p>Send us your drawings or 3D models. Our engineering and fabrication team will review details, suggest joint locations, and provide prototypes.</p>
        <Link className="button button-dark" href="/contact">
          Discuss a Fabrication Brief <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
