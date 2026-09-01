import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applications — Ace Spaces',
  description: 'Explore how Ace Spaces architectural surfaces move through residential, hospitality, commercial and custom spaces.',
};

export default function ApplicationsPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Applications / Material in context</p>
        <h1>
          Made to
          <br />
          <i>belong.</i>
        </h1>
        <p>Explore how considered surfaces move through residential, hospitality, commercial and custom spaces.</p>
      </section>

      <section className="page-grid">
        <h2>
          One material.
          <br />
          <i>Many lives.</i>
        </h2>
        <div className="page-copy">
          <p>
            A surface can be quiet or expressive, intimate or monumental. Our role is to help it find the right scale and the right detail.
          </p>
        </div>
      </section>

      <section className="card-grid">
        <Link className="info-card" id="residential" href="/projects#residential">
          <h3>Residential</h3>
          <p>Kitchens, islands, vanities, furniture and feature surfaces.</p>
        </Link>
        <Link className="info-card" id="hospitality" href="/projects#hospitality">
          <h3>Hospitality</h3>
          <p>Reception, counters, bars, washrooms and guest areas.</p>
        </Link>
        <Link className="info-card" id="commercial" href="/projects#commercial">
          <h3>Commercial</h3>
          <p>Workplaces, experience centres and public interiors.</p>
        </Link>
        <Link className="info-card" id="retail" href="/projects#retail">
          <h3>Retail</h3>
          <p>Display systems, cash counters and branded installations.</p>
        </Link>
        <Link className="info-card" id="healthcare" href="/contact">
          <h3>Healthcare</h3>
          <p>Material consultation for considered, high-use environments.</p>
        </Link>
        <Link className="info-card" id="custom" href="/fabrication">
          <h3>Custom architecture</h3>
          <p>One-off elements shaped around a specific design intent.</p>
        </Link>
      </section>

      <section className="callout">
        <p className="eyebrow">Project support</p>
        <h2>
          Bring us
          <br />
          <i>the brief.</i>
        </h2>
        <Link className="button" href="/contact">
          Start a project <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
