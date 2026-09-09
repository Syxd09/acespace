import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { applicationSectors, getApplicationSector } from '@/data/applications';
import ApplicationSlider from '@/components/ApplicationSlider';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return applicationSectors.map((sector) => ({
    slug: sector.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sector = getApplicationSector(params.slug);
  if (!sector) return { title: 'Application Not Found — Ace Spaces' };
  return {
    title: `${sector.title} — Ace Spaces Architectural Applications`,
    description: sector.heroDescription,
  };
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const sector = getApplicationSector(params.slug);
  if (!sector) {
    notFound();
  }

  return (
    <main className="page-main">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '36px' }}>
        <Link
          href="/applications"
          style={{
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.08em',
          }}
        >
          ← Back to All Applications
        </Link>
      </div>

      {/* Sector Hero Section */}
      <section className="page-split-hero" style={{ alignItems: 'start', paddingBottom: '60px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '14px' }}>
            Sector {sector.sectorNumber} / Typology Case
          </span>
          <h1 style={{ fontSize: 'clamp(40px, 5.2vw, 70px)', lineHeight: 0.94, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            {sector.title.split(' ')[0]}
            <br />
            <i>{sector.title.split(' ').slice(1).join(' ')}</i>
          </h1>
          <p style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '24px' }}>
            {sector.tagline}
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#3d433b', marginBottom: '36px' }}>
            {sector.overview}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <Link className="button button-dark" href="/contact">
              Discuss a {sector.title.split(' ')[0]} Brief <span>↗</span>
            </Link>
            <Link
              href="/materials"
              style={{
                padding: '12px 22px',
                fontSize: '12px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '1px solid var(--line)',
                background: 'transparent',
                color: 'var(--ink)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Request Sector Samples <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Hero Slider with all sector images */}
        <div>
          <ApplicationSlider
            images={sector.images}
            sectorTitle={sector.title}
            sectorSlug={sector.id}
            priority={true}
          />
        </div>
      </section>

      {/* Engineering & Joinery Breakdown */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '14px' }}>
          Fabrication Architecture
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 40px', lineHeight: 1.05 }}>
          Engineering & Joinery
          <br />
          <i>Specifications.</i>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {sector.specifications.map((spec, i) => (
            <div
              key={spec.title}
              style={{
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                  SPEC 0{i + 1}
                </span>
                <h3 style={{ fontSize: '20px', margin: '0 0 14px', color: 'var(--ink)' }}>{spec.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', margin: 0 }}>
                  {spec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photographic Gallery Grid of all images with details */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '14px' }}>
          Application Showcase
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 40px', lineHeight: 1.05 }}>
          Spatial Photography &
          <br />
          <i>Close-up Details.</i>
        </h2>

        <div className="app-slug-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {sector.images.map((img, idx) => (
            <div
              key={img.src}
              className="app-slug-gallery-item"
              style={{
                border: '1px solid var(--line)',
                background: '#dcd7cd',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '320px', width: '100%' }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(23, 26, 23, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {img.tag}
                </span>
              </div>
              <div style={{ padding: '18px 22px', background: 'var(--paper)', borderTop: '1px solid var(--line)', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--ink)', marginBottom: '4px' }}>
                  {img.caption}
                </strong>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                  View 0{idx + 1} • Inconspicuous joint tolerance &lt; 0.08mm
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hygiene, Performance & Compliance Table */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '14px' }}>
          Certification & Testing
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 40px', lineHeight: 1.05 }}>
          Performance & Hygiene
          <br />
          <i>Parameters.</i>
        </h2>

        <div className="app-slug-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: '#dcd7cd' }}>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>Feature</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>Test Standard</th>
                <th style={{ padding: '16px 24px', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>Architectural Benefit</th>
              </tr>
            </thead>
            <tbody>
              {sector.hygieneAndPerformance.map((item, i) => (
                <tr key={item.feature} style={{ borderBottom: i !== sector.hygieneAndPerformance.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <td style={{ padding: '18px 24px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{item.feature}</td>
                  <td style={{ padding: '18px 24px', fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>{item.standard}</td>
                  <td style={{ padding: '18px 24px', fontSize: '14px', color: '#4a5249' }}>{item.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommended Material Palette Links */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '14px' }}>
          Specified Surfaces
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 40px', lineHeight: 1.05 }}>
          Recommended Palette for
          <br />
          <i>{sector.title}.</i>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {sector.recommendedMaterials.map((mat) => (
            <Link
              key={mat.slug}
              href={`/materials/${mat.slug}`}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                padding: '24px',
                display: 'block',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                Finish • {mat.finish}
              </span>
              <strong style={{ fontSize: '17px', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
                {mat.name}
              </strong>
              <span className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                View Spec Sheet <span>↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Spatial Brief Callout */}
      <section className="callout">
        <p className="eyebrow">Project consultation</p>
        <h2>
          Ready to detail your
          <br />
          <i>{sector.title.toLowerCase()}?</i>
        </h2>
        <p>Our technical team assists with CAD shop drawings, CNC buck construction, seam mapping, and installation.</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="button button-dark" href="/contact">
            Start a project brief <span>↗</span>
          </Link>
          <Link
            href="/applications"
            style={{
              padding: '12px 22px',
              fontSize: '12px',
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              border: '1px solid var(--line)',
              background: 'transparent',
              color: 'var(--ink)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ← View All Applications
          </Link>
        </div>
      </section>
    </main>
  );
}
