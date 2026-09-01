import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects — Ace Spaces',
  description: 'Selected project archive and case studies featuring Ace Spaces materials and custom fabrication.',
};

export default function ProjectsPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Project archive / Selected work</p>
        <h1>
          Spaces with
          <br />
          <i>something to say.</i>
        </h1>
        <p>A growing archive of material-led environments.</p>
      </section>

      <section className="page-grid">
        <h2>
          Material in
          <br />
          <i>context.</i>
        </h2>
        <div className="page-copy">
          <p>
            Every project begins with a question of use, scale and atmosphere. We connect the finished space back to the material and fabrication decisions behind it.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {projects.map((proj) => (
          <Link key={proj.slug} className="info-card" id={proj.category} href={`/projects/${proj.slug}`}>
            <h3>{proj.title}</h3>
            <p>{proj.subtitle} / {proj.location} / {proj.materialUsed}</p>
          </Link>
        ))}
      </section>

      <section className="callout">
        <p className="eyebrow">Your project</p>
        <h2>
          Let’s make
          <br />
          something <i>specific.</i>
        </h2>
        <Link className="button" href="/contact">
          Start a project <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
