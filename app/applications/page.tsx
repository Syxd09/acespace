'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { applicationSectors as defaultSectors } from '@/data/applications';
import ApplicationSlider from '@/components/ApplicationSlider';
import { useSiteContent } from '@/context/SiteContentContext';

export default function ApplicationsPage() {
  const { applicationSectors: liveSectors } = useSiteContent();
  const sectors = (liveSectors && liveSectors.length > 0) ? liveSectors : defaultSectors;

  return (
    <main className="page-main">
      {/* Applications Editorial Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>
            Applications / Spatial Typologies
          </p>

          <h1
            style={{
              fontSize: 'clamp(44px, 7vw, 108px)',
              lineHeight: 0.96,
              margin: '0 0 28px',
              letterSpacing: '-0.06em',
            }}
          >
            Formed for
            <br />
            <i>every volume.</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            From quiet residential monoliths to high-traffic commercial atriums, Ace Spaces solid mineral surfaces bring seamless hygiene, thermal stability, and bespoke fabrication to six distinct architectural typologies.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#sectors">
              Explore Sectors <span>↓</span>
            </Link>
            <Link className="text-link" href="/materials">
              View Materials <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Typologies
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>06 Sectors</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Joinery
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Zero-Joint Spec</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Compliance
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Commercial Grade</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Accent */}
        <div className="hero-image-frame">
          <Image
            src="/assets/applications/calacatta-greige-kitchen.jpg"
            alt="Seamless curved solid surface kitchen island installation"
            fill
            sizes="(max-width: 800px) 100vw, 40vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Typology Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Curved Monoliths • Seamless Thermal Forming
              </strong>
            </div>
            <Link href="#sectors" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Explore Sectors <span>↓</span>
            </Link>
          </div>
        </div>
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
              <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                <ApplicationSlider
                  images={sector.images}
                  sectorTitle={sector.title}
                  sectorSlug={sector.id}
                  priority={index === 0}
                />
              </div>

              <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Sector {sector.sectorNumber}
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    lineHeight: 1.05,
                    margin: '0 0 16px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {sector.title}
                </h2>

                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: '#4a5249',
                    marginBottom: '20px',
                  }}
                >
                  {sector.heroDescription || sector.overview}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '24px',
                  }}
                >
                  {sector.elements?.map((el) => (
                    <span
                      key={el}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(30,33,29,0.06)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        color: 'var(--ink)',
                      }}
                    >
                      {el}
                    </span>
                  ))}
                </div>

                <Link
                  className="button button-dark"
                  href={`/applications/${sector.id}`}
                >
                  View {sector.title} Sector Spec <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
