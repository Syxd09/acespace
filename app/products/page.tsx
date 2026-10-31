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

export default function ProductsCatalogPage() {
  const mainProducts = productsData.filter((p) => p.slug !== 'design-certainty');

  return (
    <main className="page-main">
      <JsonLd data={productsJsonLd} />

      {/* Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: '24px' }}>
            Fabrication &amp; Systems / Architectural Products
          </p>

          <h1 className="anim-fade-up anim-delay-1"
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

          <p className="anim-fade-up anim-delay-2"
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#4a5249',
              maxWidth: '540px',
              marginBottom: '20px',
            }}
          >
            Seamless kitchen benchtops, integrated sinks, commercial washplanes, and bespoke vanities. Fabricated in Bengaluru with 5-axis CNC accuracy and invisible chemical bonding.
          </p>

          <div
            style={{
              fontSize: '11px',
              fontFamily: 'Urbanist, sans-serif',
              letterSpacing: '0.08em', borderRadius: '3px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '28px',
            }}
          >
            Certified DuPont™ Corian® Fabrication, Bengaluru Workshop
          </div>

          <div className="anim-fade-up anim-delay-3" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/configurator">
              3D Configurator <span>↗</span>
            </Link>
            <Link className="button button-dark" href="#products-grid">
              Browse Range <span>↓</span>
            </Link>
            <Link className="text-link" href="/materials">
              Corian® Palette <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row anim-fade-up anim-delay-4">
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Joint Integrity
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                100% Inconspicuous
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Silicone Grout
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                Zero (Silicone-Free)
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Machining
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                5-Axis CNC &plusmn;0.2mm
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
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
          <div className="hero-image-badge">
            <div>
              <span
                style={{
                  fontSize: '9px',
                  fontFamily: 'Urbanist, sans-serif',
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
            <Link href="#products-grid" className="text-link" style={{ fontSize: '11px', fontFamily: 'Urbanist, sans-serif' }}>
              Explore Products <span>↓</span>
            </Link>
          </div>
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
          <ScrollReveal delay={0} style={{ height: '100%' }}>
          <Link
            href="/materials"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              background: '#f5f3ec', border: '1px solid var(--line)', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
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
                  fontFamily: 'Urbanist, sans-serif',
                  fontSize: '10px',
                  padding: '4px 10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em', borderRadius: '3px',
                }}
              >
                Raw Substrates &amp; Slabs
              </div>
            </div>
            <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                SUBSTRATES / 3660 × 760 MM
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
                <span style={{ fontSize: '11px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  View Slabs &amp; Swatches
                </span>
                <span style={{ fontSize: '14px' }}>↗</span>
              </div>
            </div>
          </Link>
          </ScrollReveal>

          {/* Render All Fabricated Products */}
          {mainProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#f5f3ec', border: '1px solid var(--line)', borderRadius: '6px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
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
                    fontFamily: 'Urbanist, sans-serif',
                    fontSize: '10px',
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em', borderRadius: '3px',
                  }}
                >
                  {product.code}
                </div>
              </div>
              <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'Urbanist, sans-serif',
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
                  <span style={{ fontSize: '11px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Technical Specs &amp; Drawings
                  </span>
                  <span style={{ fontSize: '14px' }}>↗</span>
                </div>
              </div>
            </Link>
          ))}
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
