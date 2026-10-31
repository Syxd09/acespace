'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
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

  // Subtle auto-advance every 5.5s
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

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
      className="application-slider-refined"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${sectorTitle} Photo Gallery`}
      style={{
        position: 'relative',
        width: '100%',
        height: '460px',
        backgroundColor: '#e6e3dc',
        border: '1px solid var(--line, rgba(30, 33, 29, 0.09))',
        borderRadius: 'var(--card-radius, 6px)',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(30, 33, 29, 0.06)',
        outline: 'none',
      }}
    >
      {/* Photos with smooth cross-fade */}
      {images.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={img.src}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(1.025)',
              transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)',
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

      {/* Discreet Navigation Arrows */}
      {total > 1 && (
        <div
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
            aria-label="Previous photo"
            style={{
              pointerEvents: 'auto',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(20, 23, 19, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(20, 23, 19, 0.85)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 23, 19, 0.55)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next photo"
            style={{
              pointerEvents: 'auto',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(20, 23, 19, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(20, 23, 19, 0.85)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 23, 19, 0.55)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Understated Bottom Strip: Natural Caption & Minimal Dashes */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 18px 14px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(15, 18, 15, 0.65) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#f5f2eb',
            fontWeight: 400,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
            maxWidth: '80%',
          }}
        >
          {currentImage.caption}
        </p>

        {total > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto',
              flexShrink: 0,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === currentIndex ? '18px' : '6px',
                  height: '4px',
                  borderRadius: '100px',
                  border: 'none',
                  background: i === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
