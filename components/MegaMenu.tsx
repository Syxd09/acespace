'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type MegaMenuType = 'materials' | 'colours' | 'applications' | 'fabrication' | null;

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
        {/* 1. MATERIALS MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'materials' && (
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
                  01 / Architectural Mineral Substrates
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
                  Collections & Engineered Surfaces
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
                {/* Column 1: Collections */}
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
                    Curated Series
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Alto Collection</strong>
                        <small>Subtle directional veining & marble movement</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Noma Collection</strong>
                        <small>Monolithic pure whites & mineral chalks</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Obsidian Collection</strong>
                        <small>Deep tactile charcoals & matte monoliths</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Strata Collection</strong>
                        <small>Sedimentary micro-terrazzos & earth textures</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Lumen Collection</strong>
                        <small>Translucent mineral fields for warm backlighting</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Specifications & Substrates */}
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
                    Formats & Performance
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Through-Body Solid Surfaces</strong>
                        <small>100% homogeneous & non-porous across depth</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Sheet Formats: 12mm & 20mm</strong>
                        <small>3680 × 760mm calibrated architectural slabs</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication#edges"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Edge Profiles & Bullnosing</strong>
                        <small>Mitred waterfalls, bevelled & pencil round profiles</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/fabrication"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Thermoforming Substrates</strong>
                        <small>Capable of bending down to 75mm internal radii</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Certified Care & Maintenance</strong>
                        <small>Easily renewable and scuff-resistant in the field</small>
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
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Explore All Materials <span>↗</span>
                </Link>
                <Link
                  href="/collections/colours"
                  onClick={onClose}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  View Full Palette <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div
              style={{
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/assets/applications/calacatta-greige-kitchen.jpg"
                  alt="Through-body mineral kitchen island in Calacatta Greige"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(23, 26, 23, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Mineral Feature
                </span>
              </div>
              <div style={{ padding: '22px 24px', background: 'var(--paper)', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                  Homogeneous Mineral Matrix
                </strong>
                <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                  Natural bauxite mineral and acrylic polymer chemically bonded to eliminate joints, grout lines, and bacterial absorption.
                </p>
                <Link
                  href="/materials/alto-bianco-vein"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px' }}
                >
                  View Alto Series <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. COLOURS MEGA DROPDOWN */}
        {/* ============================================================ */}
        {activeMenu === 'colours' && (
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
                  02 / Curated Architectural Palette
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
                  Color Families & Light Integration
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
                {/* Column 1: Families */}
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
                    Tone Families
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li>
                      <Link
                        href="/collections/colours?family=white"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Pure Whites & Alabasters</strong>
                        <small>Soft light-diffusing chalks and luminous ivories</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/colours?family=veined"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Veined & Directional Marbles</strong>
                        <small>Organic veining patterns with fluid character</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/colours?family=grey"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Greiges & Neutral Minerals</strong>
                        <small>Understated warm greys for quiet living</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/colours?family=earth"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Warm Terras & Earth Sediments</strong>
                        <small>Geological terracotta, sage and sand pigments</small>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/colours?family=black"
                        onClick={onClose}
                        className="mega-menu-link"
                      >
                        <strong>Deep Obsidian & Inks</strong>
                        <small>Monolithic light-absorbing deep charcoals</small>
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Popular Architectural Swatches with Real Colour Dots */}
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
                    Key Architectural Swatches
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>
                      <Link
                        href="/materials/alto-bianco-vein"
                        onClick={onClose}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--ink)' }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#eae7df', border: '1px solid var(--line)', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Alto / Ivory Vein</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Veined • Satin Honed</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials/noma-white-chalk"
                        onClick={onClose}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--ink)' }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f5f4ef', border: '1px solid var(--line)', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Noma / White Chalk</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Solid • Ultra-Matte</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials/alto-fior-di-bosco"
                        onClick={onClose}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--ink)' }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#5d5a56', border: '1px solid var(--line)', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Alto / Fior di Bosco</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Veined • Tactile Graphite</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials/strata-terrazzo-ash"
                        onClick={onClose}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--ink)' }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#cfcac0', border: '1px solid var(--line)', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Strata / Terrazzo Ash</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Mineral • Micro-aggregate</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/materials/terra-sage"
                        onClick={onClose}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--ink)' }}
                      >
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#737a6b', border: '1px solid var(--line)', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block' }}>Terra / Sage</strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Textured • Earth Pigment</span>
                        </div>
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
                  href="/collections/colours"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '11px', padding: '10px 20px' }}
                >
                  Browse All 20+ Colours <span>↗</span>
                </Link>
                <Link
                  href="/materials"
                  onClick={onClose}
                  className="text-link"
                  style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}
                >
                  Order Physical Swatch Box <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Right Feature Card */}
            <div
              style={{
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/assets/materials/css-stonecrest-smoke-sheet.jpg"
                  alt="Raw architectural sheet of Stonecrest Smoke solid surface"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(233, 232, 226, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--ink)',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Palette Insight
                </span>
              </div>
              <div style={{ padding: '22px 24px', background: 'var(--paper)', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                  Low-Reflectivity Light Response
                </strong>
                <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                  Formulated to catch warm indirect lighting without glare, preserving depth across changing times of day.
                </p>
                <Link
                  href="/collections/colours"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px' }}
                >
                  Filter Colours <span>↗</span>
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
            <div
              style={{
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/assets/applications/stonecrest-smoke-hotel-lobby.jpg"
                  alt="Monolithic grand reception desk in hospitality interior"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(23, 26, 23, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Typology Focus
                </span>
              </div>
              <div style={{ padding: '22px 24px', background: 'var(--paper)', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                  Sculptural Hospitality Monoliths
                </strong>
                <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                  High-traffic reception desks, bars, and lobbies engineered with internal steel sub-frames and stain immunity.
                </p>
                <Link
                  href="/applications/hospitality"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px' }}
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
            <div
              style={{
                background: '#dcd7cd',
                border: '1px solid var(--line)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ position: 'relative', height: '260px', width: '100%' }}>
                <Image
                  src="/assets/applications/calacatta-greige-kitchen-detail.jpg"
                  alt="Seamless 45-degree mitred waterfall edge and surface join close-up"
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(23, 26, 23, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Joinery Detail
                </span>
              </div>
              <div style={{ padding: '22px 24px', background: 'var(--paper)', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '6px' }}>
                  The 45° Mitred Waterfall
                </strong>
                <p style={{ margin: '0 0 16px', fontSize: '13px', lineHeight: 1.6, color: '#4a5249' }}>
                  Hand-dressed acrylic thermo-welds maintain pattern grain continuity from horizontal islands down to finished floor planes.
                </p>
                <Link
                  href="/fabrication"
                  onClick={onClose}
                  className="button button-dark"
                  style={{ fontSize: '10px', padding: '8px 16px' }}
                >
                  See Joinery Craft <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
