import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project Not Found — Ace Spaces' };
  return {
    title: `${project.title} — Case Study — Ace Spaces`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== project.slug);

  return (
    <main>
      <section className="detail-hero">
        <div>
          <p className="eyebrow light">
            Case Study / {project.subtitle} / {project.location} ({project.year})
          </p>
          <h1>
            {project.title}
          </h1>
        </div>
      </section>

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
        <section style={{ marginBottom: '100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
