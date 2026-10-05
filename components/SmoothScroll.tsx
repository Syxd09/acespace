'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Enforce manual scroll restoration so reloading never does an erratic partial jump
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Always start at top on page refresh/initial mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. Initialize Lenis with architectural, tactile easing physics
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Clean scroll to top immediately in Lenis
    lenis.scrollTo(0, { immediate: true });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const scrollToHashElement = (hash: string) => {
      const targetId = hash.replace(/^#/, '').toLowerCase().trim();
      if (!targetId) return;
      let el = document.getElementById(targetId) || document.querySelector(`[id="${targetId}"]`);
      if (!el && (targetId === 'dupont' || targetId === 'foundation' || targetId === 'partnership' || targetId === 'alliance')) {
        el =
          document.getElementById('dupont') ||
          document.getElementById('foundation') ||
          document.getElementById('partnership') ||
          document.querySelector('section[id="dupont"]') ||
          document.querySelector('section[id="foundation"]');
      }
      if (el) {
        const isDupont = targetId === 'dupont' || targetId === 'foundation' || targetId === 'partnership' || targetId === 'alliance';
        try {
          lenis.resize();
        } catch {
          // ignore
        }
        lenis.scrollTo(el as HTMLElement, {
          offset: isDupont ? 60 : -96,
          duration: 1.2,
        });
      }
    };

    // If loaded with a hash in URL, scroll smoothly to it after initial render
    if (window.location.hash) {
      setTimeout(() => {
        scrollToHashElement(window.location.hash);
      }, 150);
      setTimeout(() => {
        scrollToHashElement(window.location.hash);
      }, 450);
      setTimeout(() => {
        scrollToHashElement(window.location.hash);
      }, 950);
    }

    // 3. Intercept anchor links across the site (both relative #hash and /page#hash)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Extract path and hash
      if (href.includes('#')) {
        const [linkPath, hash] = href.split('#');
        const currentPath = window.location.pathname;
        const isCurrentPage = !linkPath || linkPath === currentPath || (linkPath === '/' && currentPath === '/');

        if (isCurrentPage && hash) {
          const targetId = hash.replace(/^#/, '').toLowerCase().trim();
          let element = document.getElementById(targetId) || document.querySelector(`[id="${targetId}"]`);
          if (!element && (targetId === 'dupont' || targetId === 'foundation' || targetId === 'partnership' || targetId === 'alliance')) {
            element =
              document.getElementById('dupont') ||
              document.getElementById('foundation') ||
              document.getElementById('partnership') ||
              document.querySelector('section[id="dupont"]') ||
              document.querySelector('section[id="foundation"]');
          }
          if (element) {
            e.preventDefault();
            try {
              history.pushState(null, '', href);
            } catch {
              // ignore
            }
            try {
              lenis.resize();
            } catch {
              // ignore
            }
            const isDupont = targetId === 'dupont' || targetId === 'foundation' || targetId === 'partnership' || targetId === 'alliance';
            lenis.scrollTo(element as HTMLElement, {
              offset: isDupont ? 60 : -96,
              duration: 1.2,
            });
          }
        } else if (!isCurrentPage && hash) {
          try {
            sessionStorage.setItem('pendingHashScroll', hash);
            (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll = hash;
          } catch {
            // ignore
          }
        }
      }
    };

    const handleHashChange = () => {
      if (window.location.hash) {
        scrollToHashElement(window.location.hash);
      }
    };

    document.addEventListener('click', handleAnchorClick, { passive: false });
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashChange);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
