import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import MaterialGrid from '@/components/MaterialGrid';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSlider from '@/components/HeroSlider';
import CoroShowcase from '@/components/CoroShowcase';
import { getSiteContent } from '@/data/contentStore';
import {
  generateWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
} from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Ace Spaces - The Source of Material, Where Spaces Begin | DuPont™ Corian® Partner',
  description:
    'Primary architectural raw material hub, authorized DuPont™ Corian® distributor, and digital fabrication workshop in Bengaluru, India. Powering Coro Crafted Collective with calibrated through-body mineral slabs, 5-axis CNC machining, and bespoke thermoforming.',
  alternates: {
    canonical: 'https://acespacesindia.vercel.app',
  },
  openGraph: {
    title: 'Ace Spaces - Material, made architectural',
    description:
      'The foundational material hub for architects, designers, and bespoke fabricators in Bengaluru, India. Certified DuPont™ Corian® solid surfaces and 5-axis CNC precision.',
    url: 'https://acespacesindia.vercel.app',
    images: [
      {
        url: '/assets/hero-ace.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces - Architectural Solid Surface Foundry',
      },
    ],
  },
};

export default function HomePage() {
  const siteContent = getSiteContent();
  const whatsappNumber = siteContent.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const displayPhone = siteContent.studioContact?.whatsappDisplay || DEFAULT_WHATSAPP_DISPLAY;
  const whatsappUrl = generateWhatsAppUrl(whatsappNumber);

  return (
    <main>
      {/* Dynamic 5-Second Sliding Architectural Hero */}
      <HeroSlider />

      {/* 01. Intro Section — Minimal Editorial */}
      <section className="intro section-pad">
        <ScrollReveal className="intro-grid">
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
                01 — Foundation
              </span>
              <div style={{ width: '80px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)', lineHeight: 1.04, letterSpacing: '-0.03em', margin: 0 }}>
              Quiet presence.
              <br />
              Lasting <i>character.</i>
            </h2>
          </div>

          <div style={{ maxWidth: '460px' }}>
            <p className="lead" style={{ fontSize: '18px', lineHeight: 1.65, color: '#3c423b', marginBottom: '24px' }}>
              Surfaces shape how architecture is felt. As an authorized DuPont™ Corian® partner in Bengaluru, Ace Spaces fabricates seamless solid surfaces crafted to outlast trends.
            </p>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                  Alliance
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                  DuPont™ Corian® Quality Network
                </span>
              </div>
              <div>
                <span style={{ fontSize: '10px', fontFamily: 'Urbanist, sans-serif', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '3px' }}>
                  Atelier
                </span>
                <span style={{ fontSize: '13px', color: '#5d665c' }}>
                  Bengaluru · Pan-India Dispatch
                </span>
              </div>
            </div>

            <div>
              <Link className="text-link dark" href="/about">
                Studio Philosophy <span>↗</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

            {/* Featured Collections: Materials & Colours */}
      <MaterialGrid />

      {/* Statement Section */}
      <section className="statement section-pad">
        <ScrollReveal>
          <p className="eyebrow">The Ace Spaces approach</p>
          <h2>
            Good material is felt
            <br />
            before it is <i>named.</i>
          </h2>
          <div className="statement-bottom">
            <span>Material / form / detail</span>
            <Link className="text-link dark" href="/materials">
              Understand our materials <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Fabrication Section */}
      <section id="fabrication" className="fabrication dark-section">
        <ScrollReveal variant="image" className="fabrication-image" style={{ position: 'relative' }}>
          <Image
            src="/images/images/app_residential_calacatta_greige_2.jpg"
            alt="Close-up of seamless 45-degree mitred waterfall edge and surface join"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            quality={75}
            loading="lazy"
            decoding="async"
            style={{ objectFit: 'cover' }}
          />
        </ScrollReveal>
        <ScrollReveal delay={120} className="fabrication-copy section-pad">
          <p className="eyebrow light">02 / From sheet to space</p>
          <h2>
            Made for the
            <br />
            <i>way you imagine.</i>
          </h2>
          <p>
            We fabricate solid surfaces into seamless architectural fixtures—from kitchen monoliths to curved washplanes.
          </p>
          <div className="process">
            <div>
              <span>01</span>Cut
            </div>
            <div>
              <span>02</span>Join
            </div>
            <div>
              <span>03</span>Form
            </div>
            <div>
              <span>04</span>Finish
            </div>
          </div>
          <Link className="button button-light" href="/fabrication">
            Explore fabrication <span>↗</span>
          </Link>
        </ScrollReveal>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects section-pad">
        <ScrollReveal className="section-head">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>
              Spaces with
              <br />
              <i>something to say.</i>
            </h2>
          </div>
          <Link className="text-link dark" href="/projects">
            View project archive <span>↗</span>
          </Link>
        </ScrollReveal>

        <div className="project-feature">
          <ScrollReveal variant="image" className="project-photo photo-one" style={{ position: 'relative' }}>
            <Image
              src="/images/images/app_residential_calacatta_greige_1.jpg"
              alt="Calacatta Greige monolithic kitchen island"
              fill
              sizes="(max-width: 800px) 100vw, 55vw"
              quality={75}
              loading="lazy"
              decoding="async"
              style={{ objectFit: 'cover' }}
            />
            <div className="project-tag" style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 2 }}>Residential / Bengaluru</div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="project-info">
            <p className="eyebrow">01 / Private residence</p>
            <h3>
              A quieter kind
              <br />
              of <i>luxury.</i>
            </h3>
            <p>A continuous mineral surface moves from island to wall, letting the architecture speak in one measured gesture.</p>
            <div className="project-meta">
              <span>Material</span>
              <strong>Calacatta Greige</strong>
              <span>Application</span>
              <strong>Kitchen island / backsplash</strong>
            </div>
            <Link className="text-link dark" href="/projects/private-residence">
              View case study <span>↗</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="applications section-pad">
        <ScrollReveal>
          <div className="section-label">03 / Applications</div>
          <div className="application-intro">
            <h2>
              One material.
              <br />
              <i>Many lives.</i>
            </h2>
            <p>From the intimacy of a vanity to the energy of a hospitality space, we help materials find their right expression.</p>
          </div>
        </ScrollReveal>
        <div className="app-list">
          <ScrollReveal delay={40}>
            <Link href="/applications/residential">
              <span>01</span>
              <strong>Residential Architecture</strong>
              <em>↗</em>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Link href="/applications/hospitality">
              <span>02</span>
              <strong>Hospitality & Cultural</strong>
              <em>↗</em>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <Link href="/applications/commercial">
              <span>03</span>
              <strong>Commercial Architecture</strong>
              <em>↗</em>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={220}>
            <Link href="/applications/retail">
              <span>04</span>
              <strong>Retail & Brand Portals</strong>
              <em>↗</em>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <Link href="/applications/healthcare">
              <span>05</span>
              <strong>Hospitals & Healthcare</strong>
              <em>↗</em>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Coro Crafted Collective Ecosystem Section */}
      <CoroShowcase />

      {/* Journal Section */}
      <section id="journal" className="journal section-pad">
        <ScrollReveal className="section-head">
          <div>
            <p className="eyebrow">From the journal</p>
            <h2>
              Notes on making
              <br />
              <i>space matter.</i>
            </h2>
          </div>
          <Link className="text-link dark" href="/journal">
            Read the journal <span>↗</span>
          </Link>
        </ScrollReveal>
        <div className="journal-grid">
          <ScrollReveal className="journal-card" delay={80}>
            <div className="journal-image journal-one" />
            <p className="eyebrow">Material knowledge / 06 min read</p>
            <h3>
              The edge is where
              <br />
              material becomes architecture.
            </h3>
            <Link href="/journal#edge">Read article ↗</Link>
          </ScrollReveal>
          <ScrollReveal className="journal-card" delay={180}>
            <div className="journal-image journal-two" />
            <p className="eyebrow">Fabrication / 04 min read</p>
            <h3>
              On the beauty of
              <br />
              the seamless join.
            </h3>
            <Link href="/journal#join">Read article ↗</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 07. Enquiry Section — Minimal Atelier Desk */}
      <section className="enquiry dark-section section-pad">
        <ScrollReveal className="enquiry-copy" style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'Urbanist, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 600,
              }}
            >
              07 — Atelier Consultation
            </span>
            <div style={{ width: '80px', height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          </div>
          <h2>
            Have a space
            <br />
            in <i>mind?</i>
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)', margin: '16px 0 32px' }}>
            Tell us about your project. Our Bengaluru engineering team assists with material selection, joinery calculations, and physical mockups.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="button button-light" href="/contact">
              Start Project Brief <span>↗</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-outline-glass"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Direct WhatsApp Desk</span>
              <span>↗</span>
            </a>
          </div>
        </ScrollReveal>

        <div className="enquiry-side" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)' }}>
            DuPont™ Corian® Quality Network
            <br />
            15,000 sq.ft Bengaluru Facility
            <br />
            Direct: {displayPhone}
          </span>
        </div>
      </section>
    </main>
  );
}
