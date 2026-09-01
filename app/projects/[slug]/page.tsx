import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project Not Found — Ace Spaces' };
  return {
    title: `${project.title} — Ace Spaces`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const [titleMain, titleSub] = project.title.split(' of ');

  return (
    <main>
      <section className="detail-hero">
        <div>
          <p className="eyebrow" style={{ color: '#d5ddd4' }}>
            {project.subtitle} / {project.location}
          </p>
          <h1>
            {titleMain}
            {titleSub ? (
              <>
                <br />
                of <i>{titleSub}.</i>
              </>
            ) : (
              ''
            )}
          </h1>
        </div>
      </section>

      <div className="page-main">
        <section className="page-grid">
          <h2>
            One continuous
            <br />
            <i>gesture.</i>
          </h2>
          <div className="page-copy">
            <p>{project.description}</p>
          </div>
        </section>

        <section className="spec-table">
          <div className="spec-row">
            <span>Material</span>
            <Link href={`/materials/${project.materialSlug}`}>{project.materialUsed} ↗</Link>
          </div>
          <div className="spec-row">
            <span>Application</span>
            <div>{project.application}</div>
          </div>
          <div className="spec-row">
            <span>Fabrication</span>
            <div>{project.fabrication}</div>
          </div>
          <div className="spec-row">
            <span>Sector</span>
            <div>{project.subtitle} / {project.location}</div>
          </div>
        </section>

        <section className="callout">
          <p className="eyebrow">Your next project</p>
          <h2>
            Start with
            <br />
            <i>material.</i>
          </h2>
          <Link className="button" href="/contact">
            Talk to our team <span>↗</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
