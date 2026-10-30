import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { applicationSectors as defaultSectors } from '@/data/applications';
import ApplicationsLookbook from '@/components/ApplicationsLookbook';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteContent } from '@/data/contentStore';

export const metadata: Metadata = {
  title: 'Architectural Applications — Spatial Typologies & Surface Context',
  description:
    'Visual architectural lookbook of solid mineral surfaces across Luxury Residential, Spiritual Sanctums, Hospitality, Corporate Atriums, Healthcare, and Exterior Facades in India.',
  keywords: [
    'solid surface architectural applications',
    'hospitality reception desk Corian Bangalore',
    'monolithic kitchen island India',
    'healthcare surgical scrub sinks',
    'seamless washplane airports',
    'thermoformed curved wall cladding',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/applications',
  },
  openGraph: {
    title: 'Architectural Applications — Spatial Typologies | Ace Spaces',
    description:
      'Visual lookbook of seamless monolithic solid surface installations across six spatial typologies in India.',
    url: 'https://acespacesindia.vercel.app/applications',
    siteName: 'Ace Spaces',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/images/app_residential_calacatta_greige_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Architectural Solid Surface Typologies',
      },
    ],
  },
};

export default function ApplicationsPage() {
  const content = getSiteContent();
  const sectors = content.applicationSectors && content.applicationSectors.length > 0
    ? content.applicationSectors
    : defaultSectors;

  const macroDetails = [
    {
      title: '45° Seamless Waterfall',
      desc: 'Mitred waterfall returns flow continuously from horizontal countertops with no visible seam.',
      image: '/images/images/app_residential_calacatta_greige_2.jpg',
      tag: 'Residential & Hospitality',
    },
    {
      title: 'Coved Seamless Splashback',
      desc: 'A smooth coved transition from countertop to splashback eliminates sharp corners and silicone joints.',
      image: '/images/integrated-sink-installation.jpg',
      tag: 'Kitchen & Bathrooms',
    },
    {
      title: 'Translucent Light Transmission',
      desc: 'Translucent mineral surfaces gently diffuse backlighting for warm feature walls, mandirs, and bar fronts.',
      image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
      tag: 'Spiritual & Lounges',
    },
    {
      title: '160°C Compound Curvature',
      desc: 'Thermoformed curves shaped to the room—from reception desks to fluted columns and curved vanity aprons.',
      image: '/images/images/app_commercial_bleached_nuwood.jpg',
      tag: 'Reception Desks & Pods',
    },
  ];

  return (
    <main className="page-main">
      {/* Editorial Visual Hero */}
      <section className="page-split-hero" style={{ marginBottom: '60px' }}>
        <div>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: '24px' }}>
            Applications / Spatial Typologies
          </p>

          <h1 className="anim-fade-up anim-delay-1"
            style={{
              fontSize: 'clamp(44px, 6.5vw, 96px)',
              lineHeight: 0.96,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            Formed for
            <br />
            <i>every volume.</i>
          </h1>

          <p className="anim-fade-up anim-delay-2"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            A visual reference of continuous surfaces engineered across private residences, hospitality lounges, sacred sanctums, and clinical spaces.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#lookbook">
              Explore Lookbook <span>↓</span>
            </Link>
            <Link className="text-link" href="/materials">
              Corian® Library <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row anim-fade-up anim-delay-3">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Typologies
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                06 Sectors
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Joint Chemistry
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                Invisible Seams
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Formability
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                25mm Radii
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/app_residential_calacatta_greige_1.jpg"
            alt="Monolithic Calacatta Greige island installation"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            quality={80}
            priority
            style={{ objectFit: 'cover' }}
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Typology Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Curved Monoliths / Seamless Thermal Forming
              </strong>
            </div>
            <Link href="#lookbook" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              View Gallery <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Interactive Visual Lookbook */}
      <section id="lookbook" style={{ margin: '80px 0 100px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '32px' }}>
          <div>
            <p className="eyebrow">Visual Lookbook</p>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
              Built environments &amp;
              <br />
              <i>spatial craft.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14.5px', color: '#5d665c', maxWidth: '440px', margin: 0, lineHeight: 1.6 }}>
            Select an architectural typology to filter real installations, inspect joinery details, and view compatible DuPont™ Corian® specifications.
          </p>
        </ScrollReveal>

        <ApplicationsLookbook sectors={sectors} />
      </section>

      {/* Full-Bleed Architectural Feature Break */}
      <section
        style={{
          margin: '100px calc(-50vw + 50%)',
          width: '100vw',
          position: 'relative',
          height: '65vh',
          minHeight: '460px',
          overflow: 'hidden',
          background: '#161815',
        }}
      >
        <Image
          src="/images/images/coriansolidsurface-verdantlaguna-application.jpg"
          alt="Architectural solid surface installation showing monumental scale and seamless geometry"
          fill
          sizes="100vw"
          quality={80}
          style={{ objectFit: 'cover', opacity: 0.88 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,23,20,0.2) 0%, rgba(20,23,20,0.75) 100%)',
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
              Architectural Continuity
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
              “When seams disappear, architecture begins to feel carved from continuous stone.”
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
            Submit Project Drawings <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Macro Joinery & Detailing Gallery */}
      <section style={{ margin: '100px 0 120px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Tactile Detailing</p>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
              How corners, edges &amp;
              <br />
              <i>planes converge.</i>
            </h2>
          </div>
          <p style={{ fontSize: '14.5px', color: '#5d665c', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
            Mitred joints, thermoformed curves, and seamless edges crafted in our Bengaluru workshop.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {macroDetails.map((detail, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--paper, #f5f4ee)',
                border: '1px solid var(--line, rgba(30,33,29,0.09))', overflow: 'hidden', borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%', background: '#181b17' }}>
                <Image
                  src={detail.image}
                  alt={detail.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(20,23,20,0.85)',
                    color: '#e9e8e2',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '9.5px',
                    padding: '3px 8px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {detail.tag}
                </span>
              </div>
              <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: 'var(--ink, #1e211d)' }}>
                    {detail.title}
                  </h4>
                  <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#555e54', margin: 0 }}>
                    {detail.desc}
                  </p>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(30,33,29,0.1)' }}>
                  <Link
                    href="/fabrication"
                    className="text-link"
                    style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}
                  >
                    Fabrication Guide <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Callout */}
      <section className="callout" style={{ margin: '80px 0 100px' }}>
        <p className="eyebrow">Studio Consultation / Bengaluru Workshop</p>
        <h2>
          Have drawings ready
          <br />
          <i>for your next space?</i>
        </h2>
        <p style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '18px', color: '#2e352d', marginBottom: '12px' }}>
          “Share your CAD plans, joinery details, or Revit model.”
        </p>
        <p style={{ maxWidth: '520px', fontSize: '14.5px', color: '#555e54', margin: '0 0 24px', lineHeight: 1.6 }}>
          Our Bengaluru workshop team assists with radius feasibility, steel sub-frame calculations, and material sampling direct to your studio.
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="button button-dark" href="/contact">
            Discuss Typology Brief <span>↗</span>
          </Link>
          <Link className="text-link" href="/materials">
            Order Sample Box <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
