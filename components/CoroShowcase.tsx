'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

interface VisualItem {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  badge: string;
}

const VISUALS: VisualItem[] = [
  {
    id: 'centre',
    label: '01 / Bengaluru Atelier',
    title: 'Bengaluru Experience Centre',
    subtitle: 'Curved Corian® Reception Monolith & ARIA Acoustic Walls',
    image: '/images/coro/experience-centre.jpg',
    alt: 'CORO Experience Centre in Bengaluru featuring curved Corian solid surface reception desk and architectural lighting',
    badge: 'BENGALURU ATELIER · 100% CORIAN® FABRICATION',
  },
  {
    id: 'rocco',
    label: '02 / Coro Rocco™',
    title: 'Seamless Solid Surface Sculpture',
    subtitle: 'Thermoformed Curves & Monolithic Architectural Plinths',
    image: '/images/coro/rocco-monolith.jpg',
    alt: 'Coro Rocco monolithic thermoformed curved Corian solid surface installation',
    badge: 'CORO ROCCO™ · ZERO-JOINT SOLID SURFACES',
  },
  {
    id: 'modulo',
    label: '03 / Coro Modulo™',
    title: 'Integrated Spatial Joinery',
    subtitle: 'Continuous Architectural Cabinetry & Storage Systems',
    image: '/images/coro/modulo-interior.jpg',
    alt: 'Coro Modulo continuous architectural joinery and cabinetry system',
    badge: 'CORO MODULO™ · CONTINUOUS JOINERY',
  },
];

const SUB_BRANDS = [
  {
    slug: 'rocco',
    name: 'Coro Rocco™',
    tagline: 'Seamless solid surfaces, built to endure.',
    descriptor: 'Joint-free Corian® curves, sculptural reliefs, and monolithic reception counters.',
    icon: '/images/coro/rocco-mark-light.png',
    href: 'https://coro-nine.vercel.app/',
  },
  {
    slug: 'modulo',
    name: 'Coro Modulo™',
    tagline: 'Built-in furniture, designed as one system.',
    descriptor: 'Wall-to-wall continuous joinery, spatial kitchens, and architectural wardrobes engineered for permanence.',
    icon: '/images/coro/modulo-mark-light.png',
    href: 'https://coro-nine.vercel.app/',
  },
  {
    slug: 'poroso',
    name: 'Coro Poroso™',
    tagline: 'Porous by nature — light and air in quiet movement.',
    descriptor: 'Hook chain, chain mail, and handwoven wire mesh filtering daylight into calm, rhythmic movement.',
    icon: '/images/coro/poroso-mark-light.png',
    href: 'https://coro-nine.vercel.app/',
  },
];

export default function CoroShowcase() {
  const [activeVisualId, setActiveVisualId] = useState<string>('centre');
  const activeVisual = VISUALS.find((v) => v.id === activeVisualId) || VISUALS[0];

  return (
    <section id="coro" className="coro-pavilion">
      {/* Background Architectural Watermark */}
      <div className="coro-watermark-bg" aria-hidden="true">
        <svg viewBox="0 0 1000 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            fill="none"
            stroke="rgba(234, 233, 232, 0.038)"
            strokeWidth="1.5"
            letterSpacing="0.32em"
            fontSize="180"
            fontFamily="'Oswald', sans-serif"
            fontWeight="300"
          >
            CORO
          </text>
        </svg>
      </div>

      <div className="coro-container">
        {/* Section Top Header & Eyebrow */}
        <ScrollReveal>
          <div className="coro-top-bar">
            <div className="coro-index-tag">
              <span className="coro-num">06</span>
              <span className="coro-rule" />
              <span className="coro-label">Sister Atelier &amp; Design Ecosystem</span>
            </div>
            <div className="coro-origin-pill">
              <span className="coro-pulse-dot" />
              <span>Fabrication Foundry: Ace Spaces · Bengaluru</span>
            </div>
          </div>

          <div className="coro-heading-row">
            <h2 className="coro-display-headline">
              A choir of eight disciplines.
              <br />
              <span className="coro-display-italic">One material origin.</span>
            </h2>
            <div className="coro-intro-blurb">
              <p>
                CORO began as an experiential space built entirely from its own materials. Today, it unites
                eight independent crafted disciplines under one architectural language. Ace Spaces provides
                the calibrated DuPont™ Corian® mineral slabs, 5-axis digital thermoforming, and precision joinery
                powering every monolithic surface inside.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Dual-Stage Grid */}
        <div className="coro-stage-grid">
          {/* Left Column: Visual Material Stage */}
          <ScrollReveal delay={80} className="coro-visual-stage">
            <div className="coro-view-tabs" role="tablist" aria-label="Experience Centre visual gallery">
              {VISUALS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={activeVisualId === v.id}
                  className={`coro-tab-btn ${activeVisualId === v.id ? 'active' : ''}`}
                  onClick={() => setActiveVisualId(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="coro-media-frame">
              <img
                src={activeVisual.image}
                alt={activeVisual.alt}
                className="coro-main-img"
                loading="lazy"
              />
              <div className="coro-media-overlay">
                <span className="coro-badge-chip">{activeVisual.badge}</span>
                <div className="coro-caption-box">
                  <strong>{activeVisual.title}</strong>
                  <p>{activeVisual.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="coro-media-footnote">
              <span>Touch &amp; material inspection:</span>
              <p>
                Walk the Bengaluru experience centre and feel the monolithic seams directly. Decisions
                are made with your hands on calibrated Corian®, not a thumbnail swatch.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: Narrative, Sub-Brands & Access */}
          <ScrollReveal delay={160} className="coro-details-stage">
            {/* Coro Lockup & Brand Anchor */}
            <div className="coro-brand-badge-row">
              <div className="coro-lockup-wrapper">
                <img
                  src="/images/coro/coro-mark-frost.png"
                  alt="CORO Crafted Collective"
                  className="coro-frost-mark"
                />
              </div>
              <span className="coro-ecosystem-role">Sub-brand of Ace Spaces</span>
            </div>

            {/* Sub-Brand Architectural Strips */}
            <div className="coro-brands-strip">
              <p className="coro-strip-title">Disciplines Fabricated at Ace Spaces</p>

              {SUB_BRANDS.map((brand) => (
                <a
                  key={brand.slug}
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="coro-brand-item"
                  title={`Explore ${brand.name} at coro-nine.vercel.app`}
                >
                  <div className="coro-item-icon-wrap">
                    <img src={brand.icon} alt="" aria-hidden="true" className="coro-item-icon" />
                  </div>
                  <div className="coro-item-content">
                    <div className="coro-item-header">
                      <strong className="coro-item-name">{brand.name}</strong>
                      <span className="coro-item-tagline">{brand.tagline}</span>
                    </div>
                    <p className="coro-item-desc">{brand.descriptor}</p>
                  </div>
                  <div className="coro-item-arrow" aria-hidden="true">
                    <span>↗</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Atelier Visit Metadata & Contact Details */}
            <div className="coro-visit-meta-grid">
              <div className="coro-meta-col">
                <span className="coro-meta-label">EXPERIENCE ATELIER</span>
                <strong className="coro-meta-val">Bengaluru, India</strong>
                <span className="coro-meta-sub">Mon–Sat · 10 AM – 7 PM</span>
              </div>
              <div className="coro-meta-col">
                <span className="coro-meta-label">SPECIFIER ACCESS</span>
                <strong className="coro-meta-val">Direct Foundry Sourcing</strong>
                <span className="coro-meta-sub">Calibrated Slabs &amp; 5-Axis CNC</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="coro-cta-row">
              <a
                href="https://coro-nine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="coro-btn coro-btn-primary"
              >
                Explore Coro Collective <span>↗</span>
              </a>
              <Link href="/materials" className="coro-btn coro-btn-outline">
                Source Raw Slabs <span>↗</span>
              </Link>
              <Link href="/contact" className="coro-btn coro-btn-ghost">
                Book Atelier Visit <span>→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
