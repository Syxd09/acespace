'use client';

import React from 'react';
import Link from 'next/link';

interface Pathway {
  number: string;
  title: string;
  description: string;
  typology: string;
  secondaryLink?: {
    href: string;
    text: string;
    isExternal?: boolean;
  };
}

const PATHWAYS: Pathway[] = [
  {
    number: '01 / SAMPLES & SPEC',
    title: 'Specifier Samples & Palette Trays',
    description:
      'Request curated 100×100mm solid-surface specimens, high-contrast veining trays, and DuPont™ technical test certificates for client presentations.',
    typology: 'Material Specification & Samples',
    secondaryLink: {
      href: '/materials#sample-tray',
      text: 'Order Specimen Tray ↗',
    },
  },
  {
    number: '02 / CAD & CNC REVIEW',
    title: 'CAD, BIM & Engineering Review',
    description:
      'Submit .dwg, .step, or Revit shop drawings for thermal bend radii, invisible seam maps, substrate engineering, and 5-axis CNC machining.',
    typology: 'CAD / CNC Drawing Review',
  },
  {
    number: '03 / BESPOKE FORMS',
    title: 'Monoliths, Flutes & Translucency',
    description:
      'Seamless kitchen islands, sculptural corporate reception desks, thermoformed fluted walls, and illuminated backlit translucent panels.',
    typology: 'Residential Monolith / Island',
  },
  {
    number: '04 / STUDIO VISIT',
    title: 'Atelier Walkthrough & Slab Review',
    description:
      'Schedule an in-person session at our Bengaluru studio headquarters to inspect full-scale slab veining and tactile joinery mockups.',
    typology: 'Atelier Visit & Inspection',
    secondaryLink: {
      href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
      text: 'Google Maps Pin ↗',
      isExternal: true,
    },
  },
];

export default function ContactConsultationPathways() {
  const handleSelectTypology = (typology: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('select-typology', { detail: typology }));
    }
  };

  return (
    <div className="contact-pathways-grid">
      {PATHWAYS.map((p) => (
        <div key={p.number} className="contact-pathway-card">
          <div>
            <div className="pathway-number">{p.number}</div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => handleSelectTypology(p.typology)}
              title={`Select ${p.typology} in consultation form`}
            >
              Select in Brief <span>↓</span>
            </button>
            {p.secondaryLink && (
              p.secondaryLink.isExternal ? (
                <a
                  href={p.secondaryLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--muted)', fontSize: '11px' }}
                >
                  {p.secondaryLink.text}
                </a>
              ) : (
                <Link
                  href={p.secondaryLink.href}
                  prefetch={false}
                  style={{ color: 'var(--muted)', fontSize: '11px' }}
                >
                  {p.secondaryLink.text}
                </Link>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
