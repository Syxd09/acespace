import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MaterialGrid from '@/components/MaterialGrid';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSlider from '@/components/HeroSlider';

export default function HomePage() {
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
          <div>
            <p className="lead">
              Surfaces carry the light and the silence of a room. As the parent company and primary raw material provider, we develop solid surfaces and mineral substrates that reward touch and outlast time.
            </p>
            <p>
              We are the direct material source for architects, interior designers, and bespoke builders — as well as the foundational source powering Coro Collective. Full-dimension slabs, custom sheets, and precision workshop fabrication.
            </p>
            <div>
              <Link className="text-link dark" href="/about">
                Read our studio approach <span>↗</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Materials Section */}
      <section id="materials" className="materials section-pad">
        <ScrollReveal className="section-head">
          <div>
            <p className="eyebrow">Material library</p>
            <h2>
              Collections for
              <br />
              <i>considered spaces.</i>
            </h2>
          </div>
          <Link className="button button-dark" href="/materials">
            View all materials <span>↗</span>
          </Link>
        </ScrollReveal>

        <MaterialGrid />
      </section>

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
          <Link href="/applications#residential">
            <span>01</span>
            <strong>Residential</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications#hospitality">
            <span>02</span>
            <strong>Hospitality</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications#commercial">
            <span>03</span>
            <strong>Commercial</strong>
            <em>↗</em>
          </Link>
          <Link href="/applications#custom">
            <span>04</span>
            <strong>Custom architecture</strong>
            <em>↗</em>
          </Link>
        </div>
      </section>

      {/* Coro Collective Ecosystem Section */}
      <section id="coro" className="coro section-pad">
        <ScrollReveal>
          <div style={{ textAlign: 'center' }}>
            <div className="coro-mark">CC</div>
            <div style={{ marginTop: '16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(30,33,29,0.7)' }}>
              Ecosystem Studio
            </div>
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
          <Link className="button button-light" href="/contact">
            Start a project <span>↗</span>
          </Link>
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
          </span>
        </div>
      </section>
    </main>
  );
}
