'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Tenet {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  spec: string;
  image: string;
  caption: string;
}

const TENETS: Tenet[] = [
  {
    id: 'seamless',
    num: '01',
    title: 'Invisible Fusion',
    subtitle: 'Reactive Acrylic Bonding',
    description:
      'Countertops, waterfall returns, and integrated sinks are chemically welded with colour-matched acrylic resin. Joints cure into an unbroken plane—eliminating silicone grout lines and bacteria traps.',
    spec: 'Joint tolerance < 0.08mm / Monolithic Continuity',
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
    caption: 'Monolithic island in DuPont™ Corian® Calacatta Greige with seamless 45° mitred waterfall returns.',
  },
  {
    id: 'thermoforming',
    num: '02',
    title: '160°C Thermoforming',
    subtitle: 'Vacuum Platen Forming',
    description:
      'Heated to 160°C in our platen ovens, mineral slabs become completely pliable. Vacuum membrane presses shape them over custom timber bucks into organic curves, fluted reliefs, and curved washplanes.',
    spec: 'Radii down to 25mm / Zero Grain Distortion',
    image: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
    caption: 'Curved hospitality reception fixture formed with fluid radii and concealed structural ribbing.',
  },
  {
    id: 'cnc',
    num: '03',
    title: '5-Axis CNC Precision',
    subtitle: 'Direct CAD-to-Cut Milling',
    description:
      'Our 5-axis CNC routing suite translates complex Rhino and Revit files directly into precision toolpaths—milling integrated drainboard slopes, undercut rebates, and custom basin cutouts to sub-millimeter tolerances.',
    spec: '3700 × 1600mm Envelope / ±0.18mm Calibration',
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
    caption: 'Fluted architectural wall relief and monolithic plinth machined with diamond-tooled accuracy.',
  },
  {
    id: 'finishing',
    num: '04',
    title: 'Diamond Hand Honing',
    subtitle: 'Tactile Velvet Satin Finish',
    description:
      'Every fabricated plane undergoes multi-stage progressive diamond sanding (120 to 600-grit). The result is a soft, light-absorbing satin finish that feels natural to the touch and can be renewed on-site at any time.',
    spec: 'Multi-Stage Micro Abrasives / 100% In-Situ Renewable',
    image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
    caption: 'Honed translucent Golden Onyx paneling with internal illumination and diamond-buffed satin touch.',
  },
];

export default function AboutTenetsViewer() {
  const [activeId, setActiveId] = useState<string>(TENETS[0].id);
  const activeTenet = TENETS.find((t) => t.id === activeId) || TENETS[0];

  return (
    <div
      style={{
        border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', background: '#fff', borderRadius: '6px', overflow: 'hidden',
      }}
    >
      {/* Tab Selectors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
          background: 'rgba(236, 232, 223, 0.4)',
        }}
      >
        {TENETS.map((tenet) => {
          const isActive = tenet.id === activeId;
          return (
            <button
              key={tenet.id}
              type="button"
              onClick={() => setActiveId(tenet.id)}
              style={{
                textAlign: 'left',
                padding: '20px 22px',
                border: 'none',
                borderRight: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
                background: isActive ? '#fff' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                position: 'relative',
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--ink, #1e211d)',
                  }}
                />
              )}
              <span
                style={{
                  display: 'block',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  color: isActive ? 'var(--ink, #1e211d)' : 'var(--muted, #667064)',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                {tenet.num} / CRAFT DISCIPLINE
              </span>
              <strong
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--ink, #1e211d)',
                  letterSpacing: '-0.01em',
                }}
              >
                {tenet.title}
              </strong>
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#7a8479',
                  marginTop: '2px',
                  fontFamily: 'DM Mono, monospace',
                }}
              >
                {tenet.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tenet Display: Split Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        {/* Text Column */}
        <div
          style={{
            padding: 'clamp(28px, 4vw, 48px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
            background: '#faf9f6',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted, #667064)',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              Discipline {activeTenet.num}
            </span>
            <h3
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                lineHeight: 1.15,
                fontWeight: 400,
                color: 'var(--ink, #1e211d)',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              {activeTenet.title}
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#4a5249',
                margin: '0 0 24px',
              }}
            >
              {activeTenet.description}
            </p>
          </div>

          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                color: 'var(--muted, #667064)',
                letterSpacing: '0.08em',
              }}
            >
              Atelier Engineering Standard
            </span>
            <strong
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '13px',
                color: 'var(--ink, #1e211d)',
              }}
            >
              {activeTenet.spec}
            </strong>
          </div>
        </div>

        {/* Photography Canvas Column */}
        <div
          style={{
            position: 'relative',
            minHeight: '380px',
            background: '#1a1d19',
            overflow: 'hidden',
          }}
        >
          <Image
            key={activeTenet.image}
            src={activeTenet.image}
            alt={activeTenet.caption}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            quality={80}
            style={{
              objectFit: 'cover',
              transition: 'opacity 0.4s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(15, 18, 15, 0.88) 100%)',
              color: '#fff',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              {activeTenet.caption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

