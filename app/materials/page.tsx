import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { materials } from '@/data/materials';
import MaterialExplorer from '@/components/MaterialExplorer';

export const metadata: Metadata = {
  title: 'Materials & Surfaces — Ace Spaces',
  description: 'Explore the Ace Spaces collection of mineral, veined, textured, and translucent solid surfaces.',
};

export default function MaterialsPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Material Collection / Through-Body Minerals</p>
        <h1>
          Material as
          <br />
          <i>substance.</i>
        </h1>
        <p>
          Each surface in the Ace Spaces palette is developed to carry light with depth, maintain non-porous longevity, and enable seamless volumetric fabrication.
        </p>
      </section>

      <section className="page-grid">
        <h2>
          Curated for
          <br />
          <i>tactile clarity.</i>
        </h2>
        <div className="page-copy">
          <p>
            Our palette is deliberately concise. We focus on mineral tones and nuanced textures that age with grace, interact quietly with natural daylight, and reward human touch.
          </p>
          <p>
            All surfaces are solid through-body compositions, meaning colour, density, and performance remain identical from face to core.
          </p>
        </div>
      </section>

      {/* Interactive Material Filter & Explorer */}
      <section style={{ marginBottom: '100px' }}>
        <MaterialExplorer />
      </section>

      {/* Technical Specifications Table */}
      <section style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Technical Performance & Standards</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Engineered for
              <br />
              <i>architectural permanence.</i>
            </h2>
          </div>
        </div>

        <div className="spec-table">
          <div className="spec-row">
            <span>Material Composition</span>
            <strong>Two-thirds natural mineral bauxite (ATH) bonded with advanced high-performance acrylic polymer matrix.</strong>
          </div>
          <div className="spec-row">
            <span>Standard Sheet Dimensions</span>
            <strong>3660 mm (Length) × 760 mm (Width) × 12 mm (Nominal Thickness). Custom 19mm and 6mm available on order.</strong>
          </div>
          <div className="spec-row">
            <span>Porosity & Hygiene</span>
            <strong>100% Non-porous monolithic structure. Zero microbial harborage, NSF/ANSI 51 certified for food preparation.</strong>
          </div>
          <div className="spec-row">
            <span>Fire Performance</span>
            <strong>Class 1 / Class A Fire Rating (ASTM E84). Low flame spread and low smoke toxicity.</strong>
          </div>
          <div className="spec-row">
            <span>Renewability & Lifecycle</span>
            <strong>100% Homogeneous through-body. Scuffs and stains buff out on-site with standard non-abrasive pads.</strong>
          </div>
          <div className="spec-row">
            <span>Thermal Formability</span>
            <strong>Thermoformable at 155°C – 165°C to achieve internal and external 2D/3D organic radii without discolouration.</strong>
          </div>
        </div>
      </section>

      {/* Finish Guidance */}
      <section className="page-grid" style={{ paddingTop: '0', borderTop: '1px solid var(--line)' }}>
        <h2>
          Honed, Satin
          <br />
          <i>or Matte.</i>
        </h2>
        <div className="page-copy">
          <p>
            <strong>Honed Matte:</strong> Offers an ultra-low sheen with a velvety chalk touch. Perfect for bright residential kitchens and ambient hospitality spaces where specular glare should be minimized.
          </p>
          <p>
            <strong>Satin Smooth:</strong> Introduces subtle light diffusion across gentle curvature. Ideal for bathroom vanities, curved wall claddings, and commercial reception desks.
          </p>
          <p>
            <strong>Micro-Textured:</strong> An earth-inspired tactile feel that adds subtle physical grain, providing enhanced scratch tolerance for high-use public counters.
          </p>
        </div>
      </section>

      {/* Sample Consultation Callout */}
      <section className="callout">
        <p className="eyebrow">Sample consultation & Box Delivery</p>
        <h2>
          Order architectural
          <br />
          <i>specimen boxes.</i>
        </h2>
        <p>
          Experience our mineral depth in your studio under natural daylight. We provide complimentary 100mm × 100mm material samples to architects and interior designers across India.
        </p>
        <Link className="button button-dark" href="/contact">
          Request Material Samples <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
