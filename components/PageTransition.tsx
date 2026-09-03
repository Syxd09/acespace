'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger smooth progress bar on route change
    setLoading(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(75), 100);
    const t2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 250);
    }, 300);

    // Smoothly scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <>
      {/* Top Architectural Route Hairline Progress Bar */}
      {loading && (
        <div
          className="route-progress-bar"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '2.5px',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #1e211d, #76806e, #1e211d)',
            zIndex: 99999,
            pointerEvents: 'none',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            opacity: progress === 100 ? 0 : 1,
            boxShadow: '0 0 10px rgba(30, 33, 29, 0.3)',
          }}
        />
      )}

      {/* Page Content with Keyed Route Transition */}
      <div key={pathname} className="page-transition-wrapper">
        {children}
      </div>
    </>
  );
}
