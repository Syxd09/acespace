import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { productsData, getProductBySlug } from '@/data/products';
import ProductImageGallery from '@/components/ProductImageGallery';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
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
      title: 'Product Not Found | Ace Spaces',
    };
  }

  const pageTitle = `${product.name} — Architectural Solid Surface Specification`;
  const pageDesc = product.heroDescription;
  const imageUrl = product.image ? `https://acespacesindia.vercel.app${product.image}` : 'https://acespacesindia.vercel.app/assets/hero-ace.png';

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `https://acespacesindia.vercel.app/products/${product.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `https://acespacesindia.vercel.app/products/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} architectural solid surface system`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [imageUrl],
    },
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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    productID: product.code,
    sku: product.code,
    image: product.image || 'https://acespacesindia.vercel.app/assets/hero-ace.png',
    description: product.heroDescription,
    category: product.categoryName,
    brand: {
      '@type': 'Brand',
      name: 'Ace Spaces',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Ace Spaces Private Limited',
      url: 'https://acespacesindia.vercel.app',
    },
    material: 'DuPont™ Corian® Solid Surface (Zero Silica)',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="page-main">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Link href="/products" style={{ textDecoration: 'none', color: '#697067' }}>
              Products
            </Link>
            <span style={{ color: 'var(--muted, #788078)', opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--ink)' }}>{product.categoryName}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 84px)',
              lineHeight: 1.02,
              margin: '0 0 20px',
              letterSpacing: '-0.04em',
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '28px',
            }}
          >
            {product.heroDescription}
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            {slug === 'sinks' && (
              <Link className="button button-dark" href="/configurator?preset=single-basin-vanity">
                Configure in 3D <span>↗</span>
              </Link>
            )}

            {slug === 'basins-vanities' && (
              <Link className="button button-dark" href="/basin-configurator">
                Configure Basin in 3D <span>↗</span>
              </Link>
            )}

            <Link className="button" href="/contact" style={{ border: '1px solid var(--ink)', background: 'transparent' }}>
              Request CAD &amp; Quote <span>↗</span>
            </Link>
            <Link className="text-link" href="/materials">
              Corian® Palette <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Code
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                {product.code}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                CAD / BIM
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                {product.cadAvailable ? 'Available (.DWG / .RVT)' : 'On Request'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
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
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Fabrication Detail
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                {product.tagline}
              </strong>
            </div>
            <Link href="#gallery" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              View Gallery <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Architectural Gallery (Elevated!) */}
      {((product.galleryImages && product.galleryImages.length > 0) || product.image) && (
        <section id="gallery" style={{ margin: '60px 0 80px' }}>
          <div className="section-head" style={{ marginBottom: '28px' }}>
            <div>
              <p className="eyebrow">Applied Photography</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                Applied in
                <br />
                <i>built space.</i>
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#555e54', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
              Installation photography showing joinery, coved transitions, and material detailing in residential and commercial spaces.
            </p>
          </div>

          <ProductImageGallery
            productName={product.name}
            productCode={product.code}
            categoryName={product.categoryName}
            tagline={product.tagline}
            specifications={product.specifications}
            compatibleMaterials={product.compatibleMaterials}
            galleryImages={product.galleryImages || []}
            heroImage={product.image}
          />
        </section>
      )}

      {/* Engineering Overview & Key Features */}
      <section style={{ margin: '60px 0 80px', borderTop: '1px solid var(--line)', paddingTop: '60px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          <div>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>Engineering Overview</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', margin: '0 0 16px', lineHeight: 1.15, fontWeight: 400 }}>
              Form meets
              <br />
              <i>tactile resilience.</i>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#4a5249', marginBottom: '24px' }}>
              {product.overview}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    background: '#faf9f6',
                    border: '1px solid var(--line)',
                    padding: '5px 10px',
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
              background: '#faf9f6',
              border: '1px solid var(--line)',
              padding: '30px',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Key Details
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {product.keyFeatures.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '13.5px', color: '#2a3028', lineHeight: 1.55 }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', fontSize: '11px', flexShrink: 0 }}>0{i + 1}</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Specifications Table */}
      <section id="specifications" style={{ marginBottom: '80px', borderTop: '1px solid var(--line)', paddingTop: '60px' }}>
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">Technical Parameters</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Standard specifications &amp;
              <br />
              <i>tolerances.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
            Every fixture is fabricated in our Bengaluru workshop and assembled with color-matched methacrylate bonding.
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
            <span>Primary Applications</span>
            <strong>{product.applications.join(', ')}</strong>
          </div>
          <div className="spec-row">
            <span>Recommended Palette</span>
            <strong>{product.compatibleMaterials.join(', ')}</strong>
          </div>
        </div>
      </section>

      {/* Next / Previous Product Navigation */}
      <section
        style={{
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          padding: '32px 0',
          marginBottom: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Link
          href={`/products/${prevProduct.slug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '4px' }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
            ← Previous Fixture
          </span>
          <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>{prevProduct.name}</strong>
        </Link>

        <Link
          href="/products"
          className="button button-dark"
          style={{ fontSize: '11px', padding: '9px 18px' }}
        >
          All Fixtures Catalog
        </Link>

        <Link
          href={`/products/${nextProduct.slug}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Next Fixture →
          </span>
          <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>{nextProduct.name}</strong>
        </Link>
      </section>

      {/* Project Consultation Callout */}
      <section className="callout" style={{ margin: '0 0 80px' }}>
        <p className="eyebrow">Custom Fabrication Inquiry</p>
        <h2>
          Specify {product.name}
          <br />
          <i>for your project.</i>
        </h2>
        <p>
          Send your drawings or dimensions. Our workshop team reviews joinery details and provides an itemized trade quote within 48 hours.
        </p>
        <Link className="button button-dark" href="/contact">
          Inquire About {product.name} <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
