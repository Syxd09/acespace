import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import MaterialExplorer from '@/components/MaterialExplorer';

export const metadata: Metadata = {
  title: 'Materials & Substrates — Ace Spaces',
  description: 'Explore Ace Spaces core material systems: mineral solids, marble-veined composites, particulate textures, and translucent optics.',
};

export default function MaterialsPage() {
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
          <p className="eyebrow" style={{ marginBottom: '20px' }}>Materials / Substrates & Compositions</p>

          <h1 style={{ fontSize: 'clamp(56px, 7vw, 108px)', lineHeight: 0.92, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Material as
            <br />
            <i>substance.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            Materials define the physical substrate, tactile warmth, and engineering performance of the space. Explore our 4 core material formulations below, or browse by color palette.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/collections/colours">
              Browse Colours & Palette <span>↗</span>
            </Link>
            <Link className="text-link" href="#substrates">
              4 Material Systems <span>↓</span>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Composition
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>2/3 Natural ATH</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Hygiene
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>100% Non-Porous</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Fire Rating
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Class 1 / ASTM</strong>
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
            alt="Macro detail of through-body architectural mineral surface"
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
                Material Distinction
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Through-Body Mineral vs Surface Coatings
              </strong>
            </div>
            <Link href="/collections/colours" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              View Colours <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Material Substrates Breakdown */}
      <section id="substrates" style={{ margin: '80px 0', borderBottom: '1px solid var(--line)', paddingBottom: '80px' }}>
        <p className="eyebrow" style={{ marginBottom: '24px' }}>The 4 Core Material Substrates</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#dcd7cd', padding: '32px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '28px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>01</span>
            <h3 style={{ fontSize: '20px', margin: '0 0 10px' }}>Noma Solids</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', marginBottom: '16px' }}>
              Pure, monolithic acrylic mineral formulations offering uniform color depth and ultra-smooth tactile honings.
            </p>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Opaque • Non-Porous • Zero Seams</span>
          </div>

          <div style={{ background: '#dcd7cd', padding: '32px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '28px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>02</span>
            <h3 style={{ fontSize: '20px', margin: '0 0 10px' }}>Alto Veined</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', marginBottom: '16px' }}>
              Directional marble drift veins engineered throughout the entire sheet depth for dramatic waterfall ends.
            </p>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Directional Flow • Acid Resistant</span>
          </div>

          <div style={{ background: '#dcd7cd', padding: '32px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '28px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>03</span>
            <h3 style={{ fontSize: '20px', margin: '0 0 10px' }}>Strata & Textures</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', marginBottom: '16px' }}>
              Multi-scale mineral particulates and Venetian terrazzo aggregates providing earth-inspired tactile depth.
            </p>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Quartz Chips • Micro-Honed Grain</span>
          </div>

          <div style={{ background: '#dcd7cd', padding: '32px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '28px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>04</span>
            <h3 style={{ fontSize: '20px', margin: '0 0 10px' }}>Lumen Optics</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', marginBottom: '16px' }}>
              High-dispersion translucent minerals that transform internal LED illumination into soft, diffused architectural halos.
            </p>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Backlit • 38% Light Transmission</span>
          </div>
        </div>
      </section>

      {/* Interactive Material Explorer */}
      <section style={{ margin: '80px 0 100px' }}>
        <div className="section-head" style={{ marginBottom: '30px' }}>
          <div>
            <p className="eyebrow">Material Selection & Swatches</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Explore the
              <br />
              <i>material substrates.</i>
            </h2>
          </div>
          <Link className="button button-dark" href="/collections/colours">
            View Colour Palette (20+ Hues) <span>↗</span>
          </Link>
        </div>
        <MaterialExplorer />
      </section>

      {/* Technical Specifications Table */}
      <section style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Technical Performance & Standards</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Engineered for
              <br />
              <i>architectural permanence.</i>
            </h2>
          </div>
        </div>

        <div className="spec-table">
          <div className="spec-row">
            <span>Material Composition</span>
            <strong>Two-thirds natural mineral bauxite (ATH) bonded with advanced high-performance acrylic polymer matrix.</strong>
          </div>
          <div className="spec-row">
            <span>Standard Sheet Dimensions</span>
            <strong>3660 mm (Length) × 760 mm (Width) × 12 mm (Nominal Thickness). Custom 19mm and 6mm available on order.</strong>
          </div>
          <div className="spec-row">
            <span>Porosity & Hygiene</span>
            <strong>100% Non-porous monolithic structure. Zero microbial harborage, NSF/ANSI 51 certified for food preparation.</strong>
          </div>
          <div className="spec-row">
            <span>Fire Performance</span>
            <strong>Class 1 / Class A Fire Rating (ASTM E84). Low flame spread and low smoke toxicity.</strong>
          </div>
          <div className="spec-row">
            <span>Renewability & Lifecycle</span>
            <strong>100% Homogeneous through-body. Scuffs and stains buff out on-site with standard non-abrasive pads.</strong>
          </div>
          <div className="spec-row">
            <span>Thermal Formability</span>
            <strong>Thermoformable at 155°C – 165°C to achieve internal and external 2D/3D organic radii without discolouration.</strong>
          </div>
        </div>
      </section>

      {/* Sample Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Sample consultation & Box Delivery</p>
        <h2>
          Order architectural
          <br />
          <i>specimen boxes.</i>
        </h2>
        <p>
          Experience our mineral depth in your studio under natural daylight. We provide complimentary 100mm × 100mm material samples to architects and interior designers across India.
        </p>
        <Link className="button button-dark" href="/contact">
          Request Material Samples <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
