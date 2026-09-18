'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSampleShortlist } from '@/context/SampleContext';
import { useSiteContent } from '@/context/SiteContentContext';
import MegaMenu, { MegaMenuType } from '@/components/MegaMenu';
import { generateWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuType>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const isHome = pathname === '/';
  const { shortlist, toggleTray } = useSampleShortlist();
  const { content } = useSiteContent();

  const whatsappNumber = content.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  // Handle scroll detection for sticky navbar background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock on mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mega menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnterNav = (menu: MegaMenuType) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMegaMenu(menu);
  };

  const handleMouseLeaveNav = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const isLightText = isHome && !isScrolled && !activeMegaMenu;

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Hide the consumer site header completely on the admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`site-header ${isScrolled ? 'scrolled' : ''} ${!isHome ? 'subpage-header' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          height: isScrolled ? '70px' : '84px',
          background: isHome
            ? (isScrolled || activeMegaMenu)
              ? 'rgba(233, 232, 226, 0.96)'
              : 'transparent'
            : 'rgba(233, 232, 226, 0.96)',
          backdropFilter: (isHome && !isScrolled && !activeMegaMenu) ? 'none' : 'blur(16px)',
          WebkitBackdropFilter: (isHome && !isScrolled && !activeMegaMenu) ? 'none' : 'blur(16px)',
          borderBottom: isHome
            ? (isScrolled || activeMegaMenu)
              ? '1px solid rgba(30, 33, 29, 0.14)'
              : '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid var(--line)',
          color: isLightText ? '#fff' : 'var(--ink)',
          boxShadow: (isScrolled || activeMegaMenu) ? '0 10px 30px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.35s ease, height 0.35s ease, border-color 0.35s ease, color 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        <Link href="/" className="wordmark" aria-label="Ace Spaces home" onClick={() => setActiveMegaMenu(null)}>
          <span
            className="mark"
            style={{
              borderColor: 'currentColor',
              transition: 'border-color 0.4s ease',
            }}
          >
            A
          </span>
          <span>
            ACE<br />
            <em>SPACES</em>
          </span>
        </Link>

        {/* Desktop Main Navigation with Dropdown Triggers */}
        <nav
          className="main-nav"
          aria-label="Main navigation"
          onMouseLeave={handleMouseLeaveNav}
        >
          {/* 01. Materials & Colours */}
          <div
            className={`nav-item-wrapper ${activeMegaMenu === 'materials' || activeMegaMenu === 'colours' ? 'nav-item-active' : ''}`}
            onMouseEnter={() => handleMouseEnterNav('materials')}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              href="/materials"
              className={isLinkActive('/materials') || isLinkActive('/collections/colours') ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span className="nav-num">01</span>
              <strong>Materials &amp; Colours</strong>
              <small>Substrates, slabs &amp; palette</small>
              <span className="nav-chevron">▼</span>
              <b>↗</b>
            </Link>
          </div>

          {/* 02. Products */}
          <div
            className={`nav-item-wrapper ${activeMegaMenu === 'products' ? 'nav-item-active' : ''}`}
            onMouseEnter={() => handleMouseEnterNav('products')}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              href="/products"
              className={isLinkActive('/products') ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span className="nav-num">02</span>
              <strong>Products</strong>
              <small>Sinks, benchtops &amp; vanities</small>
              <span className="nav-chevron">▼</span>
              <b>↗</b>
            </Link>
          </div>

          {/* 03. Applications */}
          <div
            className={`nav-item-wrapper ${activeMegaMenu === 'applications' ? 'nav-item-active' : ''}`}
            onMouseEnter={() => handleMouseEnterNav('applications')}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              href="/applications"
              className={isLinkActive('/applications') ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span className="nav-num">03</span>
              <strong>Applications</strong>
              <small>Material in context</small>
              <span className="nav-chevron">▼</span>
              <b>↗</b>
            </Link>
          </div>

          {/* 04. Fabrication */}
          <div
            className={`nav-item-wrapper ${activeMegaMenu === 'fabrication' ? 'nav-item-active' : ''}`}
            onMouseEnter={() => handleMouseEnterNav('fabrication')}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              href="/fabrication"
              className={isLinkActive('/fabrication') ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span className="nav-num">04</span>
              <strong>Fabrication</strong>
              <small>From sheet to space</small>
              <span className="nav-chevron">▼</span>
              <b>↗</b>
            </Link>
          </div>

          {/* 05. Projects */}
          <Link
            href="/projects"
            className={isLinkActive('/projects') ? 'active' : ''}
            onMouseEnter={() => handleMouseEnterNav(null)}
          >
            <span className="nav-num">05</span>
            <strong>Projects</strong>
            <small>Selected work</small>
            <b>↗</b>
          </Link>

          {/* 06. Journal */}
          <Link
            href="/journal"
            className={isLinkActive('/journal') ? 'active' : ''}
            onMouseEnter={() => handleMouseEnterNav(null)}
          >
            <span className="nav-num">06</span>
            <strong>Journal</strong>
            <small>Notes on making</small>
            <b>↗</b>
          </Link>

          {/* 07. About Us */}
          <div
            className={`nav-item-wrapper ${activeMegaMenu === 'about' ? 'nav-item-active' : ''}`}
            onMouseEnter={() => handleMouseEnterNav('about')}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <Link
              href="/about"
              className={isLinkActive('/about') ? 'active' : ''}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span className="nav-num">07</span>
              <strong>About Us</strong>
              <small>Studio, philosophy &amp; team</small>
              <span className="nav-chevron">▼</span>
              <b>↗</b>
            </Link>
          </div>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Sample Shortlist Header Button */}
          <button
            type="button"
            onClick={toggleTray}
            className="sample-tray-btn"
            style={{
              background: isLightText ? 'rgba(255,255,255,0.1)' : 'rgba(30,33,29,0.06)',
              border: '1px solid currentColor',
              padding: '6px 14px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '10px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              className="sample-tray-count"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: isLightText ? '#fff' : 'var(--ink)',
                color: isLightText ? 'var(--ink)' : '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '10px',
                fontWeight: 700,
                transition: 'all 0.3s ease',
              }}
            >
              {shortlist.length}
            </span>
            <span className="sample-tray-label">
              <span className="tray-full">Sample Tray</span>
              <span className="tray-short">Tray</span>
            </span>
          </button>

          {/* WhatsApp Direct Advisory Button */}
          <a
            href={generateWhatsAppUrl(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat directly with our Bangalore Material Specifier Desk on WhatsApp"
            className="header-whatsapp-btn"
            style={{
              background: isLightText ? 'rgba(255,255,255,0.08)' : 'rgba(30,33,29,0.05)',
              border: '1px solid currentColor',
              padding: '6px 13px',
              borderRadius: '100px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '10px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#73c991',
                boxShadow: '0 0 8px rgba(115, 201, 145, 0.7)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
            <b style={{ fontWeight: 400, opacity: 0.7 }}>↗</b>
          </a>

          <a className="coro-link" href="#coro" title="Ace Spaces is the parent company and material source for Coro Collective">
            Source for Coro <span>↗</span>
          </a>
          <button
            className={`menu-toggle ${mobileOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      {/* Mega-Menu Dropdown Panel */}
      <MegaMenu
        activeMenu={activeMegaMenu}
        isScrolled={isScrolled}
        onClose={() => setActiveMegaMenu(null)}
        onMouseEnter={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeaveNav}
      />

      {/* Warm Architectural Mobile Navigation Drawer */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}
        aria-label="Mobile menu"
        aria-hidden={!mobileOpen}
      >
        <div className="drawer-header">
          <span className="drawer-eyebrow">EXPLORE ACE SPACES</span>
          <button
            className="drawer-close"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <div className="drawer-brand-note">
          <span className="drawer-mono-label">SOURCE & PARENT COMPANY</span>
          <p>
            Ace Spaces is the raw material origin and architectural engineering house for Coro Collective.
          </p>
        </div>

        {/* Direct WhatsApp Studio Mobile Card */}
        <div style={{ margin: '14px 0 18px' }}>
          <a
            href={generateWhatsAppUrl(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#141713',
              color: '#f4f3ef',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '4px',
              padding: '12px 14px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(115, 201, 145, 0.15)',
                  border: '1px solid rgba(115, 201, 145, 0.35)',
                  color: '#73c991',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  WhatsApp Studio Line
                </div>
                <div style={{ fontSize: '10px', color: '#9da79d', fontFamily: 'DM Mono, monospace' }}>
                  Direct Material Advisory · Bengaluru
                </div>
              </div>
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#73c991' }}>Chat ↗</span>
          </a>
        </div>

        <nav className="drawer-nav">
          <Link href="/materials" onClick={closeMobileMenu} className={isLinkActive('/materials') || isLinkActive('/collections/colours') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">01</span>
            <div className="drawer-link-text">
              <strong>Materials &amp; Colours</strong>
              <small>Substrates, slabs &amp; 20+ architectural colour swatches</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/products" onClick={closeMobileMenu} className={isLinkActive('/products') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">02</span>
            <div className="drawer-link-text">
              <strong>Products</strong>
              <small>Sinks, benchtops, washplanes, vanities &amp; bespoke fixtures</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/applications" onClick={closeMobileMenu} className={isLinkActive('/applications') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">03</span>
            <div className="drawer-link-text">
              <strong>Applications</strong>
              <small>Residential, hospitality, commercial &amp; clinical spaces</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/fabrication" onClick={closeMobileMenu} className={isLinkActive('/fabrication') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">04</span>
            <div className="drawer-link-text">
              <strong>Fabrication</strong>
              <small>Thermoforming, 5-axis CNC &amp; seamless joining</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/projects" onClick={closeMobileMenu} className={isLinkActive('/projects') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">05</span>
            <div className="drawer-link-text">
              <strong>Projects</strong>
              <small>Selected architectural case studies</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/journal" onClick={closeMobileMenu} className={isLinkActive('/journal') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">06</span>
            <div className="drawer-link-text">
              <strong>Journal</strong>
              <small>Notes on making &amp; materiality</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/about" onClick={closeMobileMenu} className={isLinkActive('/about') ? 'drawer-link active' : 'drawer-link'}>
            <span className="drawer-num">07</span>
            <div className="drawer-link-text">
              <strong>About Us</strong>
              <small>Studio philosophy, craftspeople, vision &amp; Bengaluru atelier</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>

          <Link href="/contact" onClick={closeMobileMenu} className="drawer-link drawer-contact-link">
            <span className="drawer-num">08</span>
            <div className="drawer-link-text">
              <strong>Start a Project</strong>
              <small>Consultation, shop drawings &amp; material specification</small>
            </div>
            <span className="drawer-arrow">↗</span>
          </Link>
        </nav>

        <div className="drawer-footer">
          {/* Mobile WhatsApp Quick Action */}
          <a
            href={generateWhatsAppUrl(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(37, 211, 102, 0.08)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              borderRadius: '6px',
              marginBottom: '16px',
              textDecoration: 'none',
              color: 'var(--ink)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#73c991',
                  boxShadow: '0 0 8px rgba(115, 201, 145, 0.6)',
                  flexShrink: 0,
                }}
              />
              <div>
                <strong style={{ fontSize: '12px', display: 'block', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  WhatsApp Studio Line
                </strong>
                <small style={{ fontSize: '11px', color: '#6e766c' }}>
                  Direct Specifier Advisory · Bangalore
                </small>
              </div>
            </div>
            <span style={{ color: '#73c991', fontWeight: 600, fontSize: '14px' }}>↗</span>
          </a>

          <div className="drawer-coro-box">
            <span className="drawer-mono-label">Ecosystem Relationship</span>
            <p>
              Ace Spaces provides through-body mineral sheets, custom thermoforming, and joint fabrication to Coro Collective projects.
            </p>
          </div>

          <div className="drawer-meta-row">
            <span>© 2026 Ace Spaces</span>
            <span>Bengaluru / India</span>
          </div>
        </div>
      </aside>
    </>
  );
}
