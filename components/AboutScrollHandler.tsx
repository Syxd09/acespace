'use client';

import { useEffect } from 'react';

/**
 * AboutScrollHandler ensures clicking DuPont / Foundation / Alliance links
 * across the site or directly navigating to /about#dupont smoothly scrolls
 * down to Chapter 04 ("Material Foundation & DuPont™ Alliance").
 */
export default function AboutScrollHandler() {
  useEffect(() => {
    const getTargetElement = (rawHash: string): HTMLElement | null => {
      const clean = rawHash.replace(/^#/, '').toLowerCase().trim();
      if (!clean) return null;

      // Group aliases for Chapter 04
      if (clean === 'dupont' || clean === 'partnership' || clean === 'alliance' || clean === 'foundation') {
        const el =
          document.getElementById('dupont') ||
          document.getElementById('foundation') ||
          document.getElementById('partnership') ||
          document.querySelector('section[id="dupont"]') ||
          document.querySelector('section[id="foundation"]');
        return el as HTMLElement | null;
      }

      return (document.getElementById(clean) || document.querySelector(`[id="${clean}"]`)) as HTMLElement | null;
    };

    const performScroll = () => {
      let targetHash = window.location.hash;
      if (!targetHash) {
        try {
          const stored =
            sessionStorage.getItem('pendingHashScroll') ||
            (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll;
          if (stored) {
            targetHash = stored.startsWith('#') ? stored : `#${stored}`;
            sessionStorage.removeItem('pendingHashScroll');
            delete (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll;
          }
        } catch {
          // ignore
        }
      }

      if (!targetHash) return;

      const targetEl = getTargetElement(targetHash);
      if (!targetEl) return;

      const clean = targetHash.replace(/^#/, '').toLowerCase().trim();
      const isDupont = clean === 'dupont' || clean === 'partnership' || clean === 'alliance' || clean === 'foundation';
      const targetOffset = isDupont ? 60 : -96;

      const lenis = (
        window as unknown as {
          __lenis?: {
            resize: () => void;
            scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number; immediate?: boolean }) => void;
          };
        }
      ).__lenis;

      if (lenis) {
        try {
          lenis.resize();
        } catch {
          // ignore
        }
        lenis.scrollTo(targetEl, {
          offset: targetOffset,
          duration: 1.2,
          immediate: false,
        });
      } else {
        const rect = targetEl.getBoundingClientRect();
        const top = rect.top + window.scrollY + targetOffset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth',
        });
      }
    };

    // Staggered attempts to account for:
    // 1. Initial page render
    // 2. Page transition curtain sweep (350ms - 800ms)
    // 3. Image loading & layout shifts
    const timers = [
      setTimeout(performScroll, 60),
      setTimeout(performScroll, 380),
      setTimeout(performScroll, 820),
      setTimeout(performScroll, 1300),
    ];

    // Intercept clicks on links targeting DuPont Chapter on this page
    const onDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      if (href.includes('#dupont') || href.includes('#foundation') || href.includes('#partnership')) {
        const targetEl = getTargetElement('dupont');
        if (targetEl) {
          e.preventDefault();
          try {
            history.pushState(null, '', href.includes('/about') ? href : '/about#dupont');
          } catch {
            // ignore
          }

          const lenis = (
            window as unknown as {
              __lenis?: {
                resize: () => void;
                scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
              };
            }
          ).__lenis;

          if (lenis) {
            try {
              lenis.resize();
            } catch {
              // ignore
            }
            lenis.scrollTo(targetEl, { offset: 60, duration: 1.2 });
          } else {
            const rect = targetEl.getBoundingClientRect();
            const top = rect.top + window.scrollY + 60;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
        }
      }
    };

    const onHashChange = () => {
      performScroll();
    };

    document.addEventListener('click', onDocumentClick, { capture: true });
    window.addEventListener('hashchange', onHashChange);

    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('click', onDocumentClick, { capture: true });
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return null;
}
