'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-init, .reveal-on-scroll').forEach((el) => {
        el.classList.add('visible');
      });
      return;
    }

    // Selectors that should reveal elegantly on scroll across all pages
    const SELECTORS = [
      '.reveal',
      '.reveal-on-scroll',
      '.scroll-reveal',
      '.section-head',
      '.project-hero-card',
      '.project-grid-card',
      '.journal-lead-card',
      '.journal-articles-grid > article',
      '.products-catalog-grid > *',
      '.sector-showcase-grid > div',
      '.about-two-col',
      '.about-two-col-wide',
      '.about-two-col-team',
      '.about-units-grid > div',
      '.tenet-card',
      '.timeline-card',
      '.material-card',
      '.bento-card',
      '.fabrication-card',
      '.spec-row',
      '.callout',
      '.hero-stats-row > div',
      '.consultation-layout-grid > div',
    ].join(', ');

    let observer: IntersectionObserver | null = null;
    const observedSet = new WeakSet<HTMLElement>();

    const revealElement = (el: HTMLElement) => {
      // Automatic stagger for sibling cards
      const parent = el.parentElement;
      if (parent && !el.style.transitionDelay) {
        const siblings = Array.from(parent.children).filter((c) =>
          c.matches(SELECTORS)
        );
        const idx = siblings.indexOf(el);
        if (idx > 0 && idx < 6) {
          el.style.transitionDelay = `${idx * 110}ms`;
        }
      }
      el.classList.add('visible');
    };

    const scanAndObserve = () => {
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS));

      elements.forEach((el) => {
        if (el.classList.contains('visible')) return;

        // Apply initial reveal state
        el.classList.add('reveal-on-scroll');

        const rect = el.getBoundingClientRect();
        // ONLY elements truly above the fold in top hero area (top 45% of screen) reveal on load
        if (rect.top < windowH * 0.45 && rect.bottom > 0) {
          setTimeout(() => {
            revealElement(el);
          }, 120);
          return;
        }

        if (!observedSet.has(el)) {
          observedSet.add(el);
          observer?.observe(el);
        }
      });
    };

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              revealElement(el);
              observer?.unobserve(el);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -40px 0px',
        }
      );
    }

    // Passive scroll check backup
    const handleScroll = () => {
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS));
      elements.forEach((el) => {
        if (el.classList.contains('visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < windowH * 0.88 && rect.bottom > 0) {
          revealElement(el);
          observer?.unobserve(el);
        }
      });
    };

    // Staggered scans to catch page transition content swap (~380ms)
    scanAndObserve();
    const t1 = setTimeout(scanAndObserve, 200);
    const t2 = setTimeout(scanAndObserve, 450);
    const t3 = setTimeout(scanAndObserve, 800);

    // Watch for dynamically loaded content in the page container
    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      const container = document.getElementById('main-content') || document.body;
      mutationObserver = new MutationObserver(() => {
        scanAndObserve();
      });
      mutationObserver.observe(container, { childList: true, subtree: true });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null;
}
