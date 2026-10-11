'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [targetLabel, setTargetLabel] = useState('');
  const prevPathRef = useRef(pathname);

  // Ensure manual scroll restoration to prevent browser scroll jitter
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'ACE SPACES';
    if (path.includes('/materials') || path.includes('/collections/colours')) return '01 / MATERIALS & COLOURS';
    if (path.includes('/products')) return '02 / ARCHITECTURAL PRODUCTS';
    if (path.includes('/applications')) return '03 / APPLICATIONS';
    if (path.includes('/fabrication')) return '04 / FABRICATION';
    if (path.includes('/projects')) return '05 / PROJECTS';
    if (path.includes('/journal')) return '06 / JOURNAL';
    if (path.includes('/about')) return '07 / ABOUT US';
    if (path.includes('/contact')) return '08 / CONTACT PRACTICE';
    if (path.includes('/certifications')) return 'TECHNICAL GOVERNANCE & CERTIFICATIONS';
    if (path.includes('/guarantee') || path.includes('/warranty')) return '10-YEAR RENEWABLE GUARANTEE';
    if (path.includes('/consultation')) return 'PROJECT CONSULTATION DESK';
    return 'ACE SPACES';
  };

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setTargetLabel(getPageTitle(pathname));
      setTransitionStage('covering');

      // Scroll to top immediately on route change
      window.scrollTo({ top: 0, behavior: 'instant' });
      (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis?.scrollTo(0, { immediate: true });

      // Step 1: Curtain covers the screen (450ms)
      const tCover = setTimeout(() => {
        setDisplayChildren(children);
        prevPathRef.current = pathname;
        setTransitionStage('revealing');

        // Check if there is an intended hash target
        let hasPendingHash = false;
        try {
          hasPendingHash = Boolean(
            window.location.hash ||
            sessionStorage.getItem('pendingHashScroll') ||
            (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll
          );
        } catch {
          hasPendingHash = Boolean(window.location.hash);
        }

        // Scroll new page to top immediately only if no hash target is intended
        if (!hasPendingHash) {
          (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis?.scrollTo(0, { immediate: true });
        }

        // Step 2: Curtain sweeps away (550ms - Total 1.0 second)
        const tReveal = setTimeout(() => {
          setTransitionStage('idle');
          if (typeof window !== 'undefined') {
            let hash = window.location.hash ? window.location.hash.substring(1) : '';
            if (!hash) {
              try {
                const stored =
                  sessionStorage.getItem('pendingHashScroll') ||
                  (window as unknown as { __pendingHashScroll?: string }).__pendingHashScroll;
                if (stored) {
                  hash = stored.replace(/^#/, '');
                }
              } catch {
                // ignore
              }
            }

            if (hash) {
              const clean = hash.toLowerCase().trim();
              let el = document.getElementById(clean) || document.querySelector(`[id="${clean}"]`);
              if (!el && (clean === 'dupont' || clean === 'foundation' || clean === 'partnership' || clean === 'alliance')) {
                el =
                  document.getElementById('dupont') ||
                  document.getElementById('foundation') ||
                  document.getElementById('partnership') ||
                  document.querySelector('section[id="dupont"]') ||
                  document.querySelector('section[id="foundation"]');
              }
              if (el) {
                const lenis = (
                  window as unknown as {
                    __lenis?: {
                      resize: () => void;
                      scrollTo: (target: HTMLElement, opts?: unknown) => void;
                    };
                  }
                ).__lenis;
                const isDupont = clean === 'dupont' || clean === 'partnership' || clean === 'foundation' || clean === 'alliance';
                if (lenis) {
                  try {
                    lenis.resize();
                  } catch {
                    // ignore
                  }
                  lenis.scrollTo(el as HTMLElement, { offset: isDupont ? 60 : -96, duration: 1.2 });
                } else {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }
          }
        }, 550);

        return () => clearTimeout(tReveal);
      }, 450);

      return () => clearTimeout(tCover);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <>
      {/* Architectural Wipe Curtain Overlay */}
      <div
        className={`architectural-curtain ${transitionStage}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          pointerEvents: transitionStage === 'idle' ? 'none' : 'all',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#191c18',
          color: '#ede8db',
          borderBottom: '2px solid var(--brand-red, #d43833)',
          boxShadow: '0 4px 24px rgba(212, 56, 51, 0.25)',
          transform:
            transitionStage === 'covering'
              ? 'translateY(0%)'
              : transitionStage === 'revealing'
              ? 'translateY(-100%)'
              : 'translateY(100%)',
          transition:
            transitionStage === 'covering'
              ? 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)'
              : transitionStage === 'revealing'
              ? 'transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)'
              : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            opacity: transitionStage !== 'idle' ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          {/* Architectural Brand Logo on Curtain */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/logo/full-logo-white-transparent.png"
              alt="Ace Spaces India"
              width={220}
              height={66}
              priority
              style={{
                width: '200px',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>

          <span
            style={{
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(237, 232, 219, 0.85)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--brand-red, #d43833)',
                boxShadow: '0 0 8px rgba(212, 56, 51, 0.8)',
                display: 'inline-block',
              }}
            />
            {targetLabel}
          </span>
        </div>
      </div>

      {/* Main Page Container with Smooth Scale & Fade */}
      <div
        id="main-content"
        tabIndex={-1}
        className="page-content-wrapper"
        style={{
          opacity: transitionStage === 'covering' ? 0.7 : 1,
          transform: transitionStage === 'covering' ? 'scale(0.98)' : 'none',
          transition: 'opacity 0.45s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
        }}
      >
        {displayChildren}
      </div>
    </>
  );
}
