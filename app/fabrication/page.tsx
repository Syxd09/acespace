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
      phase: 'Milling',
      title: '5-Axis CNC Precision',
      discipline: 'Milling',
      tagline: 'Multi-axis routing for tight sink rebates and custom edges.',
      image: '/images/images/app_residential_calacatta_greige_2.jpg',
      spec: '±0.18 mm tolerance',
      metricLabel: 'Tolerance',
    },
    {
      num: '02',
      phase: 'Forming',
      title: '160°C Thermal Forming',
      discipline: 'Forming',
      tagline: 'Platen-softened mineral sheets formed into organic curves.',
      image: '/images/basin-vanity-thermoformed-double.jpg',
      spec: '160°C · 25 mm min. radius',
      metricLabel: 'Curvature',
    },
    {
      num: '03',
      phase: 'Fusion',
      title: 'Invisible Seam Fusion',
      discipline: 'Fusion',
      tagline: 'Molecular chemical weld with zero visible joints.',
      image: '/images/integrated-sink-installation.jpg',
      spec: '0.0 mm joint · Monolithic',
      metricLabel: 'Joint',
    },
    {
      num: '04',
      phase: 'Honing',
      title: 'Diamond Hand Honing',
      discipline: 'Honing',
      tagline: 'Progressive diamond sanding for a glare-free satin touch.',
      image: '/assets/material-macro.png',
      spec: '600 grit · Velvet touch',
      metricLabel: 'Finish',
    },
  ];

  return (
    <main className="page-main">
      <JsonLd data={fabricationJsonLd} />

      {/* Editorial Visual Hero — Minimal Architectural Opening */}
      <section className="page-split-hero" style={{ marginBottom: '60px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted, #6f786d)',
                fontWeight: 600,
              }}
            >
              01 — Fabrication / Workshop
            </span>
            <div style={{ width: '60px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
          </div>

          <h1
            style={{
              fontSize: 'clamp(44px, 6.8vw, 96px)',
              lineHeight: 0.96,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            From sheet
            <br />
            to <i>space.</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            Parametric digital toolpaths to seamless on-site joinery. 5-axis CNC routing, 160°C thermoforming, and hand-honing in our Bengaluru atelier.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="/contact">
              Fabrication Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#sequence">
              Atelier Sequence <span>↓</span>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Tolerance
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                ±0.18 mm CNC
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Forming
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                160°C Platen
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Joint
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                Seamless Monolith
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame — Clean & Pristine */}
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
        </div>
      </section>

      {/* Workshop Sequence — Architectural Craft Monograph */}
      <section id="sequence" style={{ margin: '90px 0 110px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '44px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'Urbanist, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6f786d)',
                  fontWeight: 600,
                }}
              >
                02 — Atelier Sequence
              </span>
              <div style={{ flex: 1, maxWidth: '180px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0 }}>
              Crafted in four movements.
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>Felt in one seamless form.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: '#555e54', maxWidth: '440px', margin: 0, lineHeight: 1.65, fontWeight: 400 }}>
            Every custom fixture moves through CNC routing, thermal forming, molecular seam fusion, and diamond hand-honing in our Bengaluru workshop.
          </p>
        </ScrollReveal>

        <div className="sequence-monograph-rail">
          {steps.map((step) => (
            <article key={step.num} className="sequence-step-item">
              {/* Step Timeline Header */}
              <div className="sequence-step-header">
                <span className="sequence-step-num">{step.num}</span>
                <span className="sequence-step-divider">—</span>
                <span className="sequence-step-phase">{step.phase}</span>
                <div className="sequence-step-line" />
              </div>

              {/* Clean Architectural Image Frame */}
              <div className="sequence-image-frame">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                  }}
                  className="sequence-image"
                />
                <div className="sequence-image-spec">
                  <span>{step.spec}</span>
                </div>
              </div>

              {/* Editorial Content Below */}
              <div className="sequence-step-body">
                <h3 className="sequence-step-title">{step.title}</h3>
                <p className="sequence-step-desc">{step.tagline}</p>

                <div className="sequence-step-footer">
                  <span className="sequence-footer-label">{step.metricLabel}</span>
                  <span className="sequence-footer-val">{step.spec.split('·')[0].trim()}</span>
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
          src="/images/bespoke-sculptural-lounge-monolith.jpg"
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
                fontFamily: 'Urbanist, sans-serif',
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
              fontFamily: 'Urbanist, sans-serif',
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
