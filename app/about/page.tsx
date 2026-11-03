import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'About Us — Studio Philosophy & Craft | Ace Spaces',
  description:
    'Ace Spaces is a Bengaluru-based architectural fabrication atelier and authorized DuPont™ Corian® partner. Precision CNC cutting, thermoforming, and zero-silica mineral surfaces across India.',
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/about',
  },
  openGraph: {
    title: 'About Us — Studio Philosophy & Craft | Ace Spaces',
    description:
      'Architectural fabrication atelier in Bengaluru. Certified DuPont™ Corian® solid surfaces, 5-axis CNC machining, and bespoke joinery.',
    url: 'https://acespacesindia.vercel.app/about',
    images: [
      {
        url: '/images/images/app_commercial_bleached_nuwood.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Studio & Craft',
      },
    ],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ace Spaces',
  url: 'https://acespacesindia.vercel.app/about',
  description:
    'Ace Spaces is an architectural fabrication studio and authorized DuPont™ Corian® partner in Bengaluru, India.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Ace Spaces',
    foundingLocation: 'Bengaluru, India',
    knowsAbout: ['DuPont™ Corian® Solid Surface', 'Zero-Silica Mineral Surfaces', '5-Axis CNC Milling', 'Thermoforming'],
  },
};

export default function AboutPage() {
  const disciplines = [
    {
      num: '01',
      phase: 'Milling',
      title: '5-Axis CNC Routing',
      tagline: 'Nested toolpaths and micro-rebates machined to ±0.18mm.',
      image: '/images/images/app_residential_calacatta_greige_2.jpg',
      spec: '±0.18 mm tolerance',
      metricLabel: 'Tolerance',
    },
    {
      num: '02',
      phase: 'Forming',
      title: '160°C Thermal Forming',
      tagline: 'Mineral sheets vacuum-formed over timber bucks into organic curves.',
      image: '/images/basin-vanity-thermoformed-double.jpg',
      spec: '160°C · 25 mm radii',
      metricLabel: 'Curvature',
    },
    {
      num: '03',
      phase: 'Fusion',
      title: 'Invisible Seam Fusion',
      tagline: 'Color-matched chemical bonding with zero visible glue lines.',
      image: '/images/integrated-sink-installation.jpg',
      spec: '0.0 mm joint · Monolithic',
      metricLabel: 'Joint',
    },
    {
      num: '04',
      phase: 'Honing',
      title: 'Diamond Hand Honing',
      tagline: 'Progressive multi-stage diamond sanding for a glare-free satin touch.',
      image: '/assets/material-macro.png',
      spec: '600 grit · Velvet touch',
      metricLabel: 'Finish',
    },
  ];

  return (
    <main className="page-main">
      <JsonLd data={aboutJsonLd} />

      {/* 01. Hero — Minimal Editorial Opening */}
      <section className="page-split-hero" style={{ marginBottom: '60px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted, #6f786d)',
                fontWeight: 600,
              }}
            >
              01 — Lineage &amp; Studio
            </span>
            <div style={{ width: '60px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
          </div>

          <h1
            style={{
              fontSize: 'clamp(44px, 6.8vw, 96px)',
              lineHeight: 0.96,
              margin: '0 0 24px',
              letterSpacing: '-0.05em',
            }}
          >
            Form &amp;
            <br />
            <i>continuity.</i>
          </h1>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#4a5249',
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            We fabricate solid surfaces into seamless architectural fixtures, working directly with architects, interior designers, and creators across India.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            <Link className="button button-dark" href="#philosophy">
              Studio Philosophy <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Bengaluru Atelier <span>↗</span>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))' }}>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Origin
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                Bengaluru, India
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Material
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                0% Crystalline Silica
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                Network
              </span>
              <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                DuPont™ Quality Partner
              </strong>
            </div>
          </div>
        </div>

        {/* Clean Architectural Photo */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/app_residential_calacatta_greige_1.jpg"
            alt="Monolithic architectural counter crafted by Ace Spaces"
            fill
            sizes="(max-width: 860px) 100vw, 45vw"
            quality={80}
            decoding="async"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </section>

      {/* 02. Philosophy Section */}
      <section id="philosophy" style={{ borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))', margin: '110px 0', paddingTop: '80px' }}>
        <ScrollReveal className="about-two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                02 — Philosophy
              </span>
              <div style={{ width: '80px', height: '1px', background: 'var(--line)' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.03em', margin: '0 0 24px' }}>
              Surfaces that
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>outlast trends.</i>
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#4a5249', margin: 0 }}>
              We believe architectural surfaces should be durable, seamless, and safe to live with. Because solid surface is non-porous and free of crystalline silica, it creates calm, hygienic spaces — from continuous kitchen islands and coved washplanes to curved reception desks.
            </p>
          </div>

          <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(30, 33, 29, 0.08)' }}>
            <Image
              src="/images/about/company-family.jpg"
              alt="Ace Spaces Studio & Workshop Team"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </ScrollReveal>
      </section>

      {/* 03. Craft Disciplines — Monograph Rail */}
      <section id="disciplines" style={{ margin: '110px 0 130px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '52px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span
                style={{
                  fontFamily: 'Urbanist, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6f786d)',
                  fontWeight: 600,
                }}
              >
                03 — Workshop Disciplines
              </span>
              <div style={{ width: '80px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0 }}>
              Principles of
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>our craft.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: '#555e54', maxWidth: '440px', margin: 0, lineHeight: 1.65 }}>
            Every fixture moves through four calibrated disciplines in our Bengaluru atelier.
          </p>
        </ScrollReveal>

        <div className="sequence-monograph-rail">
          {disciplines.map((step) => (
            <article key={step.num} className="sequence-step-item">
              <div className="sequence-step-header">
                <span className="sequence-step-num">{step.num}</span>
                <span className="sequence-step-divider">—</span>
                <span className="sequence-step-phase">{step.phase}</span>
                <div className="sequence-step-line" />
              </div>

              <div className="sequence-image-frame">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  className="sequence-image"
                />
                <div className="sequence-image-spec">
                  <span>{step.spec}</span>
                </div>
              </div>

              <div className="sequence-step-body">
                <h3 className="sequence-step-title">{step.title}</h3>
                <p className="sequence-step-desc">{step.tagline}</p>
                <div className="sequence-step-footer">
                  <span className="sequence-footer-label">{step.metricLabel}</span>
                  <span className="sequence-footer-val">{step.spec.split('·')[0].trim()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04. DuPont Strategic Alliance & Material Lineage */}
      <section id="dupont" style={{ borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))', margin: '110px 0 130px', paddingTop: '80px' }}>
        <ScrollReveal className="section-head" style={{ marginBottom: '52px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span
                style={{
                  fontFamily: 'Urbanist, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6f786d)',
                  fontWeight: 600,
                }}
              >
                04 — Material Lineage
              </span>
              <div style={{ flex: 1, maxWidth: '180px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.03em', margin: 0 }}>
              Authorized DuPont™ Corian®
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>Quality Network Partner.</i>
            </h2>
          </div>
          <div style={{ maxWidth: '460px' }}>
            <p style={{ fontSize: '15px', color: '#555e54', margin: '0 0 24px', lineHeight: 1.65 }}>
              Craftsmanship is only as enduring as the raw material. Ace Spaces is an authorized Quality Network Industrial Partner of DuPont™ Corian®, supplying and fabricating genuine through-body mineral slabs across India with a 10-year manufacturer warranty.
            </p>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link className="button button-dark" href="/materials">
                Explore Material Palette <span>↗</span>
              </Link>
              <Link className="text-link" href="/contact">
                Certificate of Authenticity <span>↗</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* 3-Entity Lineage Rail: Ace Spaces · DuPont Quality Network · Coro Crafted Collective */}
        <div className="lineage-monograph-rail">
          {/* 01. Ace Spaces */}
          <Link href="/fabrication" className="lineage-monograph-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">01</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Fabrication Atelier</span>
              <div className="sequence-step-line" />
            </div>

            <div className="lineage-image-frame">
              <Image
                src="/logo/full-logo-transparent.png"
                alt="Ace Spaces"
                width={200}
                height={60}
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="sequence-image-spec">
                <span>Bengaluru · 5-Axis CNC</span>
              </div>
            </div>

            <div className="sequence-step-body">
              <h3 className="sequence-step-title">Ace Spaces</h3>
              <p className="sequence-step-desc">
                Central raw material stockyard and 5-axis digital CNC fabrication atelier.
              </p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Discipline</span>
                <span className="sequence-footer-val">Atelier &amp; Stockyard</span>
              </div>
            </div>
          </Link>

          {/* 02. DuPont Quality Network */}
          <Link href="/materials" className="lineage-monograph-item">
            <div className="sequence-step-header">
              <span className="sequence-step-num">02</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Certified Network</span>
              <div className="sequence-step-line" />
            </div>

            <div className="lineage-image-frame">
              <Image
                src="/assets/dupont-corian-quality-network-partner.png"
                alt="DuPont™ Corian® Quality Network Industrial Partner"
                width={220}
                height={65}
                style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="sequence-image-spec">
                <span>10-Year DuPont™ Warranty</span>
              </div>
            </div>

            <div className="sequence-step-body">
              <h3 className="sequence-step-title">DuPont™ Corian®</h3>
              <p className="sequence-step-desc">
                Authorized Quality Network Industrial Partner backed by a 10-year warranty.
              </p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Endorsement</span>
                <span className="sequence-footer-val">Quality Network Partner</span>
              </div>
            </div>
          </Link>

          {/* 03. Coro Crafted Collective */}
          <a
            href="https://coro-nine.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="lineage-monograph-item"
          >
            <div className="sequence-step-header">
              <span className="sequence-step-num">03</span>
              <span className="sequence-step-divider">—</span>
              <span className="sequence-step-phase">Spatial Practice</span>
              <div className="sequence-step-line" />
            </div>

            <div className="lineage-image-frame">
              <Image
                src="/images/coro/coro-lockup-navy.png"
                alt="Coro Crafted Collective"
                width={190}
                height={60}
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              />
              <div className="sequence-image-spec">
                <span>Bengaluru Experience Centre</span>
              </div>
            </div>

            <div className="sequence-step-body">
              <h3 className="sequence-step-title">Coro Crafted Collective</h3>
              <p className="sequence-step-desc">
                Sister spatial architecture studio and collectible monolithic furniture practice.
              </p>
              <div className="sequence-step-footer">
                <span className="sequence-footer-label">Ecosystem</span>
                <span className="sequence-footer-val">Spatial Living Practice</span>
              </div>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
