import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import ScrollReveal from '@/components/ScrollReveal';
import { materials } from '@/data/materials';

const ColourLibrary = dynamic(() => import('@/components/ColourLibrary'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'Urbanist, sans-serif', color: 'var(--muted)' }}>
      Loading Material Library...
    </div>
  ),
});

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
            text: 'Practicing architects and interior designers can request up to 6 curated 100mm × 100mm × 12mm material swatches directly through the online sample tray or via WhatsApp at +91 97410 44776.',
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
      {/* Split Architectural Hero — Minimal Opening */}
      <section className="page-split-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted, #6f786d)',
                fontWeight: 600,
              }}
            >
              Materials &amp; Palette / Slabs
            </span>
            <div style={{ width: '60px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
          </div>

          <h1
            style={{
              fontSize: 'clamp(44px, 6.8vw, 100px)',
              lineHeight: 0.96,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            Material &amp;
            <br />
            <i>colour.</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            Calibrated DuPont™ Corian® mineral slabs, architectural tones, and zero-silica surfaces for spaces across India.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="#library">
              Explore Swatches <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Order Specimen Box <span>↗</span>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Silica
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                0.00% Zero Silica
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Thickness
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                12 mm &amp; 19 mm
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Standard
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                DuPont™ Quality Network
              </strong>
            </div>
          </div>
        </div>

        {/* Clean Hero Visual Frame */}
        <ScrollReveal variant="image" className="hero-image-frame">
          <Image
            src="/assets/material-macro.png"
            alt="Macro detail of through-body architectural mineral surface"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            quality={75}
            decoding="async"
            style={{ objectFit: 'cover' }}
            priority
          />
        </ScrollReveal>
      </section>

      {/* 4 Core Material Substrates Breakdown — Frameless Architectural Monograph */}
      <section id="substrates" style={{ margin: '80px 0 100px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">The 4 Substrate Typologies</p>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
              Substrate
              <br />
              <i>classifications.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
            Homogeneous through-body formulations crafted from natural mineral bauxite and pure acrylic resin.
          </p>
        </ScrollReveal>

        <div className="sequence-monograph-rail">
          <article className="sequence-step-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">01</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Solids</span>
              <div className="sequence-step-line" />
            </div>
            <div className="sequence-step-body" style={{ paddingTop: '8px' }}>
              <h3 className="sequence-step-title" style={{ fontSize: '19px' }}>Architectural Solids</h3>
              <p className="sequence-step-desc">Solid through-body formulations with uniform color depth and an ultra-smooth satin touch.</p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Composition</span>
                <span className="sequence-footer-val">Homogeneous</span>
              </div>
            </div>
          </article>

          <article className="sequence-step-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">02</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Veined</span>
              <div className="sequence-step-line" />
            </div>
            <div className="sequence-step-body" style={{ paddingTop: '8px' }}>
              <h3 className="sequence-step-title" style={{ fontSize: '19px' }}>Architectural Veined</h3>
              <p className="sequence-step-desc">Natural veining that flows through the full thickness of the slab, continuous across waterfall mitres.</p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Grain</span>
                <span className="sequence-footer-val">Through-Body</span>
              </div>
            </div>
          </article>

          <article className="sequence-step-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">03</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Aggregates</span>
              <div className="sequence-step-line" />
            </div>
            <div className="sequence-step-body" style={{ paddingTop: '8px' }}>
              <h3 className="sequence-step-title" style={{ fontSize: '19px' }}>Terrazzo &amp; Particulates</h3>
              <p className="sequence-step-desc">Mineral particulates and aggregate flecks that bring natural texture and visual depth to high-traffic zones.</p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Texture</span>
                <span className="sequence-footer-val">Tactile Matrix</span>
              </div>
            </div>
          </article>

          <article className="sequence-step-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">04</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Translucent</span>
              <div className="sequence-step-line" />
            </div>
            <div className="sequence-step-body" style={{ paddingTop: '8px' }}>
              <h3 className="sequence-step-title" style={{ fontSize: '19px' }}>Onyx &amp; Backlit</h3>
              <p className="sequence-step-desc">Translucent mineral sheets that diffuse backlighting for illuminated bars, reception desks, and feature portals.</p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Luminance</span>
                <span className="sequence-footer-val">Diffused</span>
              </div>
            </div>
          </article>
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

        <Suspense fallback={<div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'Urbanist, sans-serif', color: 'var(--muted)' }}>Loading Material Library...</div>}>
          <ColourLibrary />
        </Suspense>
      </section>

      {/* Technical Specifications Table */}
      <section id="specs" style={{ marginBottom: '120px' }}>
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
          Review finishes and veining under natural daylight. Select up to 6 material samples from our library for complimentary delivery to your studio.
        </p>
        <Link className="button button-dark" href="/contact">
          Request Studio Specimen Box <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
