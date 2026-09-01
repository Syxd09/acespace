'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  return (
    <>
      <header className={`site-header ${!isHome ? 'dark-header' : ''}`}>
        <Link href="/" className="wordmark" aria-label="Ace Spaces home">
          <span className="mark">A</span>
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

            <Link href="/contact" onClick={closeMobileMenu} className="mobile-nav-item highlight">
              <span className="mobile-num">06</span>
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
