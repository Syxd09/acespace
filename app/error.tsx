'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Unhandled studio application error:', error);
  }, [error]);

  return (
    <main
      className="page-main"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '140px 9vw 80px',
      }}
    >
      <section style={{ maxWidth: '640px' }}>
        <p className="eyebrow" style={{ color: '#b91c1c' }}>
          Studio Notice / System Interruption
        </p>
        <h1
          style={{
            fontSize: 'clamp(44px, 6vw, 80px)',
            lineHeight: 0.96,
            marginBottom: '24px',
            letterSpacing: '-0.05em',
          }}
        >
          Temporary spatial<br />
          <i>interruption.</i>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#5d665c',
            lineHeight: 1.65,
            marginBottom: '36px',
          }}
        >
          We encountered an unexpected condition while rendering this architectural surface. Our Bengaluru technical desk has been notified.
        </p>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button button-dark"
            onClick={() => reset()}
          >
            Re-render Space <span>↻</span>
          </button>
          <Link className="button button-light" href="/" style={{ border: '1px solid var(--line)' }}>
            Return to Homepage <span>↗</span>
          </Link>
          <a
            className="text-link"
            href="https://wa.me/919845012345"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}
          >
            WhatsApp Desk ↗
          </a>
        </div>
      </section>
    </main>
  );
}
