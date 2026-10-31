import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { applicationSectors as defaultSectors } from '@/data/applications';
import ApplicationSlider from '@/components/ApplicationSlider';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteContent } from '@/data/contentStore';

export const metadata: Metadata = {
  title: 'Architectural Applications — Spatial Typologies & Surface Context',
  description:
    'Explore the six architectural typologies formed with Ace Spaces solid mineral surfaces: Residential kitchens & monoliths, Luxury Hospitality, Corporate Atriums, Retail Flagships, Clinical Healthcare, and Public Infrastructure in Bengaluru, India.',
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
      'Seamless hygiene, thermal stability, and 5-axis CNC digital fabrication across six distinct spatial sectors in India.',
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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Ace Spaces Architectural Typologies & Applications',
    url: 'https://acespacesindia.vercel.app/applications',
    description:
      'Architectural solid surface applications spanning Residential, Hospitality, Corporate, Retail, Healthcare, and Public Infrastructure.',
    provider: {
      '@type': 'Organization',
      name: 'Ace Spaces Private Limited',
      url: 'https://acespacesindia.vercel.app',
    },
    hasPart: sectors.map((s) => ({
      '@type': 'Service',
      name: s.title,
      description: s.heroDescription || s.overview,
      url: `https://acespacesindia.vercel.app/applications/${s.id}`,
    })),
  };

  return (
    <main className="page-main">
      {/* Schema.org CollectionPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Applications Editorial Hero */}
      <section className="page-split-hero" style={{ marginBottom: '60px' }}>
        <div>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: '24px' }}>
            Applications / Spatial Typologies
          </p>

          <h1
            className="anim-fade-up anim-delay-1"
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

          <p
            className="anim-fade-up anim-delay-2"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            From private residences to high-traffic commercial spaces, Ace Spaces fabricates DuPont™ Corian® solid surfaces into seamless architectural fixtures.
          </p>

          <div
            className="anim-fade-up anim-delay-3"
            style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}
          >
            <Link className="button button-dark" href="#sectors">
              Explore Sectors <span>↓</span>
            </Link>
            <Link className="text-link" href="/materials">
              Corian® Material Library <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row anim-fade-up anim-delay-4">
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Typologies
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                06 Core Sectors
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Custom Scope
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                Monoliths to Cladding
              </strong>
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Urbanist, sans-serif',
                  color: 'var(--muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                Hygiene Standard
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'Urbanist, sans-serif', color: 'var(--ink)' }}>
                100% Non-Porous
              </strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <ScrollReveal variant="image" className="hero-image-frame">
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
              <span style={{ fontSize: '9px', fontFamily: 'Urbanist, sans-serif', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Typology Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Curved Monoliths / Seamless Thermal Forming
              </strong>
            </div>
            <Link href="#sectors" className="text-link" style={{ fontSize: '11px', fontFamily: 'Urbanist, sans-serif' }}>
              Explore Sectors <span>↓</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Dynamic Sectors Showcase */}
      <section id="sectors" style={{ margin: '80px 0 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
          {sectors.map((sector, index) => (
            <div
              key={sector.id}
              className="sector-showcase-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
                gap: '5vw',
                alignItems: 'center',
                paddingBottom: '80px',
                borderBottom: index !== sectors.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <ScrollReveal
                variant="image"
                delay={40}
                style={{ order: index % 2 === 0 ? 1 : 2 }}
              >
                <ApplicationSlider
                  images={sector.images}
                  sectorTitle={sector.title}
                  sectorSlug={sector.id}
                  priority={index === 0}
                />
              </ScrollReveal>

              <ScrollReveal
                delay={120}
                style={{ order: index % 2 === 0 ? 2 : 1 }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'Urbanist, sans-serif',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  0{index + 1} / 0{sectors.length} — {sector.title}
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(28px, 3.8vw, 46px)',
                    lineHeight: 1.05,
                    margin: '0 0 16px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {sector.title}
                </h2>

                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: '#4a5249',
                    maxWidth: '460px',
                    marginBottom: '28px',
                  }}
                >
                  {sector.heroDescription || sector.overview}
                </p>

                <Link
                  className="button button-dark"
                  href={`/applications/${sector.id}`}
                >
                  Explore {sector.title} <span>↗</span>
                </Link>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Callout */}
      <ScrollReveal className="callout" style={{ margin: '80px 0 100px' }}>
        <p className="eyebrow">Studio Consultation / Bengaluru Workshop</p>
        <h2>
          Have drawings ready
          <br />
          <i>for your next space?</i>
        </h2>
        <p style={{ maxWidth: '520px', fontSize: '15px', color: '#555e54', margin: '0 0 28px', lineHeight: 1.65 }}>
          Share your CAD plans, joinery details, or hand sketches. Our workshop team assists with radius feasibility, joint engineering, and material sample dispatch.
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="button button-dark" href="/contact">
            Submit Project Brief <span>↗</span>
          </Link>
          <Link className="text-link" href="/materials">
            Order Sample Box <span>↗</span>
          </Link>
        </div>
      </ScrollReveal>
    </main>
  );
}
