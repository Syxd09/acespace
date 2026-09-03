'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const [targetLabel, setTargetLabel] = useState('');
  const prevPathRef = useRef(pathname);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'ACE SPACES';
    if (path.includes('/materials')) return '01 / MATERIALS';
    if (path.includes('/collections/colours')) return '02 / COLOURS & PALETTE';
    if (path.includes('/applications')) return '03 / APPLICATIONS';
    if (path.includes('/fabrication')) return '04 / FABRICATION';
    if (path.includes('/projects')) return '05 / PROJECTS';
    if (path.includes('/journal')) return '06 / JOURNAL';
    if (path.includes('/contact')) return '07 / CONTACT PRACTICE';
    return 'ACE SPACES';
  };

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setTargetLabel(getPageTitle(pathname));
      setTransitionStage('covering');

      // Scroll to top immediately
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Step 1: Curtain covers the screen (350ms)
      const tCover = setTimeout(() => {
        setDisplayChildren(children);
        prevPathRef.current = pathname;
        setTransitionStage('revealing');

        // Step 2: Curtain sweeps away (400ms)
        const tReveal = setTimeout(() => {
          setTransitionStage('idle');
        }, 450);

        return () => clearTimeout(tReveal);
      }, 350);

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
          transform:
            transitionStage === 'covering'
              ? 'translateY(0%)'
              : transitionStage === 'revealing'
              ? 'translateY(-100%)'
              : 'translateY(100%)',
          transition:
            transitionStage === 'covering'
              ? 'transform 0.35s cubic-bezier(0.77, 0, 0.175, 1)'
              : transitionStage === 'revealing'
              ? 'transform 0.45s cubic-bezier(0.77, 0, 0.175, 1)'
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
          {/* Monogram Emblem */}
          <div
            style={{
              width: '56px',
              height: '56px',
              border: '1px solid rgba(237, 232, 219, 0.35)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '22px',
              fontFamily: 'DM Mono, monospace',
              color: '#ede8db',
            }}
          >
            A
          </div>

          <span
            style={{
              fontSize: '12px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ede8db',
            }}
          >
            {targetLabel}
          </span>
        </div>
      </div>

      {/* Main Page Container with Smooth Scale & Fade */}
      <div
        className="page-content-wrapper"
        style={{
          opacity: transitionStage === 'covering' ? 0.7 : 1,
          transform: transitionStage === 'covering' ? 'scale(0.98)' : 'scale(1)',
          transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {displayChildren}
      </div>
    </>
  );
}
