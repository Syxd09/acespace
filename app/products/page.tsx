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
    'Explore Ace Spaces precision-fabricated solid surface architectural systems: seamless benchtops, integrated sinks, commercial washplanes, floating vanities, EOT grooming stations, healthcare clinical bays, and bespoke 3D thermoformed works.',
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

const productMicroSpecs: Record<string, { micro: string; spec: string; metricLabel: string; metricVal: string }> = {
  benchtops: {
    micro: 'Seamless kitchen islands and worktops with continuous waterfall drops.',
    spec: 'Zero visible seam · Mitred apron',
    metricLabel: 'JOINERY',
    metricVal: 'Seamless Mitre',
  },
  sinks: {
    micro: 'Coved undermount basins welded directly into solid surface counters.',
    spec: 'Coved joint · Seamless flush',
    metricLabel: 'HYGIENE',
    metricVal: 'Zero Dirt Traps',
  },
  washplanes: {
    micro: 'Sloped commercial washplanes with continuous linear drainage channels.',
    spec: 'Multi-station · Hidden drainage',
    metricLabel: 'APPLICATION',
    metricVal: 'Commercial Grade',
  },
  'basins-vanities': {
    micro: 'Seamless bathroom vanities with sculpted washbowls and coved backsplashes.',
    spec: '160°C thermoformed curves',
    metricLabel: 'FORMING',
    metricVal: 'Seamless Curve',
  },
  'public-bathrooms-eot': {
    micro: 'Heavy-duty washstations, locker benches, and privacy partitions for commercial amenities.',
    spec: 'Anti-microbial · Non-porous',
    metricLabel: 'DURABILITY',
    metricVal: 'High Traffic',
  },
  'health-aged-care': {
    micro: 'Hygienic scrub sinks and clinical counters with zero microbial dirt traps.',
    spec: 'NSF / ANSI 51 · Zero silica',
    metricLabel: 'STANDARD',
    metricVal: 'Clinical Grade',
  },
  bespoke: {
    micro: 'Custom curved reception desks, fluted feature walls, and backlit monolithic fixtures.',
    spec: '5-axis CNC · 3D curved form',
    metricLabel: 'PRECISION',
    metricVal: 'Custom 3D CAD',
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
              Products &amp; Fixtures
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
            Custom solid surface
            <br />
            <i>products.</i>
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
            Seamless kitchen countertops, integrated sinks, commercial washplanes, and custom bathroom vanities. Fabricated with precision in Bengaluru.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="#products-grid">
              Browse Products <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Request a Quote <span>↗</span>
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

        {/* Product Cards Grid — Matching Fabrication Sequence Monograph Rail */}
        <div className="sequence-monograph-rail">
          {/* Card 01: Corian® Solid Surfaces (Materials) */}
          <Link
            href="/materials"
            className="sequence-step-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="sequence-step-header">
              <span className="sequence-step-num">01</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">MATERIALS</span>
              <div className="sequence-step-line" />
            </div>

            <div className="sequence-image-frame">
              <Image
                src="/assets/material-macro.png"
                alt="Corian solid surface mineral slabs and colour palette"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                quality={75}
                loading="lazy"
                decoding="async"
                className="sequence-image"
              />
              <div className="sequence-image-spec">
                <span>12mm &amp; 19mm · 40+ Colors</span>
              </div>
            </div>

            <div className="sequence-step-body">
              <h3 className="sequence-step-title">Corian® Solid Surfaces</h3>
              <p className="sequence-step-desc">
                Genuine DuPont™ Corian® sheets in 40+ colors for residential and commercial spaces.
              </p>

              <div className="sequence-step-footer">
                <span className="sequence-footer-label">COLLECTION</span>
                <span className="sequence-footer-val">40+ Finishes</span>
              </div>
            </div>
          </Link>

          {/* Render All 7 Fabricated Products */}
          {mainProducts.map((product, idx) => {
            const microData = productMicroSpecs[product.slug] || {
              micro: product.tagline,
              spec: 'Custom Fabrication',
              metricLabel: 'SPECIFICATION',
              metricVal: product.code,
            };
            const numStr = String(idx + 2).padStart(2, '0');

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="sequence-step-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="sequence-step-header">
                  <span className="sequence-step-num">{numStr}</span>
                  <span className="sequence-step-divider">—</span>
                  <span className="sequence-step-phase">{product.categoryName}</span>
                  <div className="sequence-step-line" />
                </div>

                <div className="sequence-image-frame">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    quality={75}
                    loading="lazy"
                    decoding="async"
                    className="sequence-image"
                  />
                  <div className="sequence-image-spec">
                    <span>{microData.spec}</span>
                  </div>
                </div>

                <div className="sequence-step-body">
                  <h3 className="sequence-step-title">{product.name}</h3>
                  <p className="sequence-step-desc">{microData.micro}</p>

                  <div className="sequence-step-footer">
                    <span className="sequence-footer-label">{microData.metricLabel}</span>
                    <span className="sequence-footer-val">{microData.metricVal}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Engineering Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Request a Custom Quotation</p>
        <h2>
          Send us your
          <br />
          <i>drawings or sketches.</i>
        </h2>
        <p>
          Upload your drawings, sketches, or dimensions. Our team will review your requirements and provide pricing within 24 to 48 hours.
        </p>
        <Link className="button button-dark" href="/contact">
          Request a Quote <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
