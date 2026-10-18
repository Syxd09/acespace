'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ApplicationImage } from '@/data/applications';

interface ApplicationSliderProps {
  images: ApplicationImage[];
  sectorTitle: string;
  sectorSlug: string;
  priority?: boolean;
}

export default function ApplicationSlider({
  images,
  sectorTitle,
  sectorSlug,
  priority = false,
}: ApplicationSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = images.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Continuous auto-slide every 4.5s
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, nextSlide, currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStart(null);
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="application-slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${sectorTitle} Image Showcase`}
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        backgroundColor: '#dcd7cd',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.07)',
        outline: 'none',
      }}
    >
      {/* Images with smooth cross-fade and scale */}
      {images.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={img.src}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(1.04)',
              transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority={priority && idx === 0}
            />
          </div>
        );
      })}

      {/* Top Meta Bar: Sector Tag & Counter */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          right: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            background: 'rgba(23, 26, 23, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#f4f3ee',
            padding: '6px 12px',
            fontSize: '10px',
            fontFamily: 'DM Mono, monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          {currentImage.tag}
        </span>

        <span
          style={{
            background: 'rgba(23, 26, 23, 0.78)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#f4f3ee',
            padding: '6px 12px',
            fontSize: '11px',
            fontFamily: 'DM Mono, monospace',
            letterSpacing: '0.1em',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Manual Slide Navigation Buttons: Prev & Next Arrows */}
      <div
        className="application-slider-nav-row"
        style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          right: '12px',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="application-slider-arrow application-slider-arrow-prev"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="application-slider-arrow application-slider-arrow-next"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Bottom Glassmorphic Control & Caption Dock */}
      <div className="application-slider-dock">
        <div className="application-slider-caption-box">
          <p className="application-slider-caption">
            {currentImage.caption}
          </p>
          <span className="application-slider-sub">
            Auto-sliding • Slide {currentIndex + 1} of {total}
          </span>
        </div>

        {/* Slide Indicator Dots + Link to Application Page */}
        <div className="application-slider-actions-row">
          <div className="application-slider-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="application-slider-dot"
                style={{
                  width: i === currentIndex ? '22px' : '6px',
                  minWidth: i === currentIndex ? '22px' : '6px',
                  maxWidth: i === currentIndex ? '22px' : '6px',
                  background: i === currentIndex ? 'var(--ink)' : 'rgba(30, 33, 29, 0.28)',
                }}
              />
            ))}
          </div>

          <Link
            href={`/applications/${sectorSlug}`}
            className="application-slider-cta"
          >
            Explore Application <span>↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
