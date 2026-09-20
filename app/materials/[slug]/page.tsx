import React from 'react';
import Link from 'next/link';
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
  const material = source.find((m) => m.slug === params.slug);
  if (!material) return { title: 'Material Not Found — Ace Spaces' };
  return {
    title: `${material.name} — Material Specimen — Ace Spaces`,
    description: material.description,
  };
}

export default function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const { materials } = getSiteContent();
  const source = materials && materials.length > 0 ? materials : defaultMaterials;
  const material = source.find((m) => m.slug === params.slug);
  if (!material) notFound();

  const relatedProjects = projects.filter((p) => p.materialSlug === material.slug);

  return (
    <main>
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
              applicationImage={material.image}
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
                <Link key={p.slug} className="info-card" href={`/projects/${p.slug}`}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                    {p.subtitle} / {p.location}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.application}</p>
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
