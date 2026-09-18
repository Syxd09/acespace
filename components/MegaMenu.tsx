'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
              <div style={{ marginBottom: '24px' }}>
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
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24px',
                  marginBottom: '28px',
                }}
              >
                {/* Column 1: Core Substrates */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Core Substrates
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/materials#substrates" onClick={onClose} className="mega-menu-link">
                        <strong>Noma Solids</strong>
                        <small>Pure monolithic mineral chalks</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#substrates" onClick={onClose} className="mega-menu-link">
                        <strong>Alto Veined</strong>
                        <small>Directional fluid marble movement</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#substrates" onClick={onClose} className="mega-menu-link">
                        <strong>Strata Textures</strong>
                        <small>Sedimentary micro-terrazzo aggregates</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#substrates" onClick={onClose} className="mega-menu-link">
                        <strong>Lumen Optics</strong>
                        <small>Translucent fields for backlit halos</small>
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
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Colour Families (20+)
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/materials#library" onClick={onClose} className="mega-menu-link">
                        <strong>Whites &amp; Chalk</strong>
                        <small>Soft light-diffusing chalks &amp; alabaster</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#library" onClick={onClose} className="mega-menu-link">
                        <strong>Linen &amp; Warm Creams</strong>
                        <small>Tactile, calming natural linen hues</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#library" onClick={onClose} className="mega-menu-link">
                        <strong>Greiges &amp; Concrete</strong>
                        <small>Understated architectural grey tones</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#library" onClick={onClose} className="mega-menu-link">
                        <strong>Warm Earth &amp; Terras</strong>
                        <small>Geological sand, clay &amp; terracotta</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials#library" onClick={onClose} className="mega-menu-link">
                        <strong>Obsidian Noir &amp; Inks</strong>
                        <small>Deep light-absorbing dark charcoals</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Formats & Performance */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Calibrated Slabs
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/materials" onClick={onClose} className="mega-menu-link">
                        <strong>Full Slabs: 3660 × 760mm</strong>
                        <small>Calibrated architectural sheets</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/materials" onClick={onClose} className="mega-menu-link">
                        <strong>Thickness: 12mm &amp; 19mm</strong>
                        <small>Zero-porosity homogeneous core</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/fabrication" onClick={onClose} className="mega-menu-link">
                        <strong>Thermoforming Substrates</strong>
                        <small>Curve down to 75mm organic radii</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/fabrication#edges" onClick={onClose} className="mega-menu-link">
                        <strong>Inconspicuous Seams</strong>
                        <small>Jointless monolithic installations</small>
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
                  paddingTop: '16px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <Link
                  href="/materials"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Explore Materials &amp; Palette <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  Order Studio Sample Box <span>↗</span>
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
                    Two-thirds natural mineral bauxite bonded with high-grade acrylic polymer. 100% non-porous, zero-silica through-body colour with seamless continuity.
                  </p>
                </div>
                <Link
                  href="/materials#library"
                  onClick={onClose}
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
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>CORIAN&reg; MATERIAL</strong>
                        <small>Calibrated slabs &bull; 20+ through-body palette</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/sinks"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>SINKS</strong>
                        <small>Undermount chemically welded bowls &bull; Zero silicone joints</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/washplanes"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>WASHPLANES</strong>
                        <small>Linear sloping planes &bull; Concealed continuous trough drain</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/health-aged-care"
                        onClick={onClose}
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
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>BENCHTOPS</strong>
                        <small>Monolithic islands &bull; Mitred waterfalls &bull; Coved splash</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/basins-vanities"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>BASINS &amp; VANITIES</strong>
                        <small>Floating cantilever consoles &bull; Seamlessly fused bowls</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/public-bathrooms-eot"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>PUBLIC BATHROOMS AND EOT SOLUTIONS</strong>
                        <small>Commercial groom stations &bull; Vandal-resistant wash</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/bespoke"
                        onClick={onClose}
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
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  EXPLORE ALL PRODUCTS <span>↗</span>
                </Link>
                <Link
                  href="/products/design-certainty"
                  onClick={onClose}
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
                  src="/assets/applications/artista-mist-bathroom.jpg"
                  alt="Monolithic floating double vanity and seamlessly integrated basins"
                  fill
                  sizes="400px"
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
                    Seamlessly fused washplane basins, 45° mitred waterfall aprons, and bespoke vanities fabricated without silicone seams or grime lines.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={onClose}
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
                  03 / Spatial Typologies & Architectural Context
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
                {/* Column 1: Spatial Sectors */}
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
                    Architectural Sectors
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/applications/residential"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sector 01: Residential Architecture</strong>
                        <small>Kitchen islands, continuous gables & vanities</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/hospitality"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sector 02: Hospitality & Dining</strong>
                        <small>Curved reception desks, cocktail bars & suites</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/commercial"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sector 03: Commercial & Workplaces</strong>
                        <small>Boardrooms, wireless charging & wash troughs</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/retail"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sector 04: Retail & Experience Centres</strong>
                        <small>Display plinths, point-of-sale & brand portals</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/healthcare"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sector 05: Hospitals & Healthcare</strong>
                        <small>Hygienic scrub sinks, clinical operatory & non-porous surfaces</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Fabricated Elements */}
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
                    Bespoke Fabrications
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/applications/residential"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Monolithic Kitchen Islands</strong>
                        <small>Mitred 45° waterfalls with zero silicones</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/hospitality"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Backlit Translucent Cocktail Bars</strong>
                        <small>Diffused sub-surface ambient illumination</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/commercial"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Continuous Washroom Troughs</strong>
                        <small>Multi-user seamless basins with sloped drains</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/retail"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Curved Wall Cladding & Portals</strong>
                        <small>Thermoformed 3D architectural envelopes</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/applications/healthcare"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Zero-Silicone Integrated Sinks</strong>
                        <small>Chemical thermo-welding eliminates mould traps</small>
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
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Explore All Applications <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  Discuss a Project Brief <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/assets/applications/stonecrest-smoke-hotel-lobby.jpg"
                  alt="Monolithic grand reception desk in hospitality interior"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Typology Focus
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    Sculptural Hospitality Monoliths
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    High-traffic reception desks, bars, and lobbies engineered with internal steel sub-frames and stain immunity.
                  </p>
                </div>
                <Link
                  href="/applications/hospitality"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px', alignSelf: 'flex-start' }}
                >
                  View Hospitality Case <span>↗</span>
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
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Seamless Thermo-Welded Joints</strong>
                        <small>Permanent chemical welds stronger than the substrate</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Multi-Radius Thermoforming</strong>
                        <small>Controlled heating to 160°C over CNC timber bucks</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>5-Axis CNC Milling</strong>
                        <small>Sub-millimeter routing, relief branding & Qi cavities</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
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
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>CAD / BIM Shop Drawings</strong>
                        <small>Joint layout plans, seam maps and structural details</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Bengaluru Fabrication Facility</strong>
                        <small>State-of-the-art precision workshop and clean room</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>On-Site Assembly & Honing</strong>
                        <small>Certified master installers finish seams in situ</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
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
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Explore Fabrication Capabilities <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
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
                  src="/assets/applications/calacatta-greige-kitchen-detail.jpg"
                  alt="Seamless 45-degree mitred waterfall edge and surface join close-up"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span className="mega-menu-badge">
                  Joinery Detail
                </span>
              </div>
              <div className="mega-menu-feature-body">
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                    The 45° Mitred Waterfall
                  </strong>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                    Hand-dressed acrylic thermo-welds maintain pattern grain continuity from horizontal islands down to finished floor planes.
                  </p>
                </div>
                <Link
                  href="/fabrication"
                  onClick={onClose}
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
                  About Us — The Practice &amp; Atelier
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '28px',
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
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    The Practice
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/about#story" onClick={onClose} className="mega-menu-link">
                        <strong>Our Architectural Story</strong>
                        <small>Dissolving seams in modern space</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#philosophy" onClick={onClose} className="mega-menu-link">
                        <strong>Design Philosophy</strong>
                        <small>Monolithic continuity &amp; tactile honesty</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#team" onClick={onClose} className="mega-menu-link">
                        <strong>The Atelier &amp; Craftsmen</strong>
                        <small>Joiners, thermoformers &amp; CAD modelers</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#philosophy" onClick={onClose} className="mega-menu-link">
                        <strong>Core Studio Values</strong>
                        <small>Radical permanence &amp; zero-silica safety</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Craft & Standards */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Craft &amp; Standards
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/about#team" onClick={onClose} className="mega-menu-link">
                        <strong>Robot Meets Artisan Hand</strong>
                        <small>5-axis CNC paired with hand-honed edges</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#philosophy" onClick={onClose} className="mega-menu-link">
                        <strong>Zero-Silica Integrity</strong>
                        <small>Non-hazardous mineral matrix for health</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/fabrication" onClick={onClose} className="mega-menu-link">
                        <strong>Seamless Chemistry</strong>
                        <small>Molecularly fused inconspicuous joints</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#foundation" onClick={onClose} className="mega-menu-link">
                        <strong>DuPont™ Alliance</strong>
                        <small>Certified ATH substrate lineage &amp; warranty</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Studio & Network */}
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      display: 'block',
                      marginBottom: '14px',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    Atelier &amp; Network
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link href="/about#locations" onClick={onClose} className="mega-menu-link">
                        <strong>Indiranagar Gallery</strong>
                        <small>Tactile specifier gallery in Bangalore</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#locations" onClick={onClose} className="mega-menu-link">
                        <strong>15,000 sq.ft Workshop</strong>
                        <small>Hoskote industrial corridor facility</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#coro" onClick={onClose} className="mega-menu-link">
                        <strong>The Coro Connection</strong>
                        <small>Powering Coro Collective spatial living</small>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" onClick={onClose} className="mega-menu-link">
                        <strong>Schedule Studio Visit</strong>
                        <small>Meet our architects &amp; examine mockups</small>
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
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Read About Us <span>↗</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  Visit Our Bangalore Atelier <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div className="mega-menu-feature-card">
              <div className="mega-menu-feature-image">
                <Image
                  src="/assets/applications/excavage-education.jpg"
                  alt="Ace Spaces architectural studio practice and monolithic craft"
                  fill
                  sizes="400px"
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
                    We are architects, digital fabricators, and master joiners. Founded in Bengaluru to dissolve the seams that divide contemporary space.
                  </p>
                </div>
                <Link
                  href="/about"
                  onClick={onClose}
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
