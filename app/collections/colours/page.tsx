import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ColourLibrary from '@/components/ColourLibrary';

export const metadata: Metadata = {
  title: 'Colours & Mineral Palette Collection — Ace Spaces',
  description: 'Explore the complete Ace Spaces architectural solid surface colour library. Filter by hue family, pattern, translucency, and order studio sample boxes.',
};

export default function ColoursCollectionPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Collections / Architectural Palette</p>
        <h1>
          Colours &
          <br />
          <i>Minerals.</i>
        </h1>
        <p>
          Explore our complete collection of through-body architectural solid surfaces. Filter by color family, texture, and translucency, or curate your studio sample box.
        </p>
      </section>

      <section className="page-grid" style={{ padding: '60px 0 40px' }}>
        <h2>
          Precision tones.
          <br />
          <i>Seamless flow.</i>
        </h2>
        <div className="page-copy">
          <p>
            Unlike natural stone that varies uncontrollably from slab to slab, Ace Spaces solid mineral surfaces offer uniform color consistency, through-body pigmentation, and zero-porosity performance.
          </p>
          <p>
            Every tone is formulated to pair harmoniously with natural woods, brushed metals, lime plasters, and ambient architectural lighting.
          </p>
        </div>
      </section>

      {/* Comprehensive Colour Library Component */}
      <section style={{ marginBottom: '100px' }}>
        <ColourLibrary />
      </section>

      {/* Sample Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Sample box dispatch</p>
        <h2>
          Request a physical
          <br />
          <i>sample box.</i>
        </h2>
        <p>
          Select up to 6 colour specimens from our palette above and order a complimentary 100mm × 100mm specimen box delivered directly to your studio.
        </p>
        <Link className="button button-dark" href="/contact">
          Request Studio Specimen Box <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
