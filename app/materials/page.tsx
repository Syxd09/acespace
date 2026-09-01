import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { materials } from '@/data/materials';

export const metadata: Metadata = {
  title: 'Materials — Ace Spaces',
  description: 'Explore Ace Spaces architectural material collections, finishes and applications.',
};

export default function MaterialsPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Material library / Collections</p>
        <h1>
          Surface with
          <br />
          <i>depth.</i>
        </h1>
        <p>Explore a considered palette of mineral, veined, textured and translucent surfaces for architectural spaces.</p>
      </section>

      <section className="page-grid" id="understanding">
        <h2>
          Material is
          <br />
          <i>possibility.</i>
        </h2>
        <div className="page-copy">
          <p>
            Each Ace Spaces collection is a starting point — a way to think about light, proportion, touch and the details that make a surface belong.
          </p>
          <p>
            Use our library to compare colour, finish and application before speaking to our team about samples and fabrication.
          </p>
        </div>
      </section>

      <section className="card-grid">
        {materials.map((mat) => (
          <Link key={mat.slug} className="info-card" href={`/materials/${mat.slug}`}>
            <h3>{mat.name.split('/')[0]}</h3>
            <p>{mat.collection} / {mat.colour}</p>
          </Link>
        ))}
        <Link className="info-card" href="/contact">
          <h3>Need guidance?</h3>
          <p>Start a material consultation ↗</p>
        </Link>
      </section>

      <section className="callout">
        <p className="eyebrow">Sample consultation</p>
        <h2>
          Find the
          <br />
          <i>right surface.</i>
        </h2>
        <p>Tell us about your project and we will help you shortlist materials, finishes and fabrication directions.</p>
        <Link className="button" href="/contact">
          Request samples <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
