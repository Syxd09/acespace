import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import MaterialGrid from '@/components/MaterialGrid';
import EnquiryForm from '@/components/EnquiryForm';

export default function HomePage() {
  return (
    <main id="top">
      {/* Hero Section */}
      <section className="hero">
        <Image
          src="/assets/hero-ace.png"
          alt="Sculptural ivory architectural surface in a warm modern interior"
          fill
          priority
          sizes="100vw"
          className="hero-image"
          style={{ objectFit: 'cover' }}
        />
        <div className="hero-shade" />
        <ScrollReveal className="hero-content">
          <p className="eyebrow light">Architectural materials / fabrication / India</p>
          <h1>
            Material,
            <br />
            <i>made architectural.</i>
          </h1>
          <p className="hero-copy">Surfaces and forms with the quiet confidence to shape a room.</p>
          <div className="hero-buttons">
            <a className="button button-light" href="#materials">
              Explore materials <span>↘</span>
            </a>
            <Link className="text-link light" href="#projects">
              View projects <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>
        <div className="hero-index">
          <span>01</span>
          <span className="line" />
          <span>04</span>
        </div>
        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <span className="scroll-line" />
        </div>
      </section>

      {/* Practice Intro Section */}
      <section className="intro section-pad">
        <ScrollReveal>
          <div className="section-label">01 / The practice</div>
          <div className="intro-grid">
            <h2>
              We bring material
              <br />
              <i>into focus.</i>
            </h2>
            <div>
              <p className="lead">
                Ace Spaces is a material and fabrication practice for architects, designers and people who care about how a space is made.
              </p>
              <p>
                From the first sample to the final edge, we work with surfaces as a design medium — precise, tactile and made to belong.
              </p>
              <Link className="text-link dark" href="/about">
                About Ace Spaces <span>↗</span>
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
            <Link className="text-link dark" href="/materials#understanding">
              Understand our materials <span>↘</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Fabrication Section */}
      <section id="fabrication" className="fabrication dark-section">
        <div className="fabrication-image" style={{ position: 'relative' }}>
          <Image
            src="/assets/material-macro.png"
            alt="Close texture of a honed ivory mineral surface"
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
          <div className="project-photo photo-one">
            <div className="project-tag">Residential / Bengaluru</div>
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
          <div className="coro-mark">CC</div>
        </ScrollReveal>
        <ScrollReveal>
          <p className="eyebrow">The wider ecosystem</p>
          <h2>
            Beyond
            <br />
            the <i>surface.</i>
          </h2>
          <p>Coro Collective is our sister brand for interiors and spatial design — complete environments, thoughtfully composed.</p>
          <Link className="button button-dark" href="/about#coro">
            Explore Coro Collective <span>↗</span>
          </Link>
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
