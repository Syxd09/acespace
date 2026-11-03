'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteContent } from '@/context/SiteContentContext';
import { defaultHeroSlides } from '@/data/contentTypes';

export default function HeroSlider() {
  const { heroSlides } = useSiteContent();

  const slides = (heroSlides && heroSlides.length === 4 && heroSlides[0]?.title === 'Solid by design.')
    ? heroSlides
    : defaultHeroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Keep index within bounds if slides count changes
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  // 6-second slide auto-advance timer with pause-on-hover logic
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const duration = 6000;
    const slideTimer = setTimeout(() => {
      setCurrentSlide((curr) => (curr + 1) % slides.length);
    }, duration);

    return () => {
      clearTimeout(slideTimer);
    };
  }, [currentSlide, slides.length, isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const prevSlide = () => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0] || defaultHeroSlides[0];

  return (
    <section className="hero" aria-label="Architectural hero showcase">
      {/* Slide Images with Ken-Burns and Crossfade */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id || index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), visibility 1.2s ease',
              zIndex: isActive ? 1 : 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-4%',
                transform: isActive ? 'scale(1.04) translate(0, 0)' : 'scale(1.1) translate(-0.5%, -0.5%)',
                transition: 'transform 7s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={`${slide.specimen || 'Ace Spaces'} solid surface architecture - ${slide.title}`}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  quality={85}
                  sizes="100vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Hero Text Content — Docked at Bottom-Left */}
      <div className="hero-content">
        <p
          key={`kicker-${currentSlide}`}
          className="hero-kicker"
          style={{ animation: 'heroTextIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          {activeSlide.eyebrow}
        </p>
        <h1
          key={`headline-${currentSlide}`}
          className="hero-headline"
          style={{ animation: 'heroTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both' }}
        >
          {activeSlide.title}
        </h1>

        <div className="hero-buttons">
          <Link className="hero-btn-primary" href={activeSlide.ctaPrimaryHref || '/materials'}>
            <span className="hero-btn-label">
              {(activeSlide.ctaPrimaryText || 'Explore materials')
                .replace(/& palette/gi, '')
                .replace(/& pallette/gi, '')
                .replace(/[↗→]/g, '')
                .trim() || 'Explore materials'}
            </span>
            <span className="hero-btn-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="hero-btn-secondary" href={activeSlide.ctaSecondaryHref || '/projects'}>
            <span className="hero-btn-label">
              {(activeSlide.ctaSecondaryText || 'See projects').replace(/[↗→]/g, '').trim()}
            </span>
            <span className="hero-btn-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Slide Navigation — Simple, Architectural & Clean */}
      {slides.length > 1 && (
        <div
          className="hero-slider-controls"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Hero showcase navigation"
        >
          {/* Specimen Tag */}
          {activeSlide.specimen && (
            <div className="hero-specimen-tag">
              <span>{activeSlide.specimen}</span>
              {activeSlide.location && (
                <>
                  <span className="hero-specimen-sep">/</span>
                  <span>{activeSlide.location}</span>
                </>
              )}
            </div>
          )}

          <div className="hero-controls-row">
            {/* Previous Slide Arrow Button */}
            <button
              type="button"
              className="hero-arrow-btn"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Slide Index Counter & Minimal Progress Line */}
            <div className="hero-counter-wrap" aria-live="polite">
              <span className="hero-counter-current">
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <div className="hero-timeline-track">
                <div
                  key={`timeline-${currentSlide}`}
                  className="hero-timeline-bar"
                  style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                />
              </div>
              <span className="hero-counter-total">
                {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Next Slide Arrow Button */}
            <button
              type="button"
              className="hero-arrow-btn"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
