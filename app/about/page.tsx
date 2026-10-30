import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import JsonLd from '@/components/JsonLd';
import AboutScrollHandler from '@/components/AboutScrollHandler';
import AboutTenetsViewer from '@/components/AboutTenetsViewer';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteContent } from '@/data/contentStore';
import { defaultAboutContent } from '@/data/contentTypes';

export const metadata: Metadata = {
  title: 'About Us — Studio Philosophy, Craft & DuPont™ Corian® Partnership',
  description:
    'Ace Spaces is a Bengaluru-based architectural fabrication studio and authorized DuPont™ Corian® partner. Precision CNC cutting, thermoforming, and zero-silica mineral surfaces powering projects across India.',
  keywords: [
    'about Ace Spaces',
    'Coro Crafted Collective sister brand',
    'DuPont Corian partner India',
    'architectural solid surface Bengaluru',
    'zero-silica atelier',
    'solid surface fabrication Bangalore',
  ],
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
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Ace Spaces',
    description:
      'Architectural fabrication atelier and DuPont™ Corian® partner in Bengaluru, India.',
    images: ['/images/images/app_commercial_bleached_nuwood.jpg'],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ace Spaces',
  url: 'https://acespacesindia.vercel.app/about',
  description:
    'Ace Spaces is an architectural fabrication studio and authorized DuPont™ Corian® distributor in Bengaluru, India.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Ace Spaces',
    legalName: 'Ace Spaces Private Limited',
    foundingLocation: 'Bengaluru, India',
    knowsAbout: ['DuPont™ Corian® Solid Surface', 'Zero-Silica Mineral Surfaces', '5-Axis CNC Milling', 'Thermoforming'],
    subOrganization: {
      '@type': 'Organization',
      name: 'Coro Crafted Collective',
      description: 'Bespoke spatial interiors and collectible monolithic furniture powered by Ace Spaces.',
    },
  },
};

export default function AboutPage() {
  const siteContent = getSiteContent();
  const about = { ...defaultAboutContent, ...(siteContent?.about || {}) };

  const atelierTeams = [
    {
      role: 'CAD/CAM Engineering',
      focus: 'Digital Unfolding & Toolpaths',
      description: 'Translating architectural 3D models into nested CNC toolpaths, coved rebates, and concealed internal sub-framing.',
    },
    {
      role: 'Master Thermoformers',
      focus: 'Vacuum Forming & Platen Ovens',
      description: 'Heating mineral acrylic to 160°C to form tight 25mm radii, curved reception islands, and fluid flutes over timber bucks.',
    },
    {
      role: 'Precision Joiners',
      focus: 'Invisible Chemical Bonding',
      description: 'Using colour-matched methacrylate bonding systems and custom clamping jigs to create seamless joints with zero visible glue lines.',
    },
    {
      role: 'Finishing & Installation',
      focus: 'Hand-Honing & Site Assembly',
      description: 'Progressive diamond honing (120 to 600-grit) for a light-absorbing matte touch, followed by white-glove delivery and on-site seam blending.',
    },
  ];

  // Resolve team photo or fall back to high-res studio shot
  let familyPhotoSrc: string | null = null;
  if (about.familyPhotoUrl) {
    if (about.familyPhotoUrl.startsWith('data:') || about.familyPhotoUrl.startsWith('http')) {
      familyPhotoSrc = about.familyPhotoUrl;
    } else {
      const localPath = path.join(process.cwd(), 'public', about.familyPhotoUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        familyPhotoSrc = about.familyPhotoUrl;
      }
    }
  }
  if (!familyPhotoSrc) {
    const familyPhotoDir = path.join(process.cwd(), 'public', 'images', 'about');
    const supportedFamilyExts = ['jpg', 'jpeg', 'png', 'webp'];
    for (const ext of supportedFamilyExts) {
      if (fs.existsSync(path.join(familyPhotoDir, `company-family.${ext}`))) {
        familyPhotoSrc = `/images/about/company-family.${ext}`;
        break;
      }
    }
  }

  const studioImageSrc = familyPhotoSrc || '/images/images/app_commercial_bleached_nuwood.jpg';

  return (
    <main className="page-main">
      <AboutScrollHandler />
      <JsonLd data={aboutJsonLd} />

      {/* Split Architectural Hero */}
      <section className="page-split-hero">
        <div>
          <p className="eyebrow anim-fade-up" style={{ marginBottom: '20px' }}>
            About Us / Studio &amp; Lineage
          </p>

          <h1 className="anim-fade-up anim-delay-1" style={{ fontSize: 'clamp(44px, 6.5vw, 96px)', lineHeight: 0.98, margin: '0 0 24px', letterSpacing: '-0.05em' }}>
            Form &amp;
            <br />
            <i>continuity.</i>
          </h1>

          <p className="anim-fade-up anim-delay-2" style={{ fontSize: '17px', lineHeight: 1.65, color: '#4a5249', maxWidth: '520px', marginBottom: '28px' }}>
            We fabricate solid surfaces into seamless architectural fixtures, working directly with architects, interior designers, and creators across India.
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link className="button button-dark" href="#story">
              Our Story <span>↓</span>
            </Link>
            <Link className="text-link" href="/contact">
              Visit Bengaluru Studio <span>↗</span>
            </Link>
          </div>

          <div className="hero-stats-row anim-fade-up anim-delay-3">
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Origin
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>Bengaluru</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Facility
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>15,000 sq.ft</strong>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                Material Standard
              </span>
              <strong style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>0% Silica</strong>
            </div>
          </div>
        </div>

        {/* Hero Architectural Image Frame */}
        <div className="hero-image-frame">
          <Image
            src="/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg"
            alt="Monolithic architectural counter crafted by Ace Spaces"
            fill
            sizes="(max-width: 860px) 100vw, 45vw"
            quality={80}
            decoding="async"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-image-badge">
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
                Studio Focus
              </span>
              <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                Bespoke Monoliths &amp; Joinery
              </strong>
            </div>
            <Link href="#story" className="text-link" style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
              Explore Atelier <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-Navigation Quick Anchor Bar */}
      <nav
        style={{
          display: 'flex',
          gap: 'clamp(14px, 3vw, 36px)',
          padding: '16px 5vw',
          borderBottom: '1px solid var(--line)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--muted)',
        }}
        aria-label="About page sections"
      >
        <a href="#story" style={{ color: 'inherit', textDecoration: 'none' }}>01 / Our Story</a>
        <a href="#tenets" style={{ color: 'inherit', textDecoration: 'none' }}>02 / Craft Disciplines</a>
        <a href="#workshop" style={{ color: 'inherit', textDecoration: 'none' }}>03 / The Workshop</a>
        <a href="#dupont" style={{ color: 'inherit', textDecoration: 'none' }}>04 / DuPont Alliance</a>
        <a href="#studio" style={{ color: 'inherit', textDecoration: 'none' }}>05 / Bengaluru Studio</a>
        <a href="#coro" style={{ color: 'inherit', textDecoration: 'none' }}>06 / Sister Brand</a>
      </nav>

      {/* Section 01: The Architectural Story */}
      <section id="story" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>01 / Origin &amp; Purpose</p>
          </div>

          <div className="about-two-col">
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.04em' }}>
                Surfaces that
                <br />
                <i>outlast trends.</i>
              </h2>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.6, margin: '0 0 24px' }}>
                Founded in Bengaluru to connect architectural vision directly with precision fabrication.
              </p>

              {/* Studio & Team Photo Frame */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 14px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: '#f4f0e8',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={studioImageSrc}
                    alt={familyPhotoSrc ? 'Ace Spaces Founding Team' : 'Ace Spaces Studio & Workshop'}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)', background: '#fff' }}>
                  <strong style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '2px' }}>
                    {familyPhotoSrc ? (about.familyPhotoCaption || 'The Team Behind Ace Spaces') : 'Ace Spaces Studio & Workshop'}
                  </strong>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#656e64', margin: 0 }}>
                    Craftspeople, CAD engineers, and joiners united by a commitment to lasting quality.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '15px', lineHeight: 1.7, color: '#4a5249' }}>
              <p className="lead" style={{ fontSize: '18px', color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
                We believe architectural surfaces should be durable, seamless, and safe to live with.
              </p>
              <p>
                From our stockyard and workshop in Bengaluru, we fabricate genuine DuPont™ Corian® solid surface fixtures directly for architects, interior designers, and builders across India.
              </p>
              <p>
                Because solid surface is non-porous and free of crystalline silica, it creates calm, hygienic spaces—from continuous kitchen islands and coved washplanes to sculptural curved desks.
              </p>
              <div style={{ display: 'flex', gap: '14px', marginTop: '8px', flexWrap: 'wrap' }}>
                <Link className="button button-dark" href="/products">
                  Explore Products <span>↗</span>
                </Link>
                <Link className="text-link" href="/materials" style={{ alignSelf: 'center' }}>
                  Corian® Palette <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Craft Disciplines */}
      <section id="tenets" className="section-pad" style={{ borderBottom: '1px solid var(--line)', background: '#ece8df' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>02 / Craft Disciplines</p>
          </div>

          <div className="about-two-col-wide" style={{ marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, fontWeight: 400, margin: 0, letterSpacing: '-0.04em' }}>
                Principles of
                <br />
                <i>our craft.</i>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#4a5249', margin: 0 }}>
                Every surface, sink, and plinth we craft is guided by four disciplines: invisible chemical fusion, 160°C thermoforming, 5-axis CNC accuracy, and diamond hand honing.
              </p>
            </div>
          </div>

          <AboutTenetsViewer />
        </div>
      </section>

      {/* Cinematic Panoramic Feature Break */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(320px, 45vw, 540px)',
          width: '100%',
          overflow: 'hidden',
          background: '#1a1d19',
        }}
      >
        <Image
          src="/images/images/coriansolidsurface-verdantlaguna-application.jpg"
          alt="Monolithic DuPont™ Corian® surface with continuous joinery"
          fill
          sizes="100vw"
          quality={80}
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20,23,19,0.3) 0%, rgba(20,23,19,0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(32px, 5vw, 64px)',
            color: '#fff',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.65)',
                margin: '0 0 14px',
              }}
            >
              The Monolithic Philosophy
            </p>
            <h3
              style={{
                fontSize: 'clamp(26px, 3.8vw, 44px)',
                lineHeight: 1.15,
                fontWeight: 400,
                color: '#fff',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              A single uninterrupted plane from horizontal worktop to vertical waterfall.
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              DuPont™ Corian® solid surfaces eliminate dirt-trapping grout joints and perimeter gaps, creating calm and monolithic architectural environments.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: The Atelier & Makers */}
      <section id="workshop" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>03 / Workshop &amp; Makers</p>
          </div>

          <div className="about-two-col-team" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
                The hands behind
                <br />
                <i>the surfaces.</i>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#555e54', margin: '0 0 20px' }}>
                Our 15,000 sq.ft facility in Bengaluru operates as an architectural laboratory, where CNC machinery is guided by computational designers, thermoforming specialists, and master joiners.
              </p>
            </div>

            <div className="about-units-grid">
              {atelierTeams.map((team, idx) => (
                <div
                  key={team.role}
                  style={{
                    padding: '22px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                    Unit 0{idx + 1}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>
                    {team.role}
                  </h4>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#7a8479', marginBottom: '8px' }}>
                    {team.focus}
                  </div>
                  <p style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#656e64', margin: 0 }}>
                    {team.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop Visual Feature */}
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '2px',
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            <div
              style={{
                position: 'relative',
                height: 'clamp(260px, 38vw, 440px)',
                width: '100%',
                overflow: 'hidden',
                background: '#ece8df',
              }}
            >
              <Image
                src={about.workshopPhotoUrl || '/images/images/app_residential_calacatta_greige_1.jpg'}
                alt={about.workshopPhotoCaption || 'Ace Spaces fabrication workshop and finished monolithic installation'}
                fill
                sizes="(max-width: 900px) 100vw, 85vw"
                quality={80}
                loading="lazy"
                decoding="async"
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                  Bengaluru Workshop
                </span>
                <strong style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  {about.workshopPhotoCaption || 'Continuous Monolithic Island with Integrated Sub-Surface Sink'}
                </strong>
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#555e54', margin: 0, maxWidth: '440px' }}>
                Fabricated with 45° mitred waterfall ends and seamless invisible joints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Material Foundation & DuPont Alliance */}
      <section
        id="dupont"
        className="section-pad"
        style={{
          position: 'relative',
          borderBottom: '1px solid var(--line)',
          background: '#ece8df',
          scrollMarginTop: '20px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>04 / Material Sourcing</p>
          </div>

          <div className="about-two-col" style={{ marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.04em' }}>
                Our craft.
                <br />
                <i>DuPont™ Corian®.</i>
              </h2>
              <div style={{ padding: '18px 20px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid var(--line)', borderRadius: '2px', marginBottom: '20px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                  Strategic Partnership
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                  Authorized DuPont™ Corian® Quality Network Industrial Partner
                </div>
                <div style={{ fontSize: '12px', color: '#656e64', marginTop: '6px', lineHeight: 1.5 }}>
                  Certified master fabricator and stockist backed by DuPont 10-year installed warranty.
                </div>
              </div>

              {/* Co-Branded Alliance Lockup */}
              <div
                style={{
                  padding: '20px',
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <Image
                  src="/logo/full-logo-transparent.png"
                  alt="Ace Spaces India"
                  width={150}
                  height={48}
                  style={{ height: 'auto', width: '130px', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '16px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>×</span>
                <Image
                  src="/assets/dupont-corian-quality-network-partner.png"
                  alt="DuPont™ Corian® Quality Network Industrial Partner"
                  width={180}
                  height={62}
                  style={{ height: 'auto', width: '160px', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div>
              <p className="lead" style={{ fontSize: '17px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '16px' }}>
                Craftsmanship is only as good as the raw material. Ace Spaces is an authorized <strong>Quality Network Industrial Partner of DuPont™ Corian®</strong>, supplying and fabricating genuine solid surface sheets across India.
              </p>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', marginBottom: '24px' }}>
                Corian® combines natural bauxite mineral (Aluminium Trihydrate) with pure acrylic resin (PMMA). The result is non-porous, completely free of crystalline silica, and repairable in situ. Every sheet we dispatch carries authentic chemical traceability and a 10-year warranty.
              </p>

              {/* 3-Entity Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    01 / Material Origin
                  </span>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>DuPont™ Corian®</h4>
                  <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#656e64', margin: 0 }}>
                    Certified ATH + acrylic chemistry with zero crystalline silica and a 10-year manufacturer warranty.
                  </p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    02 / Fabrication
                  </span>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>Ace Spaces</h4>
                  <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#656e64', margin: 0 }}>
                    The central stockyard, 5-axis CNC routing suite, thermoforming ovens, and on-site assembly team.
                  </p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.85)', border: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                    03 / Spatial Brand
                  </span>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>Coro Crafted Collective</h4>
                  <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#656e64', margin: 0 }}>
                    Our sister spatial studio and collectible furniture label, powered by Ace Spaces materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Studio Headquarters */}
      <section id="studio" className="section-pad" style={{ borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>05 / Bengaluru Studio</p>
          </div>

          <div className="about-two-col-wide">
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.04em' }}>
                Visit our studio
                <br />
                <i>in Bengaluru.</i>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#555e54', margin: '0 0 24px' }}>
                Our unified facility brings together our slab gallery, material sample trays, and fabrication workshop under one roof. Architects and designers are welcome for hands-on material reviews and drawing discussions.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '9px 18px', textDecoration: 'none' }}
                >
                  Open on Google Maps ↗
                </a>
                <Link
                  href="/contact"
                  className="button"
                  style={{ fontSize: '11px', padding: '9px 18px', background: 'transparent', border: '1px solid var(--ink)', textDecoration: 'none' }}
                >
                  Book Studio Visit ↗
                </Link>
              </div>
            </div>

            {/* Studio Info Card */}
            <div style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.75)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                    Unified Studio &amp; Atelier
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                    Ace Spaces &amp; Coro Crafted Collective
                  </h3>
                </div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '4px 10px', background: 'var(--ink)', color: '#fff', borderRadius: '2px', textTransform: 'uppercase' }}>
                  Bengaluru
                </span>
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4a5249', margin: '0 0 20px' }}>
                Bengaluru, Karnataka, India — Design gallery, 20+ calibrated slab library, 5-axis CNC suite, and thermoforming ovens in one address.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                <div>
                  <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
                    Gallery &amp; Slab Library
                  </strong>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#656e64', lineHeight: 1.6 }}>
                    20+ Calibrated Full-Scale Slabs
                    <br />
                    Backlit Translucency Displays
                    <br />
                    Physical Specifier Swatch Trays
                  </div>
                </div>

                <div>
                  <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>
                    Fabrication Atelier
                  </strong>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#656e64', lineHeight: 1.6 }}>
                    5-Axis CNC Precision Milling
                    <br />
                    Vacuum Membrane Thermoforming
                    <br />
                    Direct Pan-India Delivery &amp; Install
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 06: Coro Crafted Collective Callout */}
      <section className="callout about-coro-callout" id="coro">
        <div
          className="coro-brand-showcase"
          style={{
            background: 'rgba(244, 243, 239, 0.72)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(30, 33, 29, 0.22)',
            borderRadius: '4px',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '360px',
            width: '100%',
            margin: '0 auto',
            boxShadow: '0 16px 40px rgba(30, 33, 29, 0.08)',
          }}
        >
          <div style={{ width: '110px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <img
              src="/images/coro-emblem.png"
              alt="Coro Crafted Collective Emblem"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ width: '160px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <img
              src="/images/coro-wordmark.png"
              alt="Coro Crafted Collective Wordmark"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(30, 33, 29, 0.75)', margin: 0 }}>
            Spatial Concepts and Collectible Furniture
            <br />
            <span style={{ color: 'rgba(30, 33, 29, 0.5)', fontSize: '9px' }}>Powered by Ace Spaces</span>
          </p>
        </div>

        <div>
          <p className="eyebrow">Sister Spatial Brand</p>
          <h2>
            Powering
            <br />
            <i>Coro Crafted Collective.</i>
          </h2>
          <p>
            Coro Crafted Collective is our spatial studio and collectible furniture label, creating bespoke residential interiors and sculptural pieces shaped from raw Corian® slabs.
          </p>
          <p style={{ marginTop: '12px', color: '#656e64', fontSize: '14px' }}>
            Independent architects and designers have factory-direct access to the same precision workshop and certified materials that power Coro's work.
          </p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link className="button button-dark" href="/materials">
              Browse Material Palette <span>↗</span>
            </Link>
            <Link className="button" href="/contact" style={{ background: 'transparent', border: '1px solid var(--ink)' }}>
              Start Consultation <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
