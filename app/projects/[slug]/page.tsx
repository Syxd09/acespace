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
  return {
    title: `${project.title} — Case Study — Ace Spaces`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = getLiveProjects();
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  return (
    <main>
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
          <p className="eyebrow">Explore Other Projects</p>
          <div className="card-grid" style={{ paddingBottom: '0' }}>
            {otherProjects.slice(0, 3).map((p) => (
              <Link key={p.slug} className="info-card" href={`/projects/${p.slug}`}>
                <span className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                  {p.subtitle} / {p.location}
                </span>
                <h3>{p.title}</h3>
                <p>{p.materialUsed}</p>
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
