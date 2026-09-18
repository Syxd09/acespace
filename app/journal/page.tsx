import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JournalExplorer from '@/components/JournalExplorer';
import JsonLd from '@/components/JsonLd';
import { journalArticles } from '@/data/journal';

export const metadata: Metadata = {
  title: 'Journal & Architectural Essays — Material Science & Fabrication Philosophy',
  description:
    'Read Ace Spaces architectural journal essays on monolithic joinery, zero-silica mineral health, 5-axis digital manufacturing, and material culture in contemporary spatial practice.',
  keywords: [
    'architectural essays',
    'solid surface material science',
    'zero-silica countertops health',
    'seamless joinery theory',
    'architectural fabrication journal',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/journal',
    types: {
      'application/rss+xml': 'https://acespacesindia.vercel.app/journal/feed.xml',
    },
  },
  openGraph: {
    title: 'Journal & Material Essays | Ace Spaces',
    description:
      'Notes on making, material science, zero-silica health, and fabrication philosophy from our Bengaluru atelier.',
    url: 'https://acespacesindia.vercel.app/journal',
    images: [
      {
        url: '/assets/material-macro.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Architectural Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal & Material Essays | Ace Spaces',
    description:
      'Essays on architectural solid surfaces, fabrication craft, and material culture in India.',
    images: ['/assets/material-macro.png'],
  },
};

const journalJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Ace Spaces Architectural Journal',
  description: 'Notes on architectural surfaces, fabrication science, and monolithic spatial practice.',
  url: 'https://acespacesindia.vercel.app/journal',
  blogPost: journalArticles.map((article) => ({
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    url: `https://acespacesindia.vercel.app/journal/${article.slug}`,
    author: {
      '@type': 'Organization',
      name: article.author || 'Ace Spaces',
    },
    image: `https://acespacesindia.vercel.app${article.image}`,
  })),
};

export default function JournalPage() {
  return (
    <main className="page-main">
      <JsonLd data={journalJsonLd} />
      {/* Rich Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>Journal / Notes on Architecture & Making</p>

          <h1 style={{ fontSize: 'clamp(48px, 7vw, 108px)', lineHeight: 0.96, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
            Space &
            <br />
            <i>matter.</i>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4a5249', maxWidth: '520px', marginBottom: '36px' }}>
            Material knowledge, fabrication thinking, and observations from the world of considered architectural interiors and solid mineral joinery.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#essays">
              Explore Essays <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Subscribe to Dispatch <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Publications
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>06 Essays</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Research
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Optical & Joinery</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Format
              </span>
              <strong style={{ fontSize: '16px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Open Access</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/assets/material-macro.png"
            alt="Macro detail of architectural mineral surface edge profile"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Featured Essay
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                The Edge is Where Material Becomes Architecture
              </strong>
            </div>
            <Link href="#essays" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Read <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Journal Explorer Component */}
      <section id="essays" style={{ margin: '80px 0 100px' }}>
        <JournalExplorer />
      </section>

      {/* Newsletter / Stay Close to the Work */}
      <section className="callout">
        <p className="eyebrow">Stay close to the work</p>
        <h2>
          Architectural
          <br />
          <i>notes & updates.</i>
        </h2>
        <p>
          Receive occasional essays on material science, newly completed case studies, and workshop prototyping updates directly from our Bengaluru studio.
        </p>
        <Link className="button button-dark" href="/contact">
          Subscribe for Studio Notes <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
