import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ace Spaces — Architectural Mineral Foundry',
  description: 'Privacy and data protection policy for Ace Spaces architectural clients, specifiers, and studio partners.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)' }}>
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '140px 24px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)' }}>
            Governance & Legal Standards
          </span>
          <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: '42px', fontWeight: 400, margin: '8px 0 16px', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#596059' }}>
            Last updated: September 2026 · Bengaluru Architectural Foundry
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', fontFamily: 'var(--sans, sans-serif)', lineHeight: 1.8, fontSize: '15px', color: '#2f352e' }}>
          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              1. Architectural Client Information & Data Collection
            </h2>
            <p>
              Ace Spaces (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects the confidentiality and proprietary nature of all architectural projects, commercial tenders, and private residential inquiries. When you interact with our platform to order material sample specimens, request formulation monographs, or submit project blueprints, we collect relevant professional information such as your name, studio affiliation, email, delivery address, and project specifications.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              2. Purpose of Processing & Sample Fulfillment
            </h2>
            <p>
              We process your information exclusively to:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
              <li>Coordinate express courier dispatch of architectural solid surface samples to your studio.</li>
              <li>Provide technical CAD/BIM data sheets, edge profiling guidance, and fabrication consultations.</li>
              <li>Deliver quarterly editions of the Specifier Dispatch if you have opted in.</li>
              <li>Manage client accounts, project status tracking, and sample tray shortlists via secure browser session tokens.</li>
            </ul>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              3. Confidentiality of Architectural Briefs
            </h2>
            <p>
              All proprietary project drawings, CAD files, material schedules, and bespoke formulation requests submitted via our contact forms or studio console remain strictly confidential. Ace Spaces does not sell, license, or disclose your project data to third-party advertising brokers.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--line, #ddd8ce)', paddingTop: '24px' }}>
            <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
              4. Data Retention & Studio Rights
            </h2>
            <p>
              You maintain the right to inspect, update, or request full deletion of your contact records, dispatch subscriptions, or order history at any time by contacting our studio team at <a href="mailto:studio@acespaces.in" style={{ color: '#1a1d19', textDecoration: 'underline' }}>studio@acespaces.in</a>.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '1px solid var(--line, #ddd8ce)' }}>
          <Link href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1d19', textDecoration: 'none' }}>
            ← Return to Ace Spaces Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
