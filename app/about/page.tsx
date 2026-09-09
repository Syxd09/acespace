import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Ace Spaces | Parent Company & Raw Material Source',
  description: 'Learn about Ace Spaces as the parent company and primary raw material provider for architects, interior designers, and Coro Collective.',
};

export default function AboutPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">About Ace Spaces / Parent Company &amp; Material Source</p>
        <h1>
          The foundation of
          <br />
          <i>raw material.</i>
        </h1>
        <p>
          Ace Spaces is the parent company and primary raw material source supplying architects, interior designers, and our spatial brand Coro Collective with solid surfaces, mineral substrates, and precision fabrication.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          Where materials
          <br />
          originate for
          <br />
          <i>creators.</i>
        </h2>
        <div className="page-copy">
          <p>
            We operate as the dedicated sourcing hub for architects and interior designers seeking high-grade through-body minerals, solid surface slabs, and precision-cut fabrication blanks. Whether specifying a single signature kitchen island or outfitting an entire commercial tower, designers partner directly with our material source.
          </p>
          <p>
            Ace Spaces is also the parent entity behind Coro Collective — our sister spatial and interior design brand. While Coro conceives complete, finished interior environments, every surface, custom furniture piece, and sculptural volume is born from the raw materials developed and engineered here at Ace Spaces.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link className="button" href="/materials">
              Browse Raw Materials <span>↗</span>
            </Link>
            <a className="button" href="#coro" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              The Coro Connection <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="spec-table">
        <div className="spec-row">
          <span>Company Role</span>
          <div>Parent Entity &amp; Direct Architectural Raw Material Provider</div>
        </div>
        <div className="spec-row">
          <span>Who We Supply</span>
          <div>Architects / Interior Designers / Luxury Specifiers / Custom Fabricators</div>
        </div>
        <div className="spec-row">
          <span>Offerings</span>
          <div>Raw Solid Surface Slabs (12mm/19mm) / Custom Blanks / Workshop Fabrication</div>
        </div>
        <div className="spec-row">
          <span>Connected Ecosystem</span>
          <div>Ace Spaces (Parent &amp; Material Source) &rarr; Coro Collective (Interior &amp; Spatial Studio)</div>
        </div>
      </section>

      <section className="callout" id="coro">
        <p className="eyebrow">Parent &amp; Ecosystem Synergy</p>
        <h2>
          Powering
          <br />
          <i>Coro Collective.</i>
        </h2>
        <p>
          Coro Collective was born from Ace Spaces to showcase what is possible when our raw materials are shaped into complete spatial concepts, bespoke furniture, and interior architecture.
        </p>
        <p style={{ marginTop: '14px', color: '#6e766c', fontSize: '15px' }}>
          Independent architects and designers enjoy direct access to the very same raw materials that make Coro’s spaces celebrated.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '28px' }}>
          <Link className="button" href="/materials">
            Source Materials <span>↗</span>
          </Link>
          <Link className="button" href="/contact" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
            Start a Consultation <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
