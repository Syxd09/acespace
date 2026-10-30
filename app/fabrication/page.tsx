import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import EdgeProfileCatalog from '@/components/EdgeProfileCatalog';
import JsonLd from '@/components/JsonLd';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'Digital Fabrication & Architectural Engineering — 5-Axis CNC & Thermoforming',
  description:
    'Advanced solid surface workshop in Bengaluru: 5-axis CNC routing (<0.2mm tolerance), vacuum thermoforming (25mm tight radii), molecular seaming, and hand-honed finishing.',
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
        '5-axis CNC routing, vacuum thermoforming, invisible molecular welding, and certified installation across India.',
    },
  ],
};

export default function FabricationPage() {
  const steps = [
    {
      num: '01',
      title: '5-Axis CNC Precision',
      badge: 'Sub-Millimeter Cut',
      tagline: 'Nested cutting paths, sink rebates, and custom edge profiles machined to ±0.18mm accuracy.',
      image: '/images/images/app_residential_calacatta_greige_2.jpg',
      stat: '±0.18 mm',
      statLabel: 'Tolerance',
    },
    {
      num: '02',
      title: '160°C Vacuum Forming',
      badge: '25 mm Radii',
      tagline: 'Mineral sheets heated in platen ovens and vacuum-formed over timber formwork into organic curves.',
      image: '/images/images/app_commercial_bleached_nuwood.jpg',
      stat: '160°C',
      statLabel: 'Forming Temp',
    },
    {
      num: '03',
      title: 'Invisible Seam Fusion',
      badge: 'Seamless Joints',
      tagline: 'Sheets bonded with color-matched acrylic resin to create seamless, continuous surfaces.',
      image: '/images/images/app_residential_calacatta_greige_1.jpg',
      stat: '0.0 mm',
      statLabel: 'Seam Line',
    },
    {
      num: '04',
      title: 'Diamond Hand Honing',
      badge: 'Satin Touch',
      tagline: 'Multi-stage diamond sanding for a smooth satin touch that resists glare and refreshes on-site.',
      image: '/assets/material-macro.png',
      stat: '600 Grit',
      statLabel: 'Finish Grade',
    },
  ];

  const protocols = [
    {
      num: '01',
      title: '3D Laser Templating',
      detail: 'Digital spatial scans ensure an accurate fit against existing site walls.',
      badge: 'Laser Scan',
    },
    {
      num: '02',
      title: 'Workshop Dry-Fit',
      detail: 'Monolithic assemblies are pre-assembled and inspected in Bengaluru before packing.',
      badge: 'Pre-Assembled',
    },
    {
      num: '03',
      title: 'On-Site Assembly',
      detail: 'Experienced joiners assemble and seam sections on site with zero visible joints.',
      badge: 'Seamless Fit',
    },
    {
      num: '04',
      title: 'In-Situ Renewal',
      detail: 'Everyday scuffs or marks can be refreshed on-site with simple hand sanding.',
      badge: 'Renewable',
    },
  ];

  return (
    <main className="page-main">
      <JsonLd data={fabricationJsonLd} />

      {/* Editorial Visual Hero */}
      <section className="page-split-hero" style={{ marginBottom: '60px' }}>
        <div>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: '24px' }}>
            Fabrication / Atelier &amp; Workshop
          </p>

          <h1
            style={{
              fontSize: 'clamp(44px, 6.5vw, 96px)',
              lineHeight: 0.96,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            From sheet
            <br />
            to <i>space.</i>
          </h1>

          <blockquote
            style={{
              fontSize: '18px',
              fontStyle: 'italic',
              fontFamily: 'serif',
              lineHeight: 1.5,
              color: '#1e211d',
              margin: '0 0 24px',
              paddingLeft: '14px',
              borderLeft: '2px solid rgba(196, 67, 61, 0.28)',
            }}
          >
            “Where CNC precision meets the tactile touch of master hand joinery.”
          </blockquote>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            From parametric shop drawings to on-site assembly, our Bengaluru workshop crafts bespoke solid surface counters, basins, and curved elements for projects across India.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Discuss Fabrication Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#sequence">
              Workshop Sequence <span>↓</span>
            </Link>
          </div>

          <div className="hero-stats-row anim-fade-up anim-delay-4">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Tolerance
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                &lt; 0.2 mm
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Forming
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                Fluid Curves
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Joint
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                Seamless Joint
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/app_residential_calacatta_greige_2.jpg"
            alt="Hand honing and CNC carving of monolithic mineral surface"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            quality={80}
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Workshop Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Hand-Honed Satin Edge / Sub-millimeter Tolerance
              </strong>
            </div>
            <Link href="#edges" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Edge Profiles <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Workshop Sequence — 4-Stage Visual Monograph Grid */}
      <section id="sequence" style={{ margin: '80px 0 100px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">The 4-Stage Workshop Sequence</p>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
              Crafted in four movements.
              <br />
              <i>Felt in one.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14.5px', color: '#5d665c', maxWidth: '440px', margin: 0, lineHeight: 1.6 }}>
            Every custom fixture moves through CNC routing, thermal forming, molecular seam welding, and diamond hand-honing in our Bengaluru workshop.
          </p>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
          }}
        >
          {steps.map((step) => (
            <article
              key={step.num}
              style={{
                background: 'var(--paper, #f5f4ee)', border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', borderRadius: '6px', overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
              }}
              className="fabrication-card"
            >
              <div
                style={{
                  position: 'relative',
                  height: '260px',
                  width: '100%',
                  background: '#1a1d19',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="fabrication-card-img"
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(20, 23, 20, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  Stage {step.num}
                </span>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                    background: 'rgba(255, 255, 255, 0.94)',
                    color: 'var(--ink, #1e211d)',
                    padding: '4px 10px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {step.stat}
                </div>
              </div>

              <div
                style={{
                  padding: '24px 24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flex: 1,
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px', background: 'rgba(30, 33, 29, 0.06)', borderRadius: '3px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '12px',
                    }}
                  >
                    {step.badge}
                  </span>
                  <h3
                    style={{
                      fontSize: '19px',
                      fontWeight: 500,
                      margin: '0 0 10px',
                      color: 'var(--ink, #1e211d)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13.5px',
                      lineHeight: 1.6,
                      color: '#555e54',
                      margin: 0,
                    }}
                  >
                    {step.tagline}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '14px',
                    borderTop: '1px dashed rgba(30, 33, 29, 0.14)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {step.statLabel}
                  </span>
                  <strong style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                    {step.badge}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full-Bleed Workshop Feature Break */}
      <section
        style={{
          margin: '100px calc(-50vw + 50%)',
          width: '100vw',
          position: 'relative',
          height: '60vh',
          minHeight: '440px',
          overflow: 'hidden',
          background: '#161815',
        }}
      >
        <Image
          src="/images/images/app_commercial_bleached_nuwood.jpg"
          alt="160 degree thermoforming solid surface workshop in Bengaluru"
          fill
          sizes="100vw"
          quality={80}
          style={{ objectFit: 'cover', opacity: 0.85 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,23,20,0.2) 0%, rgba(20,23,20,0.8) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 64px)',
            maxWidth: '1240px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#dcd7cd',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Curvature Beyond The Grid
            </span>
            <blockquote
              style={{
                fontFamily: 'var(--serif, serif)',
                fontSize: 'clamp(24px, 3.5vw, 38px)',
                lineHeight: 1.25,
                margin: 0,
                fontStyle: 'italic',
                color: '#f5f4ee',
              }}
            >
              “Heated to 160°C, mineral sheets become supple as leather, forming compound curves without surface blanching.”
            </blockquote>
          </div>

          <Link
            className="button"
            href="/contact"
            style={{
              background: '#ffffff',
              color: '#1a1d19',
              border: 'none',
              padding: '14px 26px',
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
            }}
          >
            Request Thermoformed Mockup <span>↗</span>
          </Link>
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

      {/* Workshop Specifications & Site Protocols */}
      <section id="protocols" style={{ marginBottom: '100px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">Workshop Protocols</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', letterSpacing: '-0.03em', margin: 0 }}>
              Precision protocols.
              <br />
              <i>Zero guesswork.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: '#5d665c', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
            Laser templating and certified installation ensure seamless integration into rough architectural framing.
          </p>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {protocols.map((proto) => (
            <div
              key={proto.num}
              style={{
                background: 'var(--paper, #f5f4ee)', border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', padding: '24px 22px', borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                    {proto.num}
                  </span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', background: 'rgba(30,33,29,0.06)', padding: '2px 8px', textTransform: 'uppercase' }}>
                    {proto.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 10px', color: 'var(--ink, #1e211d)' }}>
                  {proto.title}
                </h4>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#555e54', margin: 0 }}>
                  {proto.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Callout */}
      <section className="callout" style={{ margin: '80px 0 100px' }}>
        <p className="eyebrow">Technical fabrication consultation / Bengaluru Workshop</p>
        <h2>
          Make the
          <br />
          <i>unusual possible.</i>
        </h2>
        <p style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '18px', color: '#2e352d', marginBottom: '12px' }}>
          “Share your drawings or 3D CAD models.”
        </p>
        <p style={{ maxWidth: '520px', fontSize: '14px', color: '#555e54', margin: '0 0 24px', lineHeight: 1.6 }}>
          Our workshop team reviews joint placements, calculates steel sub-framing, and provides physical mockups.
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
