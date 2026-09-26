import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import EdgeProfileCatalog from '@/components/EdgeProfileCatalog';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Digital Fabrication & Architectural Engineering — 5-Axis CNC & Thermoforming',
  description:
    'Advanced digital fabrication atelier in Bengaluru, India: automated 5-axis CNC routing (<0.2mm tolerance), vacuum membrane thermoforming (25mm tight radii), inconspicuous molecular seaming, and hand-honed finishing.',
  keywords: [
    'solid surface fabrication Bengaluru',
    '5-axis CNC routing India',
    'Corian thermoforming workshop',
    'seamless mitred waterfall counter',
    'architectural solid surface joinery',
    'CAD shop drawings solid surface',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/fabrication',
  },
  openGraph: {
    title: 'Digital Fabrication Craft & Machinery | Ace Spaces',
    description:
      'Precision 5-axis CNC routing, industrial vacuum thermoforming, and invisible molecular seam welding in Bengaluru.',
    url: 'https://acespacesindia.vercel.app/fabrication',
    images: [
      {
        url: '/images/images/app_residential_calacatta_greige_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces 5-Axis CNC & Fabrication Facility',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabrication Craft & Machinery | Ace Spaces',
    description:
      'Precision CNC routing, thermoforming, and monolithic joint chemistry for solid surfaces in India.',
    images: ['/images/images/app_residential_calacatta_greige_2.jpg'],
  },
};

const fabricationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Architectural Solid Surface Digital Fabrication',
      provider: {
        '@type': 'Organization',
        name: 'Ace Spaces',
        url: 'https://acespacesindia.vercel.app',
      },
      serviceType: 'Digital Architectural Fabrication & Engineering',
      areaServed: 'India',
      description:
        'Turnkey 5-axis CNC routing, vacuum thermoforming, invisible molecular welding, and certified installation across India.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Fabrication Capabilities',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '5-Axis CNC Precision Routing (<0.2mm)' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Industrial Vacuum Membrane Thermoforming (down to 25mm radius)' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Inconspicuous Molecular Seam Welding' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CAD/BIM Shop Drawings & Laser Scanning' } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What tolerances does Ace Spaces 5-axis CNC achieve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our automated 5-axis industrial CNC routers operate with sub-millimeter positional repeatability under 0.2mm, accommodating complex nested CAD cutouts, drainage channels, flush cooktop rebates, and sub-surface Qi charging pockets.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can solid surfaces be curved and thermoformed without whitening?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Heated to 160°C in calibrated platen ovens, Ace Spaces homogeneous mineral-acrylic sheets become fully pliable and are vacuum-formed over CNC timber bucks down to a 25mm internal radius without color blanching or micro-fissuring.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are solid surface seams completely invisible and water-tight?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Using two-component color-matched methacrylate structural adhesives, adjacent sheets are molecularly welded together. Once cured and hand-honed to a 600-grit matte finish, the joint is chemically fused, 100% water-impervious, and invisible to touch and sight.',
          },
        },
      ],
    },
  ],
};

export default function FabricationPage() {
  const steps = [
    {
      id: 'cnc',
      num: '01',
      title: '5-Axis CNC & Precision Cutting',
      description: 'Our Bengaluru facility utilizes automated 5-axis CNC routing systems capable of achieving cutting tolerances under 0.2mm. Complex CAD geometries, sink cutouts, and sub-surface charging pockets are nested and milled with robotic repeatability.',
      specs: '0.2mm tolerance • Nested CAD/CAM • Integrated undercut sink routings'
    },
    {
      id: 'seamless',
      num: '02',
      title: 'Seamless Inconspicuous Joining',
      description: 'By pairing solid surface components with chemically active, color-matched acrylic adhesives, adjacent sheets are thermo-welded together. Once cured, the joint becomes completely homogeneous and invisible to touch and sight.',
      specs: 'Color-matched resin matrix • Zero dirt traps • Monolithic appearance'
    },
    {
      id: 'thermoforming',
      num: '03',
      title: 'Thermoforming & Organic Curvature',
      description: 'Heated to 160°C within calibrated industrial platen ovens, mineral sheets transition into a pliable state. They are formed over CNC-milled timber bucks using vacuum press technology to achieve compound curves and fluid radii.',
      specs: 'Vacuum membrane forming • 2D & 3D multi-radius • Zero surface blanching'
    },
    {
      id: 'honing',
      num: '04',
      title: 'Hand Honing & Surface Finishing',
      description: 'Every fabricated piece undergoes a 5-stage progressive dry and wet hand-honing sequence, graduating from 120-grit up to 600-grit micro-abrasives. This creates an ultra-tactile matte or satin finish with flawless light absorption.',
      specs: '120 to 600-grit hand finish • Anti-glare chalk touch • Renewable surface'
    }
  ];

  return (
    <main className="page-main">
      <JsonLd data={fabricationJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Fabrication / Advanced Workshop & Craft</p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            From sheet
            <br />
            to <i>space.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            We unite advanced digital fabrication with master joinery craft to turn raw mineral sheets into monumental, monolithic interior elements.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Discuss Fabrication Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#process">
              4-Stage Sequence <span>↓</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Tolerance
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>&lt; 0.2 mm</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Forming
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>3D Thermoform</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Finishing
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>600-Grit Honed</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/material-macro.png"
            alt="Hand honing and CNC carving of monolithic mineral surface"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Craft Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Hand-Honed Satin Edge • Sub-millimeter Tolerance
              </strong>
            </div>
            <Link href="#edges" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Edge Profiles <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Craft Sequence */}
      <section id="process" style={{ margin: '80px 0 100px' }}>
        <p className="eyebrow" style={{ marginBottom: '30px' }}>The 4-Stage Workshop Sequence</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              id={step.id}
              style={{
                background: '#dcd7cd',
                padding: '35px 30px',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease',
              }}
            >
              <div>
                <span style={{ fontSize: '32px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '16px' }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 14px', lineHeight: 1.2 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '24px' }}>
                  {step.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '16px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                  Technical Parameters
                </span>
                <strong style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)' }}>
                  {step.specs}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Edge Profile Catalog */}
      <section id="edges" style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Architectural Detailing</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Edge Profile
              <br />
              <i>catalog.</i>
            </h2>
          </div>
          <p style={{ maxWidth: '380px', fontSize: '14px', color: '#5d665c', lineHeight: 1.6 }}>
            Select an edge detail below to explore how light, shadow, and tactile touch behave across different architectural profiles.
          </p>
        </div>

        <EdgeProfileCatalog />
      </section>

      {/* Workshop Specs Table */}
      <section style={{ marginBottom: '120px' }}>
        <p className="eyebrow">Workshop Specifications & Site Protocols</p>
        <div className="spec-table">
          <div className="spec-row">
            <span>Laser Digital Templating</span>
            <strong>On-site 3D laser digitizing ensuring sub-millimeter alignment with out-of-square walls and structural columns.</strong>
          </div>
          <div className="spec-row">
            <span>Workshop Pre-Assembly</span>
            <strong>All large architectural volumes are dry-fitted, clamped, and inspected in our workshop prior to site delivery.</strong>
          </div>
          <div className="spec-row">
            <span>On-Site Seamless Welding</span>
            <strong>Trained master fabricators execute final field joins, invisible polishing, and silicone-free perimeter integration.</strong>
          </div>
          <div className="spec-row">
            <span>Care & Refinishing Service</span>
            <strong>Full architectural maintenance, on-site scratch removal, and periodic honing services across major Indian metros.</strong>
          </div>
        </div>
      </section>

      <section className="callout">
        <p className="eyebrow">Technical fabrication consultation</p>
        <h2>
          Make the
          <br />
          <i>unusual possible.</i>
        </h2>
        <p>Send us your drawings or 3D models. Our engineering and fabrication team will review details, suggest joint locations, and provide prototypes.</p>
        <Link className="button button-dark" href="/contact">
          Discuss a Fabrication Brief <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

