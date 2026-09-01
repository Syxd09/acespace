import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fabrication — Ace Spaces',
  description: 'Precision CNC routing, thermoforming, seamless joining and finishing for architectural solid surfaces.',
};

export default function FabricationPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Fabrication / Material made form</p>
        <h1>
          From sheet
          <br />
          to <i>space.</i>
        </h1>
        <p>We bring precision and craft together to turn surfaces into architectural elements with presence.</p>
      </section>

      <section className="page-grid">
        <h2>
          Detail is
          <br />
          <i>the difference.</i>
        </h2>
        <div className="page-copy">
          <p>
            Our fabrication approach moves through a clear sequence: cut, join, form, finish, install. Every stage is part of the design conversation.
          </p>
          <p>
            Capabilities and specifications remain project-led and are confirmed with our team against the selected material and application.
          </p>
        </div>
      </section>

      <section className="card-grid">
        <a className="info-card" href="#cnc">
          <h3>CNC & cutting</h3>
          <p>Accurate shaping for repeatable, resolved components.</p>
        </a>
        <a className="info-card" href="#joining">
          <h3>Seamless joining</h3>
          <p>Continuous visual language across planes and edges.</p>
        </a>
        <a className="info-card" href="#forming">
          <h3>Form & curve</h3>
          <p>Fabricated gestures that move beyond the flat plane.</p>
        </a>
        <a className="info-card" href="#finish">
          <h3>Finishing</h3>
          <p>Honed, satin and tactile final surfaces.</p>
        </a>
        <a className="info-card" href="#installation">
          <h3>Installation</h3>
          <p>Careful coordination from workshop to site.</p>
        </a>
        <Link className="info-card" href="/contact">
          <h3>Discuss a detail</h3>
          <p>Bring a drawing or reference to our team ↗</p>
        </Link>
      </section>

      <section className="callout">
        <p className="eyebrow">Fabrication consultation</p>
        <h2>
          Make the
          <br />
          <i>unusual possible.</i>
        </h2>
        <Link className="button" href="/contact">
          Discuss fabrication <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
