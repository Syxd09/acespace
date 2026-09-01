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

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header className={`site-header ${!isHome ? 'dark-header' : ''}`}>
      <Link href="/" className="wordmark" aria-label="Ace Spaces home">
        <span className="mark">A</span>
        <span>
          ACE<br />
          <em>SPACES</em>
        </span>
      </Link>

      <nav
        className={`main-nav ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main navigation"
      >
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
          className="menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
        >
          <i />
          <i />
        </button>
      </div>
    </header>
  );
}
