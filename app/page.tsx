import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import MaterialGrid from '@/components/MaterialGrid';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSlider from '@/components/HeroSlider';
import { getSiteContent } from '@/data/contentStore';
import {
  generateWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
} from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Ace Spaces — The Source of Material, Where Spaces Begin | DuPont™ Corian® Partner',
  description:
    'Primary architectural raw material hub, authorized DuPont™ Corian® distributor, and digital fabrication workshop in Bengaluru, India. Powering Coro Collective with calibrated through-body mineral slabs, 5-axis CNC machining, and bespoke thermoforming.',
  alternates: {
    canonical: 'https://acespacesindia.vercel.app',
  },
  openGraph: {
    title: 'Ace Spaces — Material, made architectural',
    description:
      'The foundational material hub for architects, designers, and bespoke fabricators in Bengaluru, India. Certified DuPont™ Corian® solid surfaces and 5-axis CNC precision.',
    url: 'https://acespacesindia.vercel.app',
    images: [
      {
        url: '/assets/hero-ace.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces — Architectural Solid Surface Foundry',
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

      {/* Intro Section */}
      <section className="intro section-pad">
        <div className="section-label">01 / Foundation</div>
        <ScrollReveal className="intro-grid">
          <h2>
            Quiet presence.
            <br />
            Lasting <i>character.</i>
          </h2>
          <div style={{ maxWidth: '480px' }}>
            <p className="lead" style={{ maxWidth: '100%', marginBottom: '20px' }}>
              Surfaces carry the light and the silence of a room. As the parent company and authorized partner for <strong>DuPont™ Corian®</strong>, Ace Spaces develops solid surfaces and mineral substrates that reward touch and outlast time.
            </p>
            <p style={{ maxWidth: '100%', marginBottom: '26px' }}>
              Operating our central stockyard and precision workshop in Bangalore, we are the direct material source for architects and designers across India — powering Coro Collective with full-dimension slabs, bespoke thermoforming, and precision fabrication.
            </p>

            {/* Architectural Credential Strip */}
            <div
              style={{
                padding: '16px 0',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
                marginBottom: '30px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '14px 20px',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '3px',
                  }}
                >
                  Strategic Alliance
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                  Authorized DuPont™ Corian® Partner
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '3px',
                  }}
                >
                  Central Hub
                </span>
                <span style={{ fontSize: '13px', color: '#5d665c' }}>
                  Bangalore Stockyard · Pan-India
                </span>
              </div>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: '3px',
                  }}
                >
                  Direct Studio Desk
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
                  WhatsApp {displayPhone} ↗
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link className="text-link dark" href="/about" style={{ marginTop: 0 }}>
                Read our studio approach <span>↗</span>
              </Link>
              <Link className="text-link dark" href="/about#dupont" style={{ marginTop: 0, color: 'var(--muted)' }}>
                DuPont™ Partnership <span>↗</span>
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
        <div className="fabrication-image" style={{ position: 'relative' }}>
          <Image
            src="/assets/applications/calacatta-greige-kitchen-detail.jpg"
            alt="Close-up of seamless 45-degree mitred waterfall edge and surface join"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="fabrication-copy section-pad">
          <p className="eyebrow light">02 / From sheet to space</p>
          <h2>
            Made for the
            <br />
            <i>way you imagine.</i>
          </h2>
          <p>
            We shape solid surfaces into seamless, sculptural and deeply considered architectural elements — with craft at every scale.
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
        </div>
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

        <ScrollReveal className="project-feature">
          <div className="project-photo photo-one" style={{ position: 'relative' }}>
            <Image
              src="/assets/applications/calacatta-greige-kitchen.jpg"
              alt="Calacatta Greige monolithic kitchen island"
              fill
              sizes="(max-width: 800px) 100vw, 55vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="project-tag" style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 2 }}>Residential / Bengaluru</div>
          </div>
          <div className="project-info">
            <p className="eyebrow">01 / Private residence</p>
            <h3>
              A quieter kind
              <br />
              of <i>luxury.</i>
            </h3>
            <p>A continuous mineral surface moves from island to wall, letting the architecture speak in one measured gesture.</p>
            <div className="project-meta">
              <span>Material</span>
              <strong>Alto / Ivory Vein</strong>
              <span>Application</span>
              <strong>Kitchen island / backsplash</strong>
            </div>
            <Link className="text-link dark" href="/projects/private-residence">
              View case study <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Applications Section */}
      <section id="applications" className="applications section-pad">
        <div className="section-label">03 / Applications</div>
        <div className="application-intro">
          <h2>
            One material.
            <br />
            <i>Many lives.</i>
          </h2>
          <p>From the intimacy of a vanity to the energy of a hospitality space, we help materials find their right expression.</p>
        </div>
        <div className="app-list">
          <Link href="/applications/residential">
            <span>01</span>
            <strong>Residential Architecture</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications/hospitality">
            <span>02</span>
            <strong>Hospitality & Cultural</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications/commercial">
            <span>03</span>
            <strong>Commercial Architecture</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications/retail">
            <span>04</span>
            <strong>Retail & Brand Portals</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications/healthcare">
            <span>05</span>
            <strong>Hospitals & Healthcare</strong>
            <em>↗</em>
          </Link>
        </div>
      </section>

      {/* Coro Collective Ecosystem Section */}
      <section id="coro" className="coro section-pad">
        <ScrollReveal>
          <div
            className="coro-brand-showcase"
            style={{
              background: 'rgba(244, 243, 239, 0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(30, 33, 29, 0.22)',
              borderRadius: '4px',
              padding: 'clamp(28px, 3.5vw, 44px) clamp(22px, 3vw, 36px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '420px',
              margin: '0 auto',
              boxShadow: '0 20px 50px rgba(30, 33, 29, 0.09)',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Official Coro Geometric Emblem */}
            <div
              style={{
                width: '140px',
                height: '170px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <img
                src="/images/coro-emblem.png"
                alt="Coro Collective Emblem"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'contrast(1.05)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>

            {/* Official Coro Geometric Wordmark */}
            <div
              style={{
                width: '190px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <img
                src="/images/coro-wordmark.png"
                alt="Coro Collective Wordmark"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Subtle Divider */}
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(30, 33, 29, 0.25)',
                margin: '8px 0 16px',
              }}
            />

            {/* Studio Identity Description */}
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(30, 33, 29, 0.85)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Spatial Concepts · Monolithic Interiors
              <br />
              <span style={{ color: 'rgba(30, 33, 29, 0.55)', fontSize: '10px' }}>
                Powered by Ace Spaces Foundry
              </span>
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ink)', display: 'inline-block' }}></span>
            Parent Company &amp; Material Source
          </p>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1.05, margin: '16px 0 24px' }}>
            The source where
            <br />
            Coro Collective <i>begins.</i>
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(30,33,29,0.9)', marginBottom: '16px' }}>
            Ace Spaces is the parent company and the foundational material source behind Coro Collective. While Coro conceives complete, finished interior environments, every monolithic surface, mineral slab, and seamless join originates from the Ace Spaces raw material library.
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(30,33,29,0.75)', marginBottom: '32px' }}>
            We supply the very same architectural-grade raw materials directly to independent architects, interior designers, and contractors for their own bespoke projects.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link className="button button-dark" href="/materials">
              Source Raw Materials <span>↗</span>
            </Link>
            <Link className="button button-light" href="/about#coro" style={{ border: '1px solid var(--ink)', background: 'rgba(255,255,255,0.75)' }}>
              Understand Ecosystem <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

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
          <ScrollReveal className="journal-card">
            <div className="journal-image journal-one" />
            <p className="eyebrow">Material knowledge / 06 min read</p>
            <h3>
              The edge is where
              <br />
              material becomes architecture.
            </h3>
            <Link href="/journal#edge">Read article ↗</Link>
          </ScrollReveal>
          <ScrollReveal className="journal-card">
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

      {/* Enquiry Section */}
      <section className="enquiry dark-section section-pad">
        <div className="enquiry-copy">
          <p className="eyebrow light">Start a conversation</p>
          <h2>
            Have a space
            <br />
            in <i>mind?</i>
          </h2>
          <p>Tell us what you are imagining. We will bring the right material perspective.</p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '24px' }}>
            <Link className="button button-light" href="/contact">
              Start a project <span>↗</span>
            </Link>

            {/* Direct WhatsApp Consultation CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button-outline-glass"
              title="Connect directly with our Bangalore Material Specifier Desk on WhatsApp"
            >
              <span className="live-pulse" />
              <svg className="wa-svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Material Desk</span>
              <span className="arrow">↗</span>
            </a>
          </div>

          {/* Quick WhatsApp Consultation Chips */}
          <div style={{ marginTop: '22px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(242, 240, 234, 0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', width: '100%' }}>
              Quick Specifier Inquiries:
            </span>
            <a
              href={generateWhatsAppUrl(whatsappNumber, 'Hello Ace Spaces Studio, I would like to request physical material specimen samples for my project specification.')}
              target="_blank"
              rel="noopener noreferrer"
              className="specifier-chip"
            >
              Request Material Samples <span>↗</span>
            </a>
            <a
              href={generateWhatsAppUrl(whatsappNumber, 'Hello Ace Spaces Studio, I have architectural drawings / CAD files ready and would like a fabrication & material quotation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="specifier-chip"
            >
              Share CAD / Drawings <span>↗</span>
            </a>
            <a
              href={generateWhatsAppUrl(whatsappNumber, 'Hello Ace Spaces Studio, I would like to inquire about full-slab sheet dimensions, pricing, and current stockyard inventory in Bangalore.')}
              target="_blank"
              rel="noopener noreferrer"
              className="specifier-chip"
            >
              Slab Specs & Pricing <span>↗</span>
            </a>
          </div>
        </div>
        <div className="enquiry-side">
          01
          <br />
          <span>
            Material consultation
            <br />
            Fabrication
            <br />
            Project support
            <br />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '10px', color: 'rgba(242, 240, 234, 0.85)', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#73c991', boxShadow: '0 0 6px rgba(115, 201, 145, 0.6)', display: 'inline-block' }} />
              Direct: {displayPhone}
            </span>
          </span>
        </div>
      </section>
    </main>
  );
}
