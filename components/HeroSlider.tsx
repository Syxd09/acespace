'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteContent } from '@/context/SiteContentContext';
import { defaultHeroSlides } from '@/data/contentTypes';

export default function HeroSlider() {
  const { heroSlides } = useSiteContent();
  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : defaultHeroSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Keep index within bounds if slides count changes
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  // 5-second interval timer with smooth progress bar - continuous auto-slide
  useEffect(() => {
    if (slides.length === 0) return;

    setProgress(0);
    const duration = 5000;
    const startTime = Date.now();

    // Smooth progress bar update (does NOT trigger slide change)
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 50);

    // Discrete slide transition timer (fires exactly once after 5s)
    const slideTimer = setTimeout(() => {
      setCurrentSlide((curr) => (curr + 1) % slides.length);
      setProgress(0);
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [currentSlide, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
    setProgress(0);
  };

  const activeSlide = slides[currentSlide] || slides[0] || defaultHeroSlides[0];

  return (
    <section
      className="hero"
      aria-label="Architectural hero showcase"
    >
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
                inset: '-5%',
                transform: isActive ? 'scale(1.05) translate(0, 0)' : 'scale(1.12) translate(-1%, -1%)',
                transition: 'transform 6.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              )}
            </div>
            {/* Ambient Dark Gradient Shade for Text Legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(15, 17, 14, 0.82) 0%, rgba(15, 17, 14, 0.45) 55%, rgba(15, 17, 14, 0.25) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Hero Text Content */}
      <div className="hero-content" style={{ zIndex: 2 }}>
        <p className="eyebrow light">{activeSlide.eyebrow}</p>
        <h1 key={`title-${currentSlide}`} style={{ animation: 'heroTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          {activeSlide.title}
          <br />
          <i>{activeSlide.subtitle}</i>
        </h1>
        <p key={`copy-${currentSlide}`} className="hero-copy" style={{ animation: 'heroTextIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
          {activeSlide.copy}
        </p>

        <div className="hero-buttons">
          <Link className="button button-light" href="/materials">
            Explore materials <span>↗</span>
          </Link>
          <Link className="text-link light" href="/projects">
            View projects <span>↗</span>
          </Link>
        </div>
      </div>

      {/* Interactive Slide Navigation Controls & 5s Progress Bar */}
      <div className="hero-slider-controls">
        {/* Specimen Tag */}
        <div className="specimen-tag" style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {activeSlide.specimen} • {activeSlide.location}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Arrow Buttons */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#1e211d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
          >
            ←
          </button>

          {/* Slide Indicator & Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#fff' }}>
            <span>0{currentSlide + 1}</span>
            <div
              style={{
                width: '70px',
                height: '2px',
                background: 'rgba(255,255,255,0.25)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '2px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progress}%`,
                  background: '#fff',
                  transition: 'width 0.05s linear',
                }}
              />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>0{slides.length}</span>
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#1e211d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Vertical Scroll Cue on Left */}
      <div className="scroll-cue" style={{ zIndex: 10 }}>
        <span>Scroll to discover</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
