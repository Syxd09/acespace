'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type CurtainPhase = 'reload-hold' | 'rising' | 'clearing' | 'idle';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  // Start in 'reload-hold' so on hard refresh/reload the screen starts covered by the curtain
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('reload-hold');
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  // Manual scroll restoration to prevent browser scroll jumping
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  const clearAllTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  // 1. On Initial Mount / Page Reload: The curtain starts covered, then sweeps UP to unveil the page
  useEffect(() => {
    const reloadTimer = setTimeout(() => {
      setCurtainPhase('clearing');

      const endTimer = setTimeout(() => {
        setCurtainPhase('idle');
      }, 750);

      timerRef.current.push(endTimer);
    }, 180);

    timerRef.current.push(reloadTimer);

    return () => {
      clearAllTimers();
    };
  }, []);

  // 2. On Route Navigation (clicking links across pages)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      clearAllTimers();

      // Phase 1: Curtain sweeps upward from bottom to cover the viewport
      setCurtainPhase('rising');

      // Phase 2: After curtain has masked the screen (~380ms), swap page content & reset scroll
      const midTimer = setTimeout(() => {
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

        // Swap children to new route content underneath the curtain
        setDisplayChildren(children);

        // Reset scroll position cleanly while covered
        if (!hash) {
          window.scrollTo({ top: 0, behavior: 'instant' });
          (window as unknown as { __lenis?: { scrollTo: (target: number, opts: { immediate: boolean }) => void } }).__lenis?.scrollTo(0, { immediate: true });
        }

        // Phase 3: Curtain glides out upward to reveal the new page
        setCurtainPhase('clearing');

        if (hash) {
          const clean = hash.toLowerCase().trim();
          setTimeout(() => {
            const el = document.getElementById(clean) || document.querySelector(`[id="${clean}"]`);
            if (el) {
              const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: unknown) => void } }).__lenis;
              if (lenis) {
                lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.0 });
              } else {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }, 100);
        }

        const endTimer = setTimeout(() => {
          setCurtainPhase('idle');
        }, 450);

        timerRef.current.push(endTimer);
      }, 380);

      timerRef.current.push(midTimer);

      return () => {
        clearAllTimers();
      };
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div className="page-transition-container">
      {/* Physical Architectural Curtain Wipe Overlay */}
      <div
        aria-hidden="true"
        className={`architectural-curtain curtain-${curtainPhase}`}
      >
        <div className="curtain-panel">
          <div className="curtain-brand">
            {/* Official Ace Spaces Full Logo */}
            <Image
              src="/logo/full-logo-white-transparent.png"
              alt="Ace Spaces Architectural Surfaces"
              width={280}
              height={103}
              priority
              className="curtain-logo"
            />
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <div
        id="main-content"
        tabIndex={-1}
        className={`page-content-wrapper ${curtainPhase !== 'idle' ? 'page-transitioning' : 'page-ready'}`}
        style={{ outline: 'none' }}
      >
        {displayChildren}
      </div>
    </div>
  );
}
