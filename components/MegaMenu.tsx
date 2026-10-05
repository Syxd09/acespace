'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export type MegaMenuType = 'materials' | 'colours' | 'products' | 'applications' | 'fabrication' | 'about' | null;

interface MegaMenuProps {
  activeMenu: MegaMenuType;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isScrolled?: boolean;
}

export default function MegaMenu({
  activeMenu,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isScrolled = false,
}: MegaMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onClose();

    const [urlWithoutHash, hash] = href.split('#');
    const [targetPath, queryString] = urlWithoutHash.split('?');

    if (hash) {
      try {
        sessionStorage.setItem('pendingHashScroll', hash);
        (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll = hash;
      } catch {
        // ignore
      }
    }

    if (pathname === targetPath) {
      if (queryString) {
        router.push(href);
      }
      if (hash) {
        e.preventDefault();
        const clean = hash.toLowerCase().trim();
        let el = document.getElementById(clean) || document.querySelector(`[id="${clean}"]`);
        if (!el && (clean === 'dupont' || clean === 'foundation' || clean === 'partnership' || clean === 'alliance')) {
          el =
            document.getElementById('dupont') ||
            document.getElementById('foundation') ||
            document.getElementById('partnership') ||
            document.querySelector('section[id="dupont"]') ||
            document.querySelector('section[id="foundation"]');
        }
        if (el) {
          const lenis = (
            window as unknown as {
              __lenis?: {
                resize: () => void;
                scrollTo: (target: HTMLElement, opts?: unknown) => void;
              };
            }
          ).__lenis;
          if (lenis) {
            try {
              lenis.resize();
            } catch {
              // ignore
            }
            lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          try {
            window.history.pushState(null, '', href);
          } catch {
            // ignore
          }
        }
      }
    }
  };

  if (!activeMenu) return null;

  return (
    <div
      className="mega-menu-overlay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: isScrolled ? '69px' : '83px', // directly below header with 1px subpixel overlap to eliminate any gap
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(233, 232, 226, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(30, 33, 29, 0.16)',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
        zIndex: 99,
        animation: 'megaMenuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        overflow: 'hidden',
        transition: 'top 0.35s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '44px 5vw 48px',
        }}
      >
        {/* ============================================================ */}
        {/* 1. MATERIALS & COLOURS MEGA DROPDOWN */}
        {/* ============================================================ */}
        {(activeMenu === 'materials' || activeMenu === 'colours') && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '5vw',
              alignItems: 'start',
            }}
          >
            {/* Left Nav Columns */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  01 / Architectural Substrates &amp; Palette
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    margin: 0,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Materials, Calibrated Slabs &amp; Colour Palette
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '36px',
                  marginBottom: '36px',
                }}
              >
                {/* Column 1: Substrates & Slabs */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Substrates &amp; Formats
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link href="/materials#architectural-solids" onClick={(e) => handleLinkClick(e, '/materials#architectural-solids')} className="mega-menu-link">
                        <strong>ARCHITECTURAL SOLIDS &amp; VEINED</strong>
                        <small>Monolithic mineral slabs &bull; Directional marble grain</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#terrazzo-aggregates" onClick={(e) => handleLinkClick(e, '/materials#terrazzo-aggregates')} className="mega-menu-link">
                        <strong>TERRAZZO &amp; AGGREGATES</strong>
                        <small>Sedimentary micro-terrazzo &bull; Architectural grinds</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#onyx-translucent" onClick={(e) => handleLinkClick(e, '/materials#onyx-translucent')} className="mega-menu-link">
                        <strong>ONYX &amp; TRANSLUCENT</strong>
                        <small>Translucent mineral fields &bull; Backlit halo effects</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#specs" onClick={(e) => handleLinkClick(e, '/materials#specs')} className="mega-menu-link">
                        <strong>CALIBRATED SLABS &amp; SHEETS</strong>
                        <small>3660 &times; 760mm &bull; 12mm &amp; 19mm zero-porosity core</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Tone & Colour Families */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Curated Palette (20+)
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link href="/materials?family=white#library" onClick={(e) => handleLinkClick(e, '/materials?family=white#library')} className="mega-menu-link">
                        <strong>WHITES &amp; WARM CHALKS</strong>
                        <small>Soft light-diffusing alabaster &bull; Linen undertones</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials?family=grey#library" onClick={(e) => handleLinkClick(e, '/materials?family=grey#library')} className="mega-menu-link">
                        <strong>NATURAL GREIGES &amp; CONCRETE</strong>
                        <small>Understated architectural greys &bull; Earthy neutrals</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials?family=earth#library" onClick={(e) => handleLinkClick(e, '/materials?family=earth#library')} className="mega-menu-link">
                        <strong>WARM EARTH &amp; TERRAS</strong>
                        <small>Geological sand, desert clay &bull; Raw terracotta</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials?family=black#library" onClick={(e) => handleLinkClick(e, '/materials?family=black#library')} className="mega-menu-link">
                        <strong>OBSIDIAN NOIR &amp; INKS</strong>
                        <small>Deep light-absorbing charcoals &bull; Graphic blacks</small>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/materials"
                  onClick={(e) => handleLinkClick(e, '/materials')}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  EXPLORE MATERIALS &amp; PALETTE <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  ORDER STUDIO SAMPLE BOX <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/assets/hero-ace.png"
                  alt="Through-body mineral solid surface monolith in architectural pavilion"
                  fill
                  sizes="400px"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Mineral Substrate
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    Through-Body Mineral Monoliths
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    Non-porous mineral bauxite bonded with high-grade acrylic polymer. Zero-silica through-body colour with seamless continuity.
                  </p>
                </div>
                <Link
                  href="/materials#library"
                  onClick={(e) => handleLinkClick(e, '/materials#library')}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  View Swatch Library <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. PRODUCTS MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'products' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '5vw',
              alignItems: 'start',
            }}
          >
            {/* Left Nav Columns */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  02 / Architectural Fabrication &amp; Fixtures
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    margin: 0,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Products &amp; Precision Systems
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '36px',
                  marginBottom: '36px',
                }}
              >
                {/* Column 1: Sinks & Primary Wet Areas */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Primary Systems
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/materials"
                        onClick={(e) => handleLinkClick(e, '/materials')}
                        className="mega-menu-link"
                      >
                        <strong>CORIAN&reg; MATERIAL</strong>
                        <small>Calibrated slabs &bull; 20+ through-body palette</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/sinks"
                        onClick={(e) => handleLinkClick(e, '/products/sinks')}
                        className="mega-menu-link"
                      >
                        <strong>SINKS</strong>
                        <small>Undermount chemically welded bowls &bull; Zero silicone joints</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/washplanes"
                        onClick={(e) => handleLinkClick(e, '/products/washplanes')}
                        className="mega-menu-link"
                      >
                        <strong>WASHPLANES</strong>
                        <small>Linear sloping planes &bull; Concealed continuous trough drain</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/health-aged-care"
                        onClick={(e) => handleLinkClick(e, '/products/health-aged-care')}
                        className="mega-menu-link"
                      >
                        <strong>HEALTH &amp; AGED CARE SOLUTIONS</strong>
                        <small>Infection-controlled scrub sinks &bull; Accessible DDA vanities</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Benchtops & Architectural Solutions */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Architectural Solutions
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/products/benchtops"
                        onClick={(e) => handleLinkClick(e, '/products/benchtops')}
                        className="mega-menu-link"
                      >
                        <strong>BENCHTOPS</strong>
                        <small>Monolithic islands &bull; Mitred waterfalls &bull; Coved splash</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/basins-vanities"
                        onClick={(e) => handleLinkClick(e, '/products/basins-vanities')}
                        className="mega-menu-link"
                      >
                        <strong>BASINS &amp; VANITIES</strong>
                        <small>Floating cantilever consoles &bull; Seamlessly fused bowls</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/public-bathrooms-eot"
                        onClick={(e) => handleLinkClick(e, '/products/public-bathrooms-eot')}
                        className="mega-menu-link"
                      >
                        <strong>PUBLIC BATHROOMS AND EOT SOLUTIONS</strong>
                        <small>Commercial groom stations &bull; Vandal-resistant wash</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/bespoke"
                        onClick={(e) => handleLinkClick(e, '/products/bespoke')}
                        className="mega-menu-link"
                      >
                        <strong>BESPOKE</strong>
                        <small>3D thermoformed organic volumes &bull; 5-axis CNC</small>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/products"
                  onClick={(e) => handleLinkClick(e, '/products')}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  EXPLORE ALL PRODUCTS <span>↗</span>
                </Link>
                <Link
                  href="/products/design-certainty"
                  onClick={(e) => handleLinkClick(e, '/products/design-certainty')}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  DESIGN CERTAINTY SERVICE <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/images/images/app_residential_artista_mist_1.jpg"
                  alt="Monolithic floating double vanity and seamlessly integrated basins"
                  fill
                  sizes="400px"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Product Systems
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    Monolithic Floating Vanities &amp; Sinks
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    Seamlessly fused washplane basins, 45 deg  mitred waterfall aprons, and bespoke vanities fabricated without silicone seams or grime lines.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={(e) => handleLinkClick(e, '/products')}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  View Product Catalog <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. APPLICATIONS MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'applications' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '5vw',
              alignItems: 'start',
            }}
          >
            {/* Left Nav Columns */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  03 / Spatial Typologies &amp; Architectural Context
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    margin: 0,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Material in Spatial Practice
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '36px',
                  marginBottom: '36px',
                }}
              >
                {/* Column 1: Typologies 01 - 03 & Bespoke Joinery */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Typologies 01 - 03
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/applications/residential"
                        onClick={(e) => handleLinkClick(e, '/applications/residential')}
                        className="mega-menu-link"
                      >
                        <strong>01 / LUXURY RESIDENTIAL</strong>
                        <small>Monolithic islands &bull; Waterfall gables &bull; Coved vanities</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/spiritual"
                        onClick={(e) => handleLinkClick(e, '/applications/spiritual')}
                        className="mega-menu-link"
                      >
                        <strong>02 / SPIRITUAL SANCTUMS</strong>
                        <small>Mandir altars &bull; Backlit translucent jali &bull; Non-porous decks</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/hospitality"
                        onClick={(e) => handleLinkClick(e, '/applications/hospitality')}
                        className="mega-menu-link"
                      >
                        <strong>03 / HOSPITALITY &amp; DINING</strong>
                        <small>Thermoformed bars &bull; Cocktail counters &bull; Monolithic buffets</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#thermoforming"
                        onClick={(e) => handleLinkClick(e, '/fabrication#thermoforming')}
                        className="mega-menu-link"
                      >
                        <strong>07 / BESPOKE JOINERY</strong>
                        <small>3D thermoformed curves &bull; Fluid pods &bull; Sculptural seating</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Typologies 04 - 06 & Specifier Desk */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Typologies 04 - 06
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/applications/healthcare"
                        onClick={(e) => handleLinkClick(e, '/applications/healthcare')}
                        className="mega-menu-link"
                      >
                        <strong>04 / HEALTHCARE &amp; CLINICAL</strong>
                        <small>Surgical scrub bays &bull; NSF/ANSI 51 tops &bull; Zero silicone seams</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/commercial"
                        onClick={(e) => handleLinkClick(e, '/applications/commercial')}
                        className="mega-menu-link"
                      >
                        <strong>05 / COMMERCIAL INTERIORS</strong>
                        <small>Executive boardrooms &bull; Wireless Qi &bull; Continuous wash troughs</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/exterior-cladding"
                        onClick={(e) => handleLinkClick(e, '/applications/exterior-cladding')}
                        className="mega-menu-link"
                      >
                        <strong>06 / EXTERIOR CLADDING</strong>
                        <small>Ventilated rain-screens &bull; Facade cassettes &bull; Entry portals</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#process"
                        onClick={(e) => handleLinkClick(e, '/fabrication#process')}
                        className="mega-menu-link"
                      >
                        <strong>08 / ARCHITECTURAL SPECIFIER</strong>
                        <small>CAD shop drawings &bull; ASTM test data &bull; Certified installation</small>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/applications"
                  onClick={(e) => handleLinkClick(e, '/applications')}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  EXPLORE ALL 6 TYPOLOGIES <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  DISCUSS A PROJECT BRIEF <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg"
                  alt="Monolithic grand reception desk in hospitality interior"
                  fill
                  sizes="400px"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Typologies 01-06
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    Formed Across 6 Typologies
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    From luxury residences and sacred mandir sanctums to high-traffic dining, certified healthcare, workspaces, and exterior cladding.
                  </p>
                </div>
                <Link
                  href="/applications"
                  onClick={(e) => handleLinkClick(e, '/applications')}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  View All Typologies <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. FABRICATION MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'fabrication' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '5vw',
              alignItems: 'start',
            }}
          >
            {/* Left Nav Columns */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  04 / Craft of the Inconspicuous Join
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    margin: 0,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  From Raw Sheet to Finished Space
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '36px',
                  marginBottom: '36px',
                }}
              >
                {/* Column 1: Techniques */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Engineering Methods
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/fabrication#seamless"
                        onClick={(e) => handleLinkClick(e, '/fabrication#seamless')}
                        className="mega-menu-link"
                      >
                        <strong>Seamless Thermo-Welded Joints</strong>
                        <small>Permanent chemical welds stronger than the substrate</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#thermoforming"
                        onClick={(e) => handleLinkClick(e, '/fabrication#thermoforming')}
                        className="mega-menu-link"
                      >
                        <strong>Multi-Radius Thermoforming</strong>
                        <small>Controlled heating to 160 deg C over CNC timber bucks</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#cnc"
                        onClick={(e) => handleLinkClick(e, '/fabrication#cnc')}
                        className="mega-menu-link"
                      >
                        <strong>5-Axis CNC Milling</strong>
                        <small>Sub-millimeter routing, relief branding & Qi cavities</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#edges"
                        onClick={(e) => handleLinkClick(e, '/fabrication#edges')}
                        className="mega-menu-link"
                      >
                        <strong>Integral Coved Junctions</strong>
                        <small>Continuous 10mm radii replacing mould-prone silicone</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Studio Workflow */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Architectural Workflow
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/fabrication#process"
                        onClick={(e) => handleLinkClick(e, '/fabrication#process')}
                        className="mega-menu-link"
                      >
                        <strong>CAD / BIM Shop Drawings</strong>
                        <small>Joint layout plans, seam maps and structural details</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about#locations"
                        onClick={(e) => handleLinkClick(e, '/about#locations')}
                        className="mega-menu-link"
                      >
                        <strong>Bengaluru Fabrication Facility</strong>
                        <small>State-of-the-art precision workshop and clean room</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#honing"
                        onClick={(e) => handleLinkClick(e, '/fabrication#honing')}
                        className="mega-menu-link"
                      >
                        <strong>On-Site Assembly & Honing</strong>
                        <small>Certified master installers finish seams in situ</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about#foundation"
                        onClick={(e) => handleLinkClick(e, '/about#foundation')}
                        className="mega-menu-link"
                      >
                        <strong>Full 10-Year Warranty</strong>
                        <small>Guaranteed against joint separation and delamination</small>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/fabrication"
                  onClick={(e) => handleLinkClick(e, '/fabrication')}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Explore Fabrication Capabilities <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  Submit Architectural Drawings <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/images/images/app_residential_calacatta_greige_2.jpg"
                  alt="Seamless 45-degree mitred waterfall edge and surface join close-up"
                  fill
                  sizes="400px"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Joinery Detail
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    The 45 deg  Mitred Waterfall
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    Hand-dressed acrylic thermo-welds maintain pattern grain continuity from horizontal islands down to finished floor planes.
                  </p>
                </div>
                <Link
                  href="/fabrication#process"
                  onClick={(e) => handleLinkClick(e, '/fabrication#process')}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  See Joinery Craft <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. ABOUT US MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'about' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '5vw',
              alignItems: 'start',
            }}
          >
            {/* Left Nav Columns */}
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  07 / Studio, Heritage &amp; Spatial Philosophy
                </span>
                <h3
                  style={{
                    fontSize: '22px',
                    margin: 0,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  About Us - The Practice &amp; Atelier
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '36px',
                  marginBottom: '36px',
                }}
              >
                {/* Column 1: The Practice */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    The Practice &amp; Philosophy
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link href="/about#story" onClick={(e) => handleLinkClick(e, '/about#story')} className="mega-menu-link">
                        <strong>OUR ARCHITECTURAL STORY</strong>
                        <small>Dissolving seams &bull; Monolithic spatial continuity</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#team" onClick={(e) => handleLinkClick(e, '/about#team')} className="mega-menu-link">
                        <strong>THE ATELIER &amp; CRAFTSMEN</strong>
                        <small>Master joiners, thermoformers &bull; In-house CAD team</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#philosophy" onClick={(e) => handleLinkClick(e, '/about#philosophy')} className="mega-menu-link">
                        <strong>CORE DESIGN INTEGRITY</strong>
                        <small>Radical permanence &bull; Zero-silica safe mineral matrix</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#foundation" onClick={(e) => handleLinkClick(e, '/about#foundation')} className="mega-menu-link">
                        <strong>DUPONT™ QUALITY ALLIANCE</strong>
                        <small>Certified ATH substrate lineage &bull; 10-year warranty</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Studio & Network */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '16px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Atelier &amp; Studio Network
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link href="/about#locations" onClick={(e) => handleLinkClick(e, '/about#locations')} className="mega-menu-link">
                        <strong>BENGALURU HEADQUARTERS</strong>
                        <small>Unified gallery, mockup labs &bull; Precision workshop</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#team" onClick={(e) => handleLinkClick(e, '/about#team')} className="mega-menu-link">
                        <strong>5-AXIS CNC &amp; ARTISAN FINISH</strong>
                        <small>Digital precision paired with master hand-honed craft</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#coro" onClick={(e) => handleLinkClick(e, '/about#coro')} className="mega-menu-link">
                        <strong>THE CORO CONNECTION</strong>
                        <small>Powering Coro Crafted Collective spatial living</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="mega-menu-link">
                        <strong>SCHEDULE STUDIO VISIT</strong>
                        <small>Meet our architects &bull; Review 1:1 scale mockups</small>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  READ ABOUT US <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  VISIT OUR BANGALORE ATELIER <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/images/images/app_commercial_bleached_nuwood.jpg"
                  alt="Ace Spaces architectural studio practice and monolithic craft"
                  fill
                  sizes="400px"
                  quality={70}
                  loading="lazy"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Studio Atelier
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    Form Follows Continuity
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    Architects, digital fabricators, and master joiners. Founded in Bengaluru to dissolve the seams that divide contemporary space.
                  </p>
                </div>
                <Link
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  Explore Practice <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
