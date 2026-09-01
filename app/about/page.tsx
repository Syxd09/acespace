import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Ace Spaces',
  description: 'Learn about Ace Spaces architectural material practice, philosophy, and collaboration model.',
};

export default function AboutPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">About Ace Spaces / The practice</p>
        <h1>
          Material
          <br />
          with <i>intent.</i>
        </h1>
        <p>
          Ace Spaces is an architectural materials, fabrication and project-support practice.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          From first
          <br />
          sample to
          <br />
          <i>final edge.</i>
        </h2>
        <div className="page-copy">
          <p>
            We work alongside architects, designers and project teams to translate material ideas into resolved architectural elements.
          </p>
          <p>
            Our connected design ecosystem includes Coro Collective, a separate sister brand focused on interiors and spatial design.
          </p>
          <a className="button" href="#coro">
            Meet Coro Collective <span>↗</span>
          </a>
        </div>
      </section>

      <section className="spec-table">
        <div className="spec-row">
          <span>Focus</span>
          <div>Architectural materials / surface solutions / fabrication</div>
        </div>
        <div className="spec-row">
          <span>Collaboration</span>
          <div>Architects / designers / homeowners / project teams</div>
        </div>
        <div className="spec-row">
          <span>Ecosystem</span>
          <div>Ace Spaces + Coro Collective</div>
        </div>
      </section>

      <section className="callout" id="coro">
        <p className="eyebrow">The wider ecosystem</p>
        <h2>
          Coro
          <br />
          <i>Collective.</i>
        </h2>
        <p>Interior design, interior architecture and spatial design for complete environments.</p>
        <Link className="button" href="/contact">
          Explore Coro Collective <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
