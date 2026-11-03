import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ScrollReveal from '@/components/ScrollReveal';
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
        url: '/images/images/app_residential_calacatta_greige_1.jpg',
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
    images: ['/images/images/app_residential_calacatta_greige_1.jpg'],
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

const productMicroSpecs: Record<string, { micro: string; spec: string }> = {
  benchtops: {
    micro: 'Seamless waterfall islands & worktops',
    spec: 'Zero visible seam',
  },
  'integrated-sinks': {
    micro: 'Coved undermount basins welded flush',
    spec: 'Coved non-porous joint',
  },
  washplanes: {
    micro: 'Multi-station linear drainage basins',
    spec: 'Commercial grade',
  },
  'basin-vanities': {
    micro: 'Thermoformed single & double vanities',
    spec: '160°C curved forming',
  },
  'exterior-cladding': {
    micro: 'Curved ventilated exterior panels',
    spec: 'UV & weather stable',
  },
  'healthcare-surfaces': {
    micro: 'Seamless clinical work stations',
    spec: 'NSF / ANSI 51 certified',
  },
  'end-of-trip': {
    micro: 'Integrated locker & shower partitions',
    spec: 'Moisture-impervious',
  },
  'bespoke-monoliths': {
    micro: 'Sculptural multi-axis centerpieces',
    spec: 'Custom 5-axis geometry',
  },
};

export default function ProductsCatalogPage() {
  const mainProducts = productsData.filter((p) => p.slug !== 'design-certainty');

  return (
    <main className="page-main">
      <JsonLd data={productsJsonLd} />

      {/* Split Architectural Hero — Minimal Editorial */}
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
              Fabrication &amp; Systems / Products
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
            Formed for
            <br />
            <i>purpose.</i>
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
            Seamless kitchen benchtops, integrated coved sinks, commercial washplanes, and bespoke vanities. Fabricated with 5-axis CNC precision in Bengaluru.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="#products-grid">
              Browse Range <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              CAD Consultation <span>↗</span>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Joints
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                100% Inconspicuous
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Grout
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                Silicone-Free
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Tolerance
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                ±0.18 mm CNC
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame — Clean & Uncluttered */}
        <ScrollReveal variant="image" className="hero-image-frame">
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
        </ScrollReveal>
      </section>

      {/* Products Grid Section */}
      <section id="products-grid" style={{ margin: '80px 0 100px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Comprehensive Product Range</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Architectural fixtures,
              <br />
              <i>manufactured to precision.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '460px', margin: 0, lineHeight: 1.6 }}>
            Explore fabricated fixtures, edge details, and drawings for residential, commercial, and healthcare spaces.
          </p>
        </ScrollReveal>

        {/* Product Cards Grid — Frameless Architectural Monograph */}
        <div className="products-catalog-grid">
          {/* 1. Special Corian Material Card */}
          <ScrollReveal delay={0} style={{ height: '100%' }}>
            <Link
              href="/materials"
              className="product-monograph-item"
            >
              <div className="product-monograph-header">
                <span className="product-monograph-num">01</span>
                <span className="product-monograph-divider">—</span>
                <span className="product-monograph-category">SUBSTRATES</span>
                <div className="product-monograph-line" />
              </div>

              <div className="product-monograph-image-frame">
                <Image
                  src="/assets/material-macro.png"
                  alt="Corian solid surface mineral slabs and colour palette"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  quality={75}
                  loading="lazy"
                  decoding="async"
                  className="product-monograph-image"
                />
                <div className="product-monograph-spec">
                  <span>3660 × 760 mm · 20+ Swatches</span>
                </div>
              </div>

              <div className="product-monograph-body">
                <h3 className="product-monograph-title">Corian® Slabs</h3>

                <div className="product-monograph-footer">
                  <span className="product-monograph-action">
                    Explore Slabs <span>↗</span>
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Render All Fabricated Products */}
          {mainProducts.map((product, idx) => {
            const microData = productMicroSpecs[product.slug] || {
              micro: product.tagline.split('.')[0],
              spec: 'Custom Fabrication',
            };
            const numStr = String(idx + 2).padStart(2, '0');

            return (
              <ScrollReveal key={product.slug} delay={Math.min((idx + 1) * 40, 240)} style={{ height: '100%' }}>
                <Link
                  href={`/products/${product.slug}`}
                  className="product-monograph-item"
                >
                  <div className="product-monograph-header">
                    <span className="product-monograph-num">{numStr}</span>
                    <span className="product-monograph-divider">—</span>
                    <span className="product-monograph-category">{product.categoryName}</span>
                    <div className="product-monograph-line" />
                  </div>

                  <div className="product-monograph-image-frame">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      quality={75}
                      loading="lazy"
                      decoding="async"
                      className="product-monograph-image"
                    />
                    <div className="product-monograph-spec">
                      <span>{microData.spec}</span>
                    </div>
                  </div>

                  <div className="product-monograph-body">
                    <h3 className="product-monograph-title">{product.name}</h3>
                    <p className="product-monograph-desc">{microData.micro}</p>

                    <div className="product-monograph-footer">
                      <span className="product-monograph-action">
                        Explore <span>↗</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Engineering Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Project Consultation &amp; CAD Submittals</p>
        <h2>
          Send us your
          <br />
          <i>project drawings.</i>
        </h2>
        <p>
          Upload your drawings or 3D models. Our workshop team will review joinery details and provide trade pricing within 48 hours.
        </p>
        <Link className="button button-dark" href="/contact">
          Submit Drawings for Quotation <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
