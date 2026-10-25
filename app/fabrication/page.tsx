import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import EdgeProfileCatalog from '@/components/EdgeProfileCatalog';
import FabricationExplorer from '@/components/FabricationExplorer';
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
      title: '5-Axis CNC Precision',
      quote: 'Robotic precision to under 0.2mm. Direct from CAD to cut.',
      badge: '< 0.2 mm Tolerance',
      tagline: 'Nested parametric milling with robotic repeatability.',
      image: '/images/images/app_residential_calacatta_greige_2.jpg',
      metric: '±0.18 mm',
      metricLabel: 'Positional Tolerance',
    },
    {
      id: 'seamless',
      num: '02',
      title: 'Molecular Seam Fusion',
      quote: 'Two mineral sheets. One continuous geological body.',
      badge: '0.0 mm Invisible Seam',
      tagline: 'Reactive color-matched chemistry that dissolves the joint.',
      image: '/images/images/app_residential_calacatta_greige_1.jpg',
      metric: '0.00 mm',
      metricLabel: 'Visible Joint Line',
    },
    {
      id: 'thermoforming',
      num: '03',
      title: '160°C Thermoforming',
      quote: 'Curvature beyond the grid. Shaped over bespoke timber bucks.',
      badge: '25 mm Tight Radii',
      tagline: 'Vacuum-formed compound 3D curves with zero surface blanching.',
      image: '/images/images/app_commercial_bleached_nuwood.jpg',
      metric: '160°C',
      metricLabel: 'Thermal Plasticity',
    },
    {
      id: 'honing',
      num: '04',
      title: 'Progressive Hand Honing',
      quote: 'A light-absorbing, velvety touch honed from 120 to 600-grit.',
      badge: '600-Grit Matte Touch',
      tagline: 'Anti-glare satin tactile finish, 100% renewable in situ.',
      image: '/assets/material-macro.png',
      metric: '600 Grit',
      metricLabel: 'Diamond Honed',
    },
  ];

  const protocols = [
    {
      num: '01',
      title: '3D Laser Digital Templating',
      quote: 'Zero margin of error on site.',
      detail: 'Sub-millimeter laser scans accommodate out-of-square walls and structural columns prior to cutting.',
      badge: '±0.5mm Scan',
    },
    {
      num: '02',
      title: 'Workshop Dry-Fit Inspection',
      quote: '100% pre-assembled in Bengaluru.',
      detail: 'Large architectural monoliths are fully dry-fitted, clamped, and laser-checked before dispatch.',
      badge: 'Pre-Assembled',
    },
    {
      num: '03',
      title: 'On-Site Molecular Welding',
      quote: 'Seamless on-site fusion.',
      detail: 'Certified master joiners fuse adjacent sections with zero silicone lines and zero visible joints.',
      badge: 'Hermetic Join',
    },
    {
      num: '04',
      title: 'Permanent In-Situ Renewal',
      quote: 'Restorable to day-one beauty.',
      detail: 'Full architectural maintenance, on-site blemish removal, and diamond re-honing across India.',
      badge: '100% Renewable',
    },
  ];

  return (
    <main className="page-main">
      <JsonLd data={fabricationJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Fabrication / Advanced Workshop &amp; Craft</p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 24px', letterSpacing: '-0.06em' }}>
            From sheet
            <br />
            to <i>space.</i>
          </h1>

          {/* Editorial Pull Quote */}
          <blockquote style={{ fontSize: '18px', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.5, color: '#1e211d', margin: '0 0 24px', paddingLeft: '14px', borderLeft: '3px solid var(--brand-red, #d43833)' }}>
            “Where code-driven robotic accuracy meets the 600-grit touch of master joinery.”
          </blockquote>

          <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#4a5249', maxWidth: '520px', marginBottom: '32px' }}>
            Transforming raw mineral slabs into seamless, monumental architectural interiors across India.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Discuss Fabrication Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#capabilities">
              Explore Machinery Fleet <span>↓</span>
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
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>160°C Bending</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Joint
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>0.0 mm Seam</strong>
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
            quality={75}
            decoding="async"
            style={{ objectFit: 'cover' }}
            priority
            suppressHydrationWarning
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

      {/* Sub-Navigation Quick Anchor Bar */}
      <nav
        style={{
          display: 'flex',
          gap: 'clamp(12px, 3vw, 36px)',
          padding: '16px 5vw',
          borderBottom: '1px solid var(--line)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--muted)',
          marginBottom: '24px',
        }}
        aria-label="Fabrication page sections"
      >
        <a href="#capabilities" style={{ color: 'inherit', textDecoration: 'none' }}>01 / Machinery Fleet</a>
        <a href="#joint-chemistry" style={{ color: 'inherit', textDecoration: 'none' }}>02 / Seam Technology</a>
        <a href="#typologies" style={{ color: 'inherit', textDecoration: 'none' }}>03 / Spatial Typologies</a>
        <a href="#process" style={{ color: 'inherit', textDecoration: 'none' }}>04 / 4-Stage Sequence</a>
        <a href="#edges" style={{ color: 'inherit', textDecoration: 'none' }}>05 / Edge Profiles</a>
        <a href="#protocols" style={{ color: 'inherit', textDecoration: 'none' }}>06 / Site Protocols</a>
      </nav>

      {/* Interactive Fabrication Rig Fleet, Seam Matrix & Typologies */}
      <FabricationExplorer />

      {/* 4-Step Craft Sequence — Editorial Visual Cards */}
      <section id="process" style={{ margin: '60px 0 100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <p className="eyebrow" style={{ margin: '0 0 8px' }}>The 4-Stage Workshop Sequence</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 48px)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Crafted in four movements. <i>Felt in one.</i>
            </h2>
          </div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Bengaluru Fabrication Atelier
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          {steps.map((step) => (
            <div
              key={step.num}
              id={step.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: '3px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(30, 33, 29, 0.04)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Photo Frame */}
              <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', background: '#e8e5dc' }}>
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'rgba(30, 33, 29, 0.88)', color: '#fff', padding: '3px 8px', borderRadius: '2px', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.06em' }}>
                  {step.num} / STAGE
                </div>
                <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(255, 255, 255, 0.94)', color: 'var(--ink)', padding: '4px 10px', borderRadius: '2px', fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, backdropFilter: 'blur(6px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  {step.metric}
                </div>
              </div>

              {/* Editorial Quote & Key Stat */}
              <div style={{ padding: '24px 22px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ display: 'inline-block', padding: '2px 8px', background: 'rgba(212,56,51,0.08)', color: 'var(--brand-red, #d43833)', border: '1px solid rgba(212,56,51,0.2)', fontFamily: 'DM Mono, monospace', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    {step.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 10px', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                    {step.title}
                  </h3>
                  <blockquote style={{ fontSize: '15px', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.45, color: '#1e211d', margin: '0 0 12px', paddingLeft: '10px', borderLeft: '2px solid var(--ink)' }}>
                    “{step.quote}”
                  </blockquote>
                  <p style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#687268', margin: 0 }}>
                    {step.tagline}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(30,33,29,0.1)', marginTop: '18px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {step.metricLabel}
                  </span>
                  <strong style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                    {step.badge}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Edge Profile Catalog */}
      <section id="edges" style={{ marginBottom: '100px' }}>
        <div className="section-head" style={{ marginBottom: '24px' }}>
          <div>
            <p className="eyebrow">Architectural Detailing</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Edge Profile
              <br />
              <i>catalog.</i>
            </h2>
          </div>
          <p style={{ maxWidth: '420px', fontSize: '15px', color: '#5d665c', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'serif' }}>
            “How light, shadow, and touch interact across the architectural boundary.”
          </p>
        </div>

        <EdgeProfileCatalog />
      </section>

      {/* Workshop Specifications & Site Protocols — Visual Architectural Grid */}
      <section id="protocols" style={{ marginBottom: '100px' }}>
        <div style={{ marginBottom: '24px' }}>
          <p className="eyebrow">Workshop Specifications &amp; Site Protocols</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.03em', margin: 0 }}>
            Precision protocols. <i>Zero guesswork.</i>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {protocols.map((proto) => (
            <div
              key={proto.num}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                    {proto.num}
                  </span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
                    {proto.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: 'var(--ink)' }}>
                  {proto.title}
                </h4>
                <div style={{ fontSize: '14px', fontStyle: 'italic', fontFamily: 'serif', color: 'var(--ink)', marginBottom: '10px' }}>
                  “{proto.quote}”
                </div>
                <p style={{ fontSize: '12px', lineHeight: 1.55, color: '#687268', margin: 0 }}>
                  {proto.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="callout" id="consultation">
        <p className="eyebrow">Technical fabrication consultation · Bengaluru Atelier</p>
        <h2>
          Make the
          <br />
          <i>unusual possible.</i>
        </h2>
        <p style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '18px', color: '#2e352d', marginBottom: '12px' }}>
          “Send your drawings, CAD cutouts, or 3D Rhino &amp; Revit models.”
        </p>
        <p style={{ maxWidth: '520px', fontSize: '14px', color: '#555e54', margin: '0 0 24px', lineHeight: 1.6 }}>
          Our engineering desk reviews joint locations, calculates steel sub-framing, and delivers physical 1:1 mockups.
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="button button-dark" href="/contact">
            Discuss a Fabrication Brief <span>↗</span>
          </Link>
          <a
            href="https://wa.me/919741044776?text=Hello%20Ace%20Spaces%20Engineering%2C%20I%20have%20an%20architectural%20fabrication%20brief%20and%20would%20like%20to%20consult%20on%20drawings."
            target="_blank"
            rel="noopener noreferrer"
            className="button"
            style={{ border: '1px solid var(--ink)', background: 'transparent' }}
          >
            Direct CAD Desk (WhatsApp) <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

