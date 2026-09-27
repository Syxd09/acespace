import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="page-main"
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '140px 9vw 80px',
      }}
    >
      <section style={{ maxWidth: '780px' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '16px' }}>
          404 / Spatial Coordinate Not Found
        </p>
        <h1
          style={{
            fontSize: 'clamp(48px, 6.5vw, 88px)',
            lineHeight: 0.95,
            marginBottom: '28px',
            letterSpacing: '-0.05em',
          }}
        >
          Space not<br />
          <i>found.</i>
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: '#4a5249',
            lineHeight: 1.65,
            marginBottom: '40px',
            maxWidth: '560px',
          }}
        >
          The architectural record, material slug, or page coordinate you requested is unavailable or has been relocated to another gallery within our catalog.
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <Link className="button button-dark" href="/">
            Return to Homepage <span>↗</span>
          </Link>
          <Link className="button button-light" href="/materials" style={{ border: '1px solid var(--line)' }}>
            Materials Library <span>→</span>
          </Link>
          <Link className="text-link" href="/contact">
            Contact Specifier Desk <span>↗</span>
          </Link>
        </div>

        {/* Quick Portal Links */}
        <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
              01 / Palette
            </span>
            <Link href="/materials" className="text-link" style={{ fontSize: '14px', fontWeight: 600 }}>
              Materials & Colours →
            </Link>
          </div>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
              02 / Systems
            </span>
            <Link href="/products" className="text-link" style={{ fontSize: '14px', fontWeight: 600 }}>
              Architectural Products →
            </Link>
          </div>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
              04 / Workshop
            </span>
            <Link href="/fabrication" className="text-link" style={{ fontSize: '14px', fontWeight: 600 }}>
              CNC & Thermoforming →
            </Link>
          </div>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
              06 / Discourse
            </span>
            <Link href="/journal" className="text-link" style={{ fontSize: '14px', fontWeight: 600 }}>
              Architectural Journal →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
