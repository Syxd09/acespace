'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSampleShortlist } from '@/context/SampleContext';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { shortlist, toggleTray } = useSampleShortlist();

  useEffect(() => {
    setMobileOpen(false);
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

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Determine active visual mode
  const isLightText = isHome && !isScrolled;

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
            ? isScrolled
              ? 'rgba(233, 232, 226, 0.92)'
              : 'transparent'
            : 'rgba(233, 232, 226, 0.94)',
          backdropFilter: (isHome && !isScrolled) ? 'none' : 'blur(16px)',
          WebkitBackdropFilter: (isHome && !isScrolled) ? 'none' : 'blur(16px)',
          borderBottom: isHome
            ? isScrolled
              ? '1px solid rgba(30, 33, 29, 0.14)'
              : '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid var(--line)',
          color: isLightText ? '#fff' : 'var(--ink)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.4s ease, height 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        <Link href="/" className="wordmark" aria-label="Ace Spaces home">
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

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/materials">
            <span className="nav-num">01</span>
            <strong>Materials</strong>
            <small>Collections & surfaces</small>
            <b>↗</b>
          </Link>
          <Link href="/applications">
            <span className="nav-num">02</span>
            <strong>Applications</strong>
            <small>Material in context</small>
            <b>↗</b>
          </Link>
          <Link href="/fabrication">
            <span className="nav-num">03</span>
            <strong>Fabrication</strong>
            <small>From sheet to space</small>
            <b>↗</b>
          </Link>
          <Link href="/projects">
            <span className="nav-num">04</span>
            <strong>Projects</strong>
            <small>Selected work</small>
            <b>↗</b>
          </Link>
          <Link href="/journal">
            <span className="nav-num">05</span>
            <strong>Journal</strong>
            <small>Notes on making</small>
            <b>↗</b>
          </Link>
        </nav>

        <div className="header-actions">
          {/* Sample Shortlist Header Button */}
          <button
            type="button"
            onClick={toggleTray}
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
            <span>Sample Tray</span>
          </button>

          <a className="coro-link" href="#coro">
            Coro Collective <span>↗</span>
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

      {/* Warm Architectural Mobile Navigation Drawer */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMobileMenu();
        }}
      >
        <div className="mobile-drawer">
          <div className="mobile-drawer-top">
            <Link href="/" onClick={closeMobileMenu} className="wordmark">
              <span className="mark">A</span>
              <span>
                ACE<br />
                <em>SPACES</em>
              </span>
            </Link>
            <button className="mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
              ×
            </button>
          </div>

          <div className="mobile-drawer-label">01 / Navigation</div>

          <nav className="mobile-nav-links">
            <Link href="/materials" onClick={closeMobileMenu} className="mobile-nav-item">
              <span className="mobile-num">01</span>
              <div className="mobile-nav-text">
                <strong>Materials</strong>
                <small>Collections & surfaces</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>

            <Link href="/applications" onClick={closeMobileMenu} className="mobile-nav-item">
              <span className="mobile-num">02</span>
              <div className="mobile-nav-text">
                <strong>Applications</strong>
                <small>Material in context</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>

            <Link href="/fabrication" onClick={closeMobileMenu} className="mobile-nav-item">
              <span className="mobile-num">03</span>
              <div className="mobile-nav-text">
                <strong>Fabrication</strong>
                <small>From sheet to space</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>

            <Link href="/projects" onClick={closeMobileMenu} className="mobile-nav-item">
              <span className="mobile-num">04</span>
              <div className="mobile-nav-text">
                <strong>Projects</strong>
                <small>Selected work</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>

            <Link href="/journal" onClick={closeMobileMenu} className="mobile-nav-item">
              <span className="mobile-num">05</span>
              <div className="mobile-nav-text">
                <strong>Journal</strong>
                <small>Notes on making</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>

            {/* Mobile Sample Tray Link */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                toggleTray();
              }}
              className="mobile-nav-item"
              style={{ width: '100%', textAlign: 'left', background: 'none', borderLeft: 'none', borderRight: 'none' }}
            >
              <span className="mobile-num">06</span>
              <div className="mobile-nav-text">
                <strong>Sample Tray ({shortlist.length})</strong>
                <small>Order complimentary studio specimen box</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </button>

            <Link href="/contact" onClick={closeMobileMenu} className="mobile-nav-item highlight">
              <span className="mobile-num">07</span>
              <div className="mobile-nav-text">
                <strong>Contact Practice</strong>
                <small>Start a conversation & consultation</small>
              </div>
              <span className="mobile-arrow">↗</span>
            </Link>
          </nav>

          <div className="mobile-drawer-footer">
            <div className="mobile-coro-badge">
              <small>Part of the ecosystem</small>
              <strong>Coro Collective ↗</strong>
            </div>
            <p className="mobile-footer-location">Bengaluru / India — Architectural Materials & Fabrication</p>
          </div>
        </div>
      </div>
    </>
  );
}
