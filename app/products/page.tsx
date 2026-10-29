import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { productsData } from '@/data/products';

export const metadata: Metadata = {
  title: 'Architectural Products — Benchtops, Sinks, Washplanes & Vanities',
  description:
    'Explore Ace Spaces precision-fabricated solid surface architectural systems: monolithic benchtops, integrated sinks, commercial washplanes, floating vanities, EOT grooming stations, healthcare clinical bays, and bespoke 3D thermoformed works.',
  keywords: [
    'solid surface benchtops India',
    'seamless integrated sinks Corian',
    'commercial washplane troughs Bengaluru',
    'cantilevered floating vanities',
    'end of trip bathroom solutions',
    'clinical scrub sinks solid surface',
    'bespoke 3D thermoformed furniture',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/products',
  },
  openGraph: {
    title: 'Architectural Products — Benchtops, Sinks, Washplanes & Vanities | Ace Spaces',
    description:
      'Precision-engineered monolithic solid surface systems fabricated with 5-axis CNC accuracy and invisible molecular welds.',
    url: 'https://acespacesindia.vercel.app/products',
    images: [
      {
        url: '/images/images/app_residential_artista_mist_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Architectural Products Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural Products | Ace Spaces',
    description:
      'Explore monolithic benchtops, seamlessly fused sinks, commercial washplanes, and bespoke architectural fixtures.',
    images: ['/images/images/app_residential_artista_mist_1.jpg'],
  },
};

const productsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Ace Spaces Architectural Products & Systems',
  description: 'Precision solid surface architectural solutions manufactured in Bengaluru, India.',
  itemListElement: productsData.map((p, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: p.name,
      identifier: p.code,
      category: p.categoryName,
      description: p.heroDescription,
      image: `https://acespacesindia.vercel.app${p.image}`,
      brand: {
        '@type': 'Brand',
        name: 'Ace Spaces',
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'INR',
        url: `https://acespacesindia.vercel.app/products/${p.slug}`,
      },
    },
  })),
};

export default function ProductsCatalogPage() {
  const mainProducts = productsData.filter((p) => p.slug !== 'design-certainty');
  const designCertainty = productsData.find((p) => p.slug === 'design-certainty');

  return (
    <main className="page-main">
      <JsonLd data={productsJsonLd} />
      {/* Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>
            Fabrication &amp; Systems / Architectural Products
          </p>

          <h1
            style={{
              fontSize: 'clamp(44px, 7vw, 108px)',
              lineHeight: 0.96,
              margin: '0 0 28px',
              letterSpacing: '-0.06em',
            }}
          >
            Formed for
            <br />
            <i>purpose.</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#4a5249',
              maxWidth: '540px',
              marginBottom: '20px',
            }}
          >
            From monolithic kitchen benchtops with coved splashbacks to multi-station commercial washplanes and infection-controlled surgical scrub bays. Ace Spaces precision-fabricates solid surface into finished architectural fixtures that unite seamless beauty with permanent non-porous hygiene.
          </p>

          <div
            style={{
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '28px',
            }}
          >
            Calibrated DuPont™ Corian® &amp; ATH Mineral Fabrication
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="btn-3d-configurator" href="/configurator" style={{ padding: '12px 22px' }}>
              <span className="btn-3d-label">LAUNCH 3D CONFIGURATOR</span>
              <span className="btn-3d-icon-badge" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </span>
            </Link>
            <Link className="button button-dark" href="#products-grid">
              Browse Range <span>↓</span>
            </Link>
            <Link className="text-link" href="/materials">
              Corian® Palette <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Joint Integrity
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                100% Inconspicuous
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Silicone Grout
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                Zero (Silicone-Free)
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Machining
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                5-Axis CNC &plusmn;0.2mm
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/app_residential_calacatta_greige_1.jpg"
            alt="Seamless architectural solid surface benchtop with integrated coved sink"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            quality={75}
            decoding="async"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span
                style={{
                  fontSize: '9px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Fabricated Product Portfolio
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Sinks, Benchtops, Washplanes &amp; Clinical Systems
              </strong>
            </div>
            <Link href="#products-grid" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Explore Products <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive 3D Configurator Feature Banner (Architectural Editorial Theme) */}
      <section className="products-feature-banner" style={{ margin: '60px 0 40px', background: 'var(--ink, #1e211d)', color: '#fff', border: '1px solid var(--line, rgba(255,255,255,0.08))', boxSizing: 'border-box', width: '100%', overflow: 'hidden' }}>
        <div className="products-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', alignItems: 'stretch' }}>
          <div style={{ padding: 'clamp(36px, 5vw, 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--brand-red, #d43833)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-block' }}>02</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>/</span>
              </span>
              <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Interactive 3D Specification Studio</span>
            </p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', lineHeight: 1.12, color: '#fff', marginBottom: '18px', fontWeight: 400, letterSpacing: '-0.02em' }}>
              Parametric fixtures,
              <br />
              <i style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: '#e9e8e2' }}>calibrated to the millimetre.</i>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(233, 232, 226, 0.72)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '28px' }}>
              Directly calibrate vanities, washplanes, monolithic benchtops, and clinical stations in real-time WebGL. Test calibrated Corian® mineral surfaces, configure custom coved splashbacks, and generate verified engineering quote briefs.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/configurator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 24px',
                  background: '#f2f0ea',
                  color: '#1e211d',
                  border: '1px solid #ffffff',
                  borderLeft: '3px solid var(--brand-red, #d43833)',
                  borderRadius: '0',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-red, #d43833)', flexShrink: 0, lineHeight: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </span>
                <span style={{ color: '#1e211d', fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>
                  LAUNCH 3D STUDIO WORKSPACE
                </span>
                <span style={{ color: '#1e211d', fontSize: '15px', lineHeight: 0 }}>
                  ↗
                </span>
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Presets:</span>
              <Link href="/basin-configurator" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#ffb5b2', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Basins &amp; Vanities ↗</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link href="/configurator?preset=vanity-single" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Single Basin ↗</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link href="/configurator?preset=vanity-double" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Double Basin ↗</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link href="/configurator?preset=washplane-linear" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Washplane ↗</Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <Link href="/configurator?preset=healthcare-station" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Clinical Scrub ↗</Link>
            </div>
          </div>
          <div style={{ background: '#161815', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(28px, 4vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dimensional Bounds</span>
                  <strong style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: '#fff', letterSpacing: '0.04em' }}>STUDIO PARAMETERS</strong>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '10px', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Parametric Length</span>
                  <span style={{ color: '#fff' }}>600 — 3600 mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Front Apron Drop</span>
                  <span style={{ color: '#fff' }}>12 — 350 mm Mitred</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Splashback Cove</span>
                  <span style={{ color: '#fff' }}>R10 Seamless Fusion</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Basin Integration</span>
                  <span style={{ color: '#fff' }}>Single · Double · Trough</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Fabrication Quote</span>
                  <span style={{ color: '#fff' }}>Instant Real-Time INR</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Submittal Export</span>
                  <span style={{ color: '#fff' }}>Dimensioned CAD PNG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section id="products-grid" style={{ margin: '80px 0 100px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Comprehensive Product Range</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Architectural fixtures,
              <br />
              <i>manufactured to precision.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '460px', margin: 0, lineHeight: 1.6 }}>
            Select a product category to explore technical shop drawings, edge detailing, hygiene certifications, and CAD/BIM download options.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div
          className="products-catalog-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '24px',
            width: '100%',
          }}
        >
          {/* 1. Special Corian Material Card */}
          <Link
            href="/materials"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              background: '#dcd7cd',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <div style={{ position: 'relative', height: '240px', width: '100%', background: '#c8cbbe' }}>
              <Image
                src="/assets/material-macro.png"
                alt="Corian solid surface mineral slabs and colour palette"
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                quality={75}
                loading="lazy"
                decoding="async"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'rgba(30, 33, 29, 0.88)',
                  color: '#fff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  padding: '4px 10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Raw Substrates &amp; Slabs
              </div>
            </div>
            <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                SUBSTRATES · 3660 × 760 MM
              </span>
              <h3 style={{ fontSize: '22px', margin: '0 0 12px', fontWeight: 500, color: 'var(--ink)' }}>
                CORIAN&reg; MATERIAL
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', margin: '0 0 20px', flex: 1 }}>
                Authorized DuPont&trade; Corian&reg; solid surface slabs, through-body ATH mineral composition, and 20+ architectural colour swatches across 6 tone families.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '16px',
                }}
              >
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  View Slabs &amp; Swatches
                </span>
                <span style={{ fontSize: '14px' }}>↗</span>
              </div>
            </div>
          </Link>

          {/* Render Fabricated Products */}
          {mainProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div style={{ position: 'relative', height: '240px', width: '100%', background: '#c8cbbe' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  quality={75}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(30, 33, 29, 0.88)',
                    color: '#fff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {product.code}
                </div>
              </div>
              <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  {product.categoryName}
                </span>
                <h3 style={{ fontSize: '22px', margin: '0 0 12px', fontWeight: 500, color: 'var(--ink)' }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', margin: '0 0 20px', flex: 1 }}>
                  {product.tagline}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--line)',
                    paddingTop: '16px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Technical Specs &amp; Drawings
                  </span>
                  <span style={{ fontSize: '14px' }}>↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Design Certainty Service Spotlight Banner */}
      {designCertainty && (
        <section
          className="products-design-certainty-banner"
          style={{
            margin: '0 0 100px',
            background: 'var(--ink)',
            color: '#fff',
            border: '1px solid var(--line)',
            padding: '60px clamp(20px, 4vw, 64px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '36px',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: '#8c968c', marginBottom: '16px' }}>
              Specialized Engineering Advisory
            </p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)', color: '#fff', margin: '0 0 20px', lineHeight: 1.05 }}>
              Design Certainty
              <br />
              <i>Service.</i>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#c2cdc2', maxWidth: '520px', marginBottom: '32px' }}>
              Eliminate technical risks in complex solid surface detailing. We partner with architects from the schematic phase with submittal-ready CAD/BIM shop drawings, structural expansion calculations, digital on-site 3D laser templating, and full 10-year fabrication warranty sign-offs.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link className="button button-light" href="/products/design-certainty">
                Learn About Design Certainty <span>↗</span>
              </Link>
              <Link className="text-link" href="/contact" style={{ color: '#fff' }}>
                Book Engineering Consultation <span>↗</span>
              </Link>
            </div>
          </div>

          <div
            className="products-design-certainty-card"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: 'clamp(20px, 4vw, 36px)',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                color: '#8c968c',
                display: 'block',
                marginBottom: '20px',
              }}
            >
              Architectural Service Guarantees
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {designCertainty.keyFeatures.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#e0e5e0', lineHeight: 1.5, alignItems: 'flex-start' }}>
                  <span style={{ color: '#73c991', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600 }}>0{i + 1}</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Engineering Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Project Consultation &amp; CAD Submittals</p>
        <h2>
          Send us your
          <br />
          <i>project drawings.</i>
        </h2>
        <p>
          Upload your DWG, PDF, or 3D CAD models. Our senior fabrication team will review joinery details, advise on seamless joint placements, and provide guaranteed trade pricing within 48 hours.
        </p>
        <Link className="button button-dark" href="/contact">
          Submit Drawings for Quotation <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
