import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-main" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 9vw' }}>
      <section style={{ maxWidth: '600px' }}>
        <p className="eyebrow">404 / Page Not Found</p>
        <h1 style={{ fontSize: 'clamp(48px, 6vw, 84px)', lineHeight: 0.95, marginBottom: '24px' }}>
          Space not<br /><i>found.</i>
        </h1>
        <p style={{ fontSize: '16px', color: '#5d665c', lineHeight: 1.6, marginBottom: '32px' }}>
          The architectural page or material record you are looking for does not exist or has been relocated.
        </p>
        <Link className="button button-dark" href="/">
          Return to Homepage <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
