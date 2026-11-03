'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function CoroShowcase() {
  return (
    <section id="coro" className="coro-clean-section">
      <div className="coro-clean-grid">
        {/* Left: Authentic Architectural Photography */}
        <ScrollReveal className="coro-clean-media">
          <img
            src="/images/coro/experience-centre.jpg"
            alt="CORO Experience Centre in Bengaluru featuring curved Corian solid surface reception desk"
            className="coro-clean-image"
            loading="lazy"
          />
        </ScrollReveal>

        {/* Right: Minimal Editorial Atmosphere */}
        <ScrollReveal delay={100} className="coro-clean-body">
          <div className="coro-clean-eyebrow">
            <span>06 — CORO CRAFTED COLLECTIVE</span>
          </div>

          <h2 className="coro-clean-heading">
            Step inside.
            <br />
            <em>Feel the difference.</em>
          </h2>

          <p className="coro-clean-text">
            Visit our Bengaluru experience centre to see Corian® in person — from curved reception desks to seamless kitchen counters. Ace Spaces supplies the raw materials and precision fabrication behind Coro&apos;s custom architectural furniture.
          </p>

          <div className="coro-clean-meta">
            <div>
              <span className="coro-meta-heading">EXPERIENCE CENTRE</span>
              <p className="coro-meta-value">Bengaluru, India</p>
            </div>
            <div>
              <span className="coro-meta-heading">HOURS</span>
              <p className="coro-meta-value">Mon–Sat · 10 AM – 7 PM</p>
            </div>
          </div>

          <div className="coro-clean-actions">
            <a
              href="https://coro-nine.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="coro-clean-btn coro-clean-btn-primary"
            >
              Explore Coro <span>↗</span>
            </a>
            <Link href="/materials" className="coro-clean-btn coro-clean-btn-secondary">
              Explore Materials <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
