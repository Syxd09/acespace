import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Project } from '@/data/projects';
import { getSiteContent } from '@/data/contentStore';
import { defaultProjectsList } from '@/data/contentTypes';

export const dynamic = 'force-dynamic';

function getLiveProjects(): Project[] {
  const content = getSiteContent();
  return content.projects && content.projects.length > 0 ? content.projects : defaultProjectsList;
}

export async function generateStaticParams() {
  const projects = getLiveProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const projects = getLiveProjects();
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project Not Found — Ace Spaces' };

  const canonicalUrl = `https://acespacesindia.vercel.app/projects/${project.slug}`;
  const materialName = project.materialUsed || 'DuPont Corian Solid Surface';
  const categoryName = project.category || 'Architectural';
  const pageTitle = `${project.title} (${project.location}, ${project.year}) — Architectural Case Study`;
  const pageDesc = `${project.description} Custom architectural fabrication using ${materialName} in ${project.location}.`;
  const imageUrl = project.image || 'https://acespacesindia.vercel.app/assets/hero-ace.png';

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      project.title,
      project.location,
      materialName,
      categoryName,
      `${project.title} architecture`,
      'solid surface case study India',
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
          alt: `${project.title} architectural case study`,
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

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = getLiveProjects();
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.description,
    image: project.image || 'https://acespacesindia.vercel.app/assets/hero-ace.png',
    dateCreated: project.year,
    locationCreated: {
      '@type': 'Place',
      name: project.location,
    },
    creator: {
      '@type': 'Organization',
      name: 'Ace Spaces Private Limited',
      url: 'https://acespacesindia.vercel.app',
    },
    genre: project.category,
    material: project.materialUsed || 'Solid Surface',
  };

  return (
    <main>
      {/* Schema.org CreativeWork Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <section className="detail-hero">
        <div>
          <div style={{ marginBottom: '18px' }}>
            <Link
              href="/projects"
              style={{
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              ← All Case Studies
            </Link>
          </div>
          <p className="eyebrow light">
            Case Study / {project.subtitle} / {project.location} ({project.year})
          </p>
          <h1 style={{ maxWidth: '840px' }}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* Hero Architectural Photography Frame */}
      {project.image && (
        <div
          style={{
            width: '100%',
            height: 'clamp(340px, 48vw, 680px)',
            position: 'relative',
            borderBottom: '1px solid var(--line)',
            background: '#1a1d19',
            overflow: 'hidden',
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '9vw',
              background: 'rgba(20, 23, 19, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e9e8e2',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {project.category.toUpperCase()} • {project.location} • {project.year}
          </div>
        </div>
      )}

      <div className="page-main">
        <section className="page-grid">
          <h2>
            The Design
            <br />
            <i>Intent.</i>
          </h2>
          <div className="page-copy">
            <p className="lead">{project.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px', borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Lead Architect / Studio</span>
                <strong style={{ fontSize: '14px' }}>{project.architect}</strong>
              </div>
              <div>
                <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Spatial Footprint</span>
                <strong style={{ fontSize: '14px' }}>{project.area}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge vs Solution */}
        <section className="challenge-solution-grid">
          <div style={{ background: '#dcd7cd', padding: '40px', border: '1px solid var(--line)' }}>
            <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
              The Architectural Challenge
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 16px' }}>Precision & Geometry</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#4a5249', margin: 0 }}>
              {project.challenge}
            </p>
          </div>

          <div style={{ background: 'var(--ink)', color: '#fff', padding: '40px' }}>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '12px' }}>
              The Fabrication Resolution
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 16px', color: '#fff' }}>Craft Execution</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              {project.solution}
            </p>
          </div>
        </section>

        {/* Technical Specification Table */}
        <section style={{ marginBottom: '100px' }}>
          <p className="eyebrow">Project Technical Parameters</p>
          <div className="spec-table">
            <div className="spec-row">
              <span>Specified Material</span>
              <strong>
                <Link href={`/materials/${project.materialSlug}`} style={{ textDecoration: 'underline' }}>
                  {project.materialUsed} ↗
                </Link>
              </strong>
            </div>
            <div className="spec-row">
              <span>Application Typology</span>
              <strong>{project.application}</strong>
            </div>
            <div className="spec-row">
              <span>Fabrication Method</span>
              <strong>{project.fabrication}</strong>
            </div>
            {project.specs?.map((spec) => (
              <div key={spec.label} className="spec-row">
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Related Projects */}
        <section style={{ marginBottom: '120px', borderTop: '1px solid var(--line)', paddingTop: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Explore Other Projects</p>
            <Link href="/projects" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              All Case Studies <span>↗</span>
            </Link>
          </div>
          <div className="card-grid" style={{ paddingBottom: '0' }}>
            {otherProjects.slice(0, 3).map((p) => (
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
                      {p.materialUsed}
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

        <section className="callout">
          <p className="eyebrow">Start your collaboration</p>
          <h2>
            Have a project
            <br />
            <i>in mind?</i>
          </h2>
          <p>Bring your floor plans, elevations, and material references to our design consultation team.</p>
          <Link className="button button-dark" href="/contact">
            Enquire About Your Project <span>↗</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
