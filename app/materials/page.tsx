import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ColourLibrary from '@/components/ColourLibrary';
import JsonLd from '@/components/JsonLd';
import { materials } from '@/data/materials';

export const metadata: Metadata = {
  title: 'Materials & Colours — Substrates, Slabs & Architectural Palette',
  description:
    'Explore the complete Ace Spaces architectural solid surface material and colour library. Calibrated through-body mineral slabs (3660mm × 760mm, 12mm & 19mm), 4 core substrates, 20+ architectural tones, zero-silica safety, and studio sample box ordering in Bengaluru, India.',
  keywords: [
    'DuPont Corian colours India',
    'solid surface slabs Bengaluru',
    '3660x760mm Corian sheets',
    'zero silica kitchen slab',
    'architectural mineral palette',
    'translucent solid surface backlit',
    'White Chalk Corian AC-0101',
    'Calacatta Greige solid surface',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/materials',
  },
  openGraph: {
    title: 'Materials & Colours — Substrates, Slabs & Palette | Ace Spaces',
    description:
      'Calibrated through-body mineral slabs (3660 × 760mm) and 20+ architectural solid surface colorways. Zero-silica, non-porous, and certified for luxury architecture.',
    url: 'https://acespacesindia.vercel.app/materials',
    images: [
      {
        url: '/assets/hero-ace.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Materials & Colours Swatch Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Materials & Colours — Substrates, Slabs & Palette | Ace Spaces',
    description:
      'Explore 20+ architectural solid surface colors, calibrated mineral slabs, and studio sample box ordering.',
    images: ['/assets/hero-ace.png'],
  },
};

const materialsJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'Ace Spaces Architectural Solid Surface Slabs & Palette',
      description: 'Curated architectural through-body mineral slabs available in 3660mm × 760mm (12mm & 19mm).',
      itemListElement: materials.map((m, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: m.name,
          identifier: m.code,
          description: m.description,
          image: `https://acespacesindia.vercel.app${m.textureImage || m.image}`,
          category: 'Building Materials / Solid Surface Slabs',
          material: 'Aluminium Trihydrate (ATH) & Pure PMMA Acrylic Resin',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'INR',
            url: `https://acespacesindia.vercel.app/materials/${m.slug}`,
          },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the standard dimensions of Ace Spaces solid surface slabs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard slabs are calibrated at 3660 mm in length by 760 mm in width (12.0 ft × 2.5 ft). They are stocked in 12mm thickness for standard architectural worktops, vertical cladding, and vanity basins, and 19mm for heavy-duty monolithic plinths.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Ace Spaces solid surface 100% zero crystalline silica?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Ace Spaces solid surface is composed of approximately 66% natural mineral Aluminium Trihydrate (ATH) and 33% pure acrylic polymer. It contains 0.00% crystalline silica, producing zero toxic silica dust during cutting, routing, or sanding.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do architects order the Specifier Sample Tray in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Practicing architects and interior designers can request up to 6 curated 100mm × 100mm × 12mm material swatches directly through the online sample tray or via WhatsApp at +91 98450 12345.',
          },
        },
      ],
    },
  ],
};

export default function MaterialsAndColoursPage() {
  return (
    <main className="page-main">
      <JsonLd data={materialsJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>Materials &amp; Colours / Substrates, Slabs &amp; Palette</p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Material &amp;
            <br />
            <i>colour.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '540px', marginBottom: '16px' }}>
            Ace Spaces is the primary raw material source and architectural colour library for architects and interior designers — providing calibrated solid surface slabs (3660mm &times; 760mm &times; 12mm/19mm), custom blanks, and 20+ through-body mineral hues that power seamless spatial creations.
          </p>

          <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '24px' }}>
            Direct Material Supply &amp; Curated Tonal Palette for Designers &amp; Architects
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#library">
              Explore Swatches &amp; Palette <span>↓</span>
            </Link>
            <Link className="text-link" href="#substrates">
              4 Core Substrates <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Order Specimen Box <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Composition
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>2/3 Natural ATH</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Palette
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>20+ Colours</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Hygiene
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>100% Non-Porous</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Dispatch
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>48h Courier</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/material-macro.png"
            alt="Macro detail of through-body architectural mineral surface and colour swatches"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Integrated Palette &amp; Substrate
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Through-Body Mineral Slabs &amp; Colour Swatches
              </strong>
            </div>
            <Link href="#library" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Select Samples <span>↓</span>
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
            <h3 style={{ fontSize: '20px', margin: '0 0 10px' }}>Strata &amp; Textures</h3>
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

      {/* Comprehensive Colour & Swatch Library Component */}
      <section id="library" style={{ margin: '80px 0 100px' }}>
        <div className="section-head" style={{ marginBottom: '36px' }}>
          <div>
            <p className="eyebrow">Interactive Palette &amp; Swatches</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Complete colour &amp;
              <br />
              <i>mineral library.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '440px', margin: 0, lineHeight: 1.6 }}>
            Filter by hue family, pattern, translucency, or search by code. Click any swatch to inspect high-resolution macro textures, or add specimens to your complimentary studio sample box.
          </p>
        </div>

        <ColourLibrary />
      </section>

      {/* Technical Specifications Table */}
      <section style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Technical Performance &amp; Standards</p>
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
            <strong>3660 mm (Length) &times; 760 mm (Width) &times; 12 mm (Nominal Thickness). Custom 19mm and 6mm available on order.</strong>
          </div>
          <div className="spec-row">
            <span>Porosity &amp; Hygiene</span>
            <strong>100% Non-porous monolithic structure. Zero microbial harborage, NSF/ANSI 51 certified for food preparation.</strong>
          </div>
          <div className="spec-row">
            <span>Fire Performance</span>
            <strong>Class 1 / Class A Fire Rating (ASTM E84). Low flame spread and low smoke toxicity.</strong>
          </div>
          <div className="spec-row">
            <span>Renewability &amp; Lifecycle</span>
            <strong>100% Homogeneous through-body. Scuffs and stains buff out on-site with standard non-abrasive pads.</strong>
          </div>
          <div className="spec-row">
            <span>Thermal Formability</span>
            <strong>Thermoformable at 155&deg;C &ndash; 165&deg;C to achieve internal and external 2D/3D organic radii without discolouration.</strong>
          </div>
        </div>
      </section>

      {/* Sample Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Sample consultation &amp; Box Delivery</p>
        <h2>
          Order architectural
          <br />
          <i>specimen boxes.</i>
        </h2>
        <p>
          Experience our mineral depth in your studio under natural daylight. Select up to 6 colour specimens from our library above and order a complimentary 100mm &times; 100mm specimen box delivered directly to your studio.
        </p>
        <Link className="button button-dark" href="/contact">
          Request Studio Specimen Box <span>&nearr;</span>
        </Link>
      </section>
    </main>
  );
}
