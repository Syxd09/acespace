import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ProjectGallery from '@/components/ProjectGallery';

export const metadata: Metadata = {
  title: 'Selected Architectural Projects — Ace Spaces',
  description: 'Explore completed residential, hospitality, commercial, and retail case studies crafted with Ace Spaces mineral surfaces.',
};

export default function ProjectsPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Projects / Selected Architectural Case Studies</p>
        <h1>
          Material
          <br />
          in <i>practice.</i>
        </h1>
        <p>
          A curated selection of completed spaces where Ace Spaces through-body mineral surfaces define the architectural experience.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          Form, light
          <br />
          <i>& restraint.</i>
        </h2>
        <div className="page-copy">
          <p>
            From private residential sanctuaries in Bengaluru to ambient hospitality arrival desks in Mumbai, our work celebrates seamless volumetric unity and refined craftsmanship.
          </p>
          <p>
            Filter by typology below to inspect material specifications, fabrication techniques, and architectural case studies.
          </p>
        </div>
      </section>

      {/* Interactive Project Gallery */}
      <section style={{ marginBottom: '100px' }}>
        <ProjectGallery />
      </section>

      <section className="callout">
        <p className="eyebrow">Collaborate on your next project</p>
        <h2>
          Bring your
          <br />
          <i>drawings to life.</i>
        </h2>
        <p>We work directly with architects, interior designers, and general contractors from concept design through to final on-site installation.</p>
        <Link className="button button-dark" href="/contact">
          Submit Project Details <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
