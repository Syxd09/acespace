'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  copy: string;
  specimen: string;
  location: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/hero-ace.png',
    eyebrow: 'Ace Spaces / Architectural Minerals',
    title: 'Material,',
    subtitle: 'made architectural.',
    copy: 'We develop solid surfaces and fabricated elements for spaces designed to outlast the moment.',
    specimen: 'Alto / Ivory Vein',
    location: 'Private Residence / Bengaluru',
  },
  {
    id: 2,
    image: '/assets/material-macro.png',
    eyebrow: 'Workshop Craft / Seamless Form',
    title: 'Quiet depth,',
    subtitle: 'monolithic form.',
    copy: 'Through-body mineral compositions engineered with zero visible seams, non-porous longevity, and velvety tactile texture.',
    specimen: 'Noma / Chalk',
    location: 'Material Specimen / Honed Matte',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    eyebrow: 'Spatial Typologies / Hospitality',
    title: 'Light, shadow',
    subtitle: '& refined volume.',
    copy: 'From curved reception monoliths to custom illuminated retail plinths, shaping material around pure architectural intent.',
    specimen: 'Obsidian / Still',
    location: 'Hospitality Pavilion / Mumbai',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    eyebrow: 'Fabrication / 5-Axis Precision',
    title: 'From raw sheet',
    subtitle: 'into sculpture.',
    copy: 'Thermoformed multi-radius curvatures and laser-mitred edge transitions executed in our Bengaluru facility.',
    specimen: 'Lumen / Shell',
    location: 'Atelier Installation / New Delhi',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // 5-second interval timer with smooth progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 5000;
    const updateFreq = 50;
    const step = (updateFreq / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, updateFreq);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

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

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Architectural hero showcase"
    >
      {/* Slide Images with Ken-Burns and Crossfade */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
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
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
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
        <p className="eyebrow light">{slides[currentSlide].eyebrow}</p>
        <h1 key={`title-${currentSlide}`} style={{ animation: 'heroTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          {slides[currentSlide].title}
          <br />
          <i>{slides[currentSlide].subtitle}</i>
        </h1>
        <p key={`copy-${currentSlide}`} className="hero-copy" style={{ animation: 'heroTextIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
          {slides[currentSlide].copy}
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
      <div
        style={{
          position: 'absolute',
          right: '4vw',
          bottom: '40px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
        }}
      >
        {/* Specimen Tag */}
        <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {slides[currentSlide].specimen} • {slides[currentSlide].location}
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
