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
    title: 'Material Samples & Colors',
    description:
      'Request 100×100mm solid surface samples and color swatches to review in natural light or present to clients.',
    typology: 'Material Specification & Samples',
    secondaryLink: {
      href: '/materials#library',
      text: 'Order Samples ↗',
    },
  },
  {
    number: '02 / CAD & CNC REVIEW',
    title: 'CAD Drawings & Quotation',
    description:
      'Send us your architectural drawings, sketches, or 3D files. We review dimensions, joinery, and provide pricing.',
    typology: 'CAD / CNC Drawing Review',
  },
  {
    number: '03 / BESPOKE FORMS',
    title: 'Custom Counters & Furniture',
    description:
      'Kitchen islands, seamless sinks, reception desks, curved wall panels, and backlit surfaces crafted to your specs.',
    typology: 'Residential Island / Counter',
  },
  {
    number: '04 / STUDIO VISIT',
    title: 'Visit Our Studio & Workshop',
    description:
      'Visit our Bengaluru experience centre to see full-size slabs, custom sinks, and fabricated pieces in person.',
    typology: 'Studio Visit & Inspection',
    secondaryLink: {
      href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
      text: 'View on Google Maps ↗',
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
