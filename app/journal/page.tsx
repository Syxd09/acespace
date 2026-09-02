import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JournalExplorer from '@/components/JournalExplorer';

export const metadata: Metadata = {
  title: 'Journal & Material Essays — Ace Spaces',
  description: 'Notes on making, material science, fabrication philosophy, and architectural essays from Ace Spaces.',
};

export default function JournalPage() {
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
          <p className="eyebrow" style={{ marginBottom: '20px' }}>Journal / Notes on Architecture & Making</p>

          <h1 style={{ fontSize: 'clamp(56px, 7vw, 108px)', lineHeight: 0.92, margin: '0 0 28px', letterSpacing: '-0.06em' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
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
            src="/assets/material-macro.png"
            alt="Macro detail of architectural mineral surface edge profile"
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
