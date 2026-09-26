import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ProjectGallery from '@/components/ProjectGallery';
import JsonLd from '@/components/JsonLd';
import { getSiteContent } from '@/data/contentStore';
import { defaultProjectsList } from '@/data/contentTypes';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Architectural Projects & Case Studies — Hospitality, Residential & Retail',
  description:
    'Explore completed architectural case studies engineered with Ace Spaces solid surfaces: sculptural hospitality monoliths, seamless residential islands, airport washplanes, and boutique retail plinths in India.',
  keywords: [
    'architectural case studies India',
    'solid surface projects Bengaluru',
    'hospitality reception desk case study',
    'luxury kitchen island project',
    'Corian installation examples',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/projects',
  },
  openGraph: {
    title: 'Selected Architectural Projects | Ace Spaces',
    description:
      'Monolithic solid surface installations across luxury residential, hospitality, commercial, and retail practices in India.',
    url: 'https://acespacesindia.vercel.app/projects',
    images: [
      {
        url: '/images/images/app_residential_stonecrest_smoke_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Architectural Case Studies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural Projects | Ace Spaces',
    description:
      'Monolithic solid surface case studies and completed spatial projects across India.',
    images: ['/images/images/app_residential_stonecrest_smoke_1.jpg'],
  },
};

export default function ProjectsPage() {
  const content = getSiteContent();
  const projects = content.projects && content.projects.length > 0 ? content.projects : defaultProjectsList;

  const projectsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ace Spaces Selected Architectural Projects',
    description: 'Case studies of monolithic solid surface installations in India.',
    itemListElement: projects.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        image: `https://acespacesindia.vercel.app${p.image}`,
        url: `https://acespacesindia.vercel.app/projects/${p.slug}`,
      },
    })),
  };

  return (
    <main className="page-main">
      <JsonLd data={projectsJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: "24px" }}>Projects / Selected Architectural Work</p>

          <h1 style={{ fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Material
            <br />
            in <i>practice.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            A curated selection of completed spaces where Ace Spaces through-body mineral surfaces define the architectural experience and seamless continuity.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="/contact">
              Submit Project Brief <span>↗</span>
            </Link>
            <Link className="text-link" href="#gallery">
              View Case Studies <span>↓</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Typologies
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Res / Hosp / Comm</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Locations
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>BLR / BOM / DEL</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Standards
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Master Joinery</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/hero-ace.png"
            alt="Completed private residence kitchen island by Studio Vardhan Architects"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Featured Case Study
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Private Residence • Studio Vardhan Architects
              </strong>
            </div>
            <Link href="/projects/private-residence" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Read Story <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Project Gallery */}
      <section id="gallery" style={{ margin: '80px 0 100px' }}>
        <ProjectGallery initialProjects={projects} />
      </section>

      <section className="callout">
        <p className="eyebrow">Collaborate on your next project</p>
        <h2>
          Bring your
          <br />
          <i>drawings to life.</i>
        </h2>
        <p>We work directly with architects, interior designers, and general contractors from concept design through to final on-site installation.</p>
        <Link className="button button-dark" href="/contact">
          Submit Project Details <span>↗</span>
        </Link>
      </section>
    </main>
  );
}

