'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'fade';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.94 && rect.bottom >= 0;
      if (inView) {
        setIsVisible(true);
        el.classList.add('visible');
        return true;
      }
      return false;
    };

    // 1. Check immediately on mount (guarantees text on initial load is never blank)
    if (checkVisibility()) {
      return;
    }

    // 2. High-precision IntersectionObserver (triggers as soon as element starts entering view)
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              entry.target.classList.add('visible');
              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '0px 0px -30px 0px',
        }
      );
      observer.observe(el);
    } else {
      // If browser has no IntersectionObserver, reveal immediately
      setIsVisible(true);
      el.classList.add('visible');
      return;
    }

    // 3. Scroll event listener fallback (ensures Lenis or custom scroll containers trigger seamlessly)
    const onScroll = () => {
      if (checkVisibility() && observer) {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // 4. Absolute safety fallback: ensure text is 100% visible after 800ms under any network/hydration condition
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
      el.classList.add('visible');
    }, 800);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
