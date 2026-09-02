import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ProjectGallery from '@/components/ProjectGallery';

export const metadata: Metadata = {
  title: 'Selected Architectural Projects — Ace Spaces',
  description: 'Explore completed residential, hospitality, commercial, and retail case studies crafted with Ace Spaces mineral surfaces.',
};

export default function ProjectsPage() {
  return (
    <main className="page-main" style={{ paddingTop: '100px' }}>
      {/* Rich Split Architectural Hero */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.1fr) 0.9fr',
          gap: '6vw',
          alignItems: 'center',
          padding: '60px 0 90px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <p className="eyebrow" style={{ marginBottom: "20px" }}>Projects / Selected Architectural Work</p>

          <h1 style={{ fontSize: 'clamp(56px, 7vw, 108px)', lineHeight: 0.92, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
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
        <div
          style={{
            position: 'relative',
            height: '520px',
            background: '#dcd7cd',
            border: '1px solid var(--line)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src="/assets/hero-ace.png"
            alt="Completed private residence kitchen island by Studio Vardhan Architects"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              background: 'rgba(233, 232, 226, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '16px 20px',
              border: '1px solid rgba(30,33,29,0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
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
        <ProjectGallery />
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

