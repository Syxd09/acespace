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
      const targetId = hash.replace(/^#/, '');
      if (!targetId) return;
      const el = document.getElementById(targetId) || document.querySelector(`[id="${targetId}"]`);
      if (el) {
        lenis.scrollTo(el as HTMLElement, {
          offset: -96,
          duration: 1.2,
        });
      }
    };

    // If loaded with a hash in URL, scroll smoothly to it after initial render
    if (window.location.hash) {
      setTimeout(() => {
        scrollToHashElement(window.location.hash);
      }, 350);
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
          const element = document.getElementById(hash) || document.querySelector(`[id="${hash}"]`);
          if (element) {
            e.preventDefault();
            history.pushState(null, '', href);
            lenis.scrollTo(element as HTMLElement, {
              offset: -96,
              duration: 1.2,
            });
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
