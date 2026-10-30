'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);

  // Manual scroll restoration to prevent browser scroll flicker
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsTransitioning(true);

      // Check if there is an intended hash target
      let hash = window.location.hash ? window.location.hash.substring(1) : '';
      if (!hash) {
        try {
          const stored =
            sessionStorage.getItem('pendingHashScroll') ||
            (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll;
          if (stored) hash = stored.replace(/^#/, '');
        } catch {
          // ignore
        }
      }

      // Scroll new page to top immediately only if no hash target is intended
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis?.scrollTo(0, { immediate: true });
      }

      setDisplayChildren(children);

      const timer = setTimeout(() => {
        setIsTransitioning(false);

        if (hash) {
          const clean = hash.toLowerCase().trim();
          let el = document.getElementById(clean) || document.querySelector(`[id="${clean}"]`);
          if (el) {
            const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: unknown) => void } }).__lenis;
            if (lenis) {
              lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.0 });
            } else {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }, 160);

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      id="main-content"
      tabIndex={-1}
      className={`page-content-wrapper ${isTransitioning ? 'page-transitioning' : 'page-ready'}`}
      style={{
        opacity: isTransitioning ? 0.88 : 1,
        transform: isTransitioning ? 'translateY(4px)' : 'translateY(0)',
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
      }}
    >
      {displayChildren}
    </div>
  );
}
