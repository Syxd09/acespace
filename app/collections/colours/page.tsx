import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ColourLibrary from '@/components/ColourLibrary';

export const metadata: Metadata = {
  title: 'Colours & Mineral Palette Collection — Ace Spaces',
  description: 'Explore the complete Ace Spaces architectural solid surface colour library. Filter by hue family, pattern, translucency, and order studio sample boxes.',
};

export default function ColoursCollectionPage() {
  return (
    <main className="page-main">
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Collections / Colours & Mineral Palette</p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Colours &
            <br />
            <i>Minerals.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            Explore our complete collection of through-body architectural solid surfaces. Filter by color family, texture, and translucency, or curate your complimentary studio sample box.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#library">
              Explore Swatches <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Order Specimen Box <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Total Palette
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>20+ Colours</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Hues
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>06 Families</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Dispatch
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>48h Courier</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/material-macro.png"
            alt="Mineral color swatches and textural architectural solid surfaces"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Studio Specimen Service
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Complimentary 100mm × 100mm Sample Boxes
              </strong>
            </div>
            <Link href="#library" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Select Samples <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Colour Library Component */}
      <section id="library" style={{ margin: '80px 0 100px' }}>
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

