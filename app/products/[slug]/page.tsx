import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productsData, getProductBySlug } from '@/data/products';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productsData.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found — Ace Spaces',
    };
  }

  return {
    title: `${product.name} — Architectural Solid Surface Products — Ace Spaces`,
    description: product.heroDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Find adjacent products for bottom navigation
  const currentIndex = productsData.findIndex((p) => p.slug === slug);
  const prevProduct = productsData[(currentIndex - 1 + productsData.length) % productsData.length];
  const nextProduct = productsData[(currentIndex + 1) % productsData.length];

  return (
    <main className="page-main">
      {/* Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Link href="/products" className="eyebrow" style={{ textDecoration: 'none' }}>
              Products
            </Link>
            <span style={{ color: 'var(--muted)', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>/</span>
            <span className="eyebrow" style={{ color: 'var(--ink)' }}>{product.categoryName}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 92px)',
              lineHeight: 0.98,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            {product.name.split(' ')[0]}
            <br />
            <i>{product.name.split(' ').slice(1).join(' ') || 'Solutions.'}</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#4a5249',
              maxWidth: '540px',
              marginBottom: '28px',
            }}
          >
            {product.heroDescription}
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Request CAD &amp; Pricing <span>&nearr;</span>
            </Link>
            <Link className="text-link" href="/materials">
              Order Material Samples <span>&nearr;</span>
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
                Category Code
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                {product.code}
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
                CAD / BIM
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                {product.cadAvailable ? 'Available (.DWG / .RVT)' : 'On Request'}
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
                Fabrication
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                Custom Made to Measure
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
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
                Fabrication Detail
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                {product.tagline}
              </strong>
            </div>
            <Link href="#specifications" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              View Specs <span>&darr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Engineering Overview & Key Architectural Features */}
      <section style={{ margin: '80px 0', borderBottom: '1px solid var(--line)', paddingBottom: '80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Engineering Overview</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', margin: '0 0 20px', lineHeight: 1.1 }}>
              Form meets
              <br />
              <i>tactile resilience.</i>
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#4a5249', marginBottom: '24px' }}>
              {product.overview}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    background: '#dcd7cd',
                    border: '1px solid var(--line)',
                    padding: '6px 12px',
                    color: 'var(--ink)',
                    textTransform: 'uppercase',
                  }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#dcd7cd',
              border: '1px solid var(--line)',
              padding: '36px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                display: 'block',
                marginBottom: '20px',
              }}
            >
              Key Engineering Features
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {product.keyFeatures.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '14px', fontSize: '14px', color: '#2a3028', lineHeight: 1.5 }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>0{i + 1}</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Specifications Table */}
      <section id="specifications" style={{ marginBottom: '100px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Technical Parameters</p>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)' }}>
              Standard specifications &amp;
              <br />
              <i>tolerances.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
            All fixtures are manufactured in our workshop using calibrated computer-controlled equipment and assembled with color-matched methacrylate bonding.
          </p>
        </div>

        <div className="spec-table">
          {product.specifications.map((spec, i) => (
            <div key={i} className="spec-row">
              <span>{spec.label}</span>
              <strong>{spec.value}</strong>
            </div>
          ))}
          <div className="spec-row">
            <span>Primary Sector Applications</span>
            <strong>{product.applications.join(' • ')}</strong>
          </div>
          <div className="spec-row">
            <span>Recommended Material Palettes</span>
            <strong>{product.compatibleMaterials.join(', ')}</strong>
          </div>
        </div>
      </section>

      {/* Architectural Gallery */}
      {product.galleryImages && product.galleryImages.length > 0 && (
        <section style={{ marginBottom: '100px' }}>
          <div className="section-head" style={{ marginBottom: '32px' }}>
            <div>
              <p className="eyebrow">Installation Gallery</p>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 54px)' }}>
                Applied in
                <br />
                <i>built space.</i>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {product.galleryImages.map((img, i) => (
              <div
                key={i}
                style={{
                  background: '#dcd7cd',
                  border: '1px solid var(--line)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '280px', width: '100%' }}>
                  <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px 20px', background: 'var(--paper)', flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4a5249', lineHeight: 1.5 }}>
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next / Previous Product Navigation */}
      <section
        style={{
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          padding: '40px 0',
          marginBottom: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <Link
          href={`/products/${prevProduct.slug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
            &larr; Previous Product
          </span>
          <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>{prevProduct.name}</strong>
        </Link>

        <Link
          href="/products"
          className="button button-dark"
          style={{ fontSize: '11px', padding: '10px 20px' }}
        >
          All Products Catalog
        </Link>

        <Link
          href={`/products/${nextProduct.slug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Next Product &rarr;
          </span>
          <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>{nextProduct.name}</strong>
        </Link>
      </section>

      {/* Project Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Specifier Technical Support</p>
        <h2>
          Specify {product.name}
          <br />
          <i>for your project.</i>
        </h2>
        <p>
          Need custom dimensions, integrated power pop-ups, or custom basin configurations? Our engineering team works directly with architects to prepare project-specific submittal packages.
        </p>
        <Link className="button button-dark" href="/contact">
          Inquire About {product.name} <span>&nearr;</span>
        </Link>
      </section>
    </main>
  );
}
