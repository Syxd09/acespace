import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { materials as defaultMaterials } from '@/data/materials';
import { projects } from '@/data/projects';
import { getSiteContent } from '@/data/contentStore';
import SpecimenZoomViewer from '@/components/SpecimenZoomViewer';

export async function generateStaticParams() {
  const { materials } = getSiteContent();
  const source = materials && materials.length > 0 ? materials : defaultMaterials;
  return source.map((mat) => ({
    slug: mat.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { materials } = getSiteContent();
  const source = materials && materials.length > 0 ? materials : defaultMaterials;
  const material = source.find(
    (m) =>
      m.slug === params.slug ||
      m.slug === `css-${params.slug}-sheet` ||
      m.slug.replace(/^css-/, '').replace(/-sheet$/, '') === params.slug
  );
  if (!material) return { title: 'Material Not Found — Ace Spaces' };

  const canonicalUrl = `https://acespacesindia.vercel.app/materials/${material.slug}`;
  const imageUrl = material.image || material.textureImage || 'https://acespacesindia.vercel.app/assets/hero-ace.png';
  const pageTitle = `${material.name} (${material.code}) — Solid Surface Material Specimen`;
  const pageDesc = `${material.description} Available in ${material.thicknessOptions.join(', ')} thickness (${material.dimensions}). Calibrated zero-silica through-body solid surface in Bengaluru, India.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      material.name,
      material.code,
      material.collection,
      `${material.name} Corian India`,
      'solid surface material',
      'zero silica slab Bangalore',
      material.finish,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      siteName: 'Ace Spaces',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${material.name} architectural solid surface specimen`,
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

export default function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const { materials } = getSiteContent();
  const source = materials && materials.length > 0 ? materials : defaultMaterials;
  const material = source.find(
    (m) =>
      m.slug === params.slug ||
      m.slug === `css-${params.slug}-sheet` ||
      m.slug.replace(/^css-/, '').replace(/-sheet$/, '') === params.slug
  );
  if (!material) notFound();

  const relatedProjects = projects.filter((p) => p.materialSlug === material.slug);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: material.name,
    productID: material.code,
    sku: material.code,
    image: material.image || material.textureImage || 'https://acespacesindia.vercel.app/assets/hero-ace.png',
    description: material.description,
    brand: {
      '@type': 'Brand',
      name: 'DuPont™ Corian® / Ace Spaces',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Ace Spaces Private Limited',
      url: 'https://acespacesindia.vercel.app',
    },
    color: material.colour || material.colorFamily,
    material: 'Acrylic Solid Surface (ATH-PMMA Matrix, Zero Silica)',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'INR',
        valueAddedTaxIncluded: true,
      },
    },
  };

  return (
    <main>
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <section className="detail-hero">
        <div>
          <p className="eyebrow light">{material.collection} / Material Specification</p>
          <h1>
            {material.name.split('/')[0]}
            <br />
            <i>{material.name.split('/')[1]?.trim() || 'Surface'}</i>
          </h1>
        </div>
      </section>

      <div className="page-main">
        <section className="page-grid">
          <h2>
            Material
            <br />
            <i>character.</i>
          </h2>
          <div className="page-copy">
            <p className="lead">{material.description}</p>
            <p>
              Formulated for seamless continuity across architectural joinery, vertical wall claddings, and thermoformed organic forms.
            </p>
            <Link className="button button-dark" href="/contact" style={{ marginTop: '24px' }}>
              Request Sample of {material.name.split('/')[0]} <span>↗</span>
            </Link>
          </div>
        </section>

        {/* Interactive Specimen Inspection Bench */}
        <section style={{ marginBottom: '80px', borderTop: '1px solid var(--line)', paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p className="eyebrow" style={{ margin: '0 0 4px' }}>Macro Surface Inspection</p>
              <h3 style={{ fontSize: '24px', fontWeight: 400, margin: 0, letterSpacing: '-0.02em' }}>
                High-Resolution Specimen Surface
              </h3>
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Scroll wheel or click +/− to zoom · Drag to pan · Fullscreen ⛶
            </span>
          </div>
          <div
            style={{
              height: '460px',
              border: '1px solid var(--line)',
              background: material.hexColor || '#dcd7cd',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              position: 'relative',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <SpecimenZoomViewer
              textureImage={material.textureImage}
              applicationImage={material.inSituImage || material.image}
              applicationImages={material.inSituImages}
              materialName={material.name}
              materialFinish={material.finish}
              materialColour={material.colour}
              fallbackBg={material.hexColor}
              textureCss={material.textureCss}
              minHeight="100%"
            />
          </div>
        </section>

        {/* Technical Specification Table */}
        <section style={{ marginBottom: '100px' }}>
          <p className="eyebrow">Technical Performance & Sheet Attributes</p>
          <div className="spec-table">
            <div className="spec-row">
              <span>Collection & Series</span>
              <strong>{material.collection}</strong>
            </div>
            <div className="spec-row">
              <span>Primary Finish</span>
              <strong>{material.finish}</strong>
            </div>
            <div className="spec-row">
              <span>Colour & Tonal Field</span>
              <strong>{material.colour}</strong>
            </div>
            <div className="spec-row">
              <span>Sheet Dimensions</span>
              <strong>{material.dimensions}</strong>
            </div>
            <div className="spec-row">
              <span>Available Thicknesses</span>
              <strong>{material.thicknessOptions.join(' • ')}</strong>
            </div>
            <div className="spec-row">
              <span>Light Transmission</span>
              <strong>{material.lightTransmission}</strong>
            </div>
            <div className="spec-row">
              <span>Fire Rating</span>
              <strong>{material.fireRating}</strong>
            </div>
            <div className="spec-row">
              <span>Care & Maintenance</span>
              <strong>{material.careGuide}</strong>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section style={{ marginBottom: '100px' }}>
          <p className="eyebrow">Architectural Applications</p>
          <div className="card-grid" style={{ paddingBottom: '0' }}>
            {material.applications.map((app) => (
              <div key={app} className="info-card" style={{ minHeight: '180px' }}>
                <span className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '8px' }}>Application</span>
                <h3>{app}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section style={{ marginBottom: '120px', borderTop: '1px solid var(--line)', paddingTop: '80px' }}>
            <p className="eyebrow">Project Reference</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', marginBottom: '40px' }}>
              In practice.
            </h2>
            <div className="card-grid" style={{ paddingBottom: '0' }}>
              {relatedProjects.map((p) => (
                <Link key={p.slug} className="project-preview-card" href={`/projects/${p.slug}`}>
                  {/* Project Photograph */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '240px',
                      overflow: 'hidden',
                      background: '#191c18',
                    }}
                  >
                    <Image
                      src={p.image || '/assets/hero-ace.png'}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{
                        objectFit: 'cover',
                      }}
                      className="preview-img"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(25, 28, 24, 0.7)',
                        backdropFilter: 'blur(6px)',
                        color: '#ede8db',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                      }}
                    >
                      {p.category}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div style={{ padding: '24px 22px 28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '8px', display: 'block', fontSize: '10px' }}>
                        {p.subtitle} / {p.location}
                      </span>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 400, margin: '0 0 10px', lineHeight: 1.15, color: 'var(--ink)' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', margin: 0 }}>
                        {p.application}
                      </p>
                    </div>
                    <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid rgba(30, 33, 29, 0.1)' }}>
                      <span className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                        View Case Study <span>↗</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="callout">
          <p className="eyebrow">Project consultation</p>
          <h2>
            Specify
            <br />
            <i>{material.name}.</i>
          </h2>
          <p>Bring drawings, CAD layouts, or 3D concepts to our fabrication team for sample prototyping and detailing.</p>
          <Link className="button button-dark" href="/contact">
            Start a project <span>↗</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
