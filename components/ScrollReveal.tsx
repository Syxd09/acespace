'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'fade';
  variant?: 'up' | 'fade' | 'image' | 'curtain' | 'shutter';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  variant,
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Determine specific animation variant classes
  const isImageVariant = variant === 'image' || variant === 'curtain' || variant === 'shutter';
  const variantClass = variant === 'shutter'
    ? 'reveal-shutter'
    : isImageVariant
      ? 'reveal-curtain'
      : direction === 'fade' || variant === 'fade'
        ? 'reveal-fade'
        : 'reveal-up';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion safety
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      el.classList.add('visible');
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight || document.documentElement.clientHeight;

    // ONLY elements truly above the fold in the top hero area (top 45% of screen) reveal on initial load
    if (rect.top < windowH * 0.45 && rect.bottom > 0) {
      const t = setTimeout(() => {
        setIsVisible(true);
        el.classList.add('visible');
      }, 100);
      return () => clearTimeout(t);
    }

    // ALL other elements must animate when scrolled into view
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
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
          threshold: 0.05,
          rootMargin: '0px 0px -40px 0px',
        }
      );
      observer.observe(el);
    }

    // Passive scroll check backup for kinetic scrolling
    const onScrollCheck = () => {
      const currentRect = el.getBoundingClientRect();
      const currentH = window.innerHeight || document.documentElement.clientHeight;
      if (currentRect.top < currentH * 0.88 && currentRect.bottom > 0) {
        setIsVisible(true);
        el.classList.add('visible');
        if (observer) observer.unobserve(el);
        window.removeEventListener('scroll', onScrollCheck);
      }
    };
    window.addEventListener('scroll', onScrollCheck, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', onScrollCheck);
    };
  }, []);

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      className={`reveal ${variantClass} ${isVisible ? 'visible' : ''} ${className}`.trim()}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
