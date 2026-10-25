'use client';

import React from 'react';

interface ArchitecturalHumanScaleFigureProps {
  /** Screen X coordinate of the right hand / contact point */
  x: number;
  /** Screen Y coordinate of the feet (ground floor baseline) */
  bottomY: number;
  /** Height in screen pixels corresponding to 1.70m in 3D world space */
  heightPx: number;
  /** Opacity of the silhouette (default: 0.30 for 70% transparency) */
  opacity?: number;
  /** Whether to render subtle datum annotations */
  showAnnotations?: boolean;
}

/**
 * ArchitecturalHumanScaleFigure
 *
 * Renders the user's exact uploaded silhouette (woman with hands on hips and flared pants)
 * with 100% transparent background (zero white box) and 70% transparency (30% opacity).
 * Dynamically scales in 1:1 proportion with the 3D model as the user zooms and rotates.
 */
export const ArchitecturalHumanScaleFigure: React.FC<ArchitecturalHumanScaleFigureProps> = ({
  x,
  bottomY,
  heightPx,
  opacity = 0.30,
  showAnnotations = true,
}) => {
  if (heightPx <= 15 || isNaN(heightPx) || isNaN(x) || isNaN(bottomY)) {
    return null;
  }

  // Exact aspect ratio of the 364x1024 silhouette image (~0.3555)
  const aspect = 364 / 1024;
  const widthPx = heightPx * aspect;
  const topY = bottomY - heightPx;

  // In the silhouette, her right hand/hip is at ~88% of the image width.
  // Placing leftX at x - widthPx * 0.88 aligns her hand/hip comfortably at the left rim.
  const leftX = x - widthPx * 0.88;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 3,
      }}
    >
      {/* 1. Subtle Architectural Datum Guides */}
      {showAnnotations && heightPx > 100 && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          {/* Finished Floor Level (FFL) line */}
          <line
            x1={x - widthPx * 0.95}
            y1={bottomY}
            x2={x - widthPx * 0.10}
            y2={bottomY}
            stroke="rgba(30, 33, 29, 0.25)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <text
            x={x - widthPx * 0.98}
            y={bottomY - 3}
            textAnchor="end"
            fill="rgba(30, 33, 29, 0.50)"
            fontFamily="DM Mono, monospace"
            fontSize="8.5px"
            letterSpacing="0.04em"
          >
            ±0.00 FFL
          </text>

          {/* 1.70m Height Indicator */}
          <line
            x1={x - widthPx * 0.90}
            y1={topY}
            x2={x - widthPx * 0.30}
            y2={topY}
            stroke="rgba(212, 56, 51, 0.50)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x={x - widthPx * 0.93}
            y={topY + 3}
            textAnchor="end"
            fill="rgba(212, 56, 51, 0.80)"
            fontFamily="DM Mono, monospace"
            fontSize="8.5px"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            1.70m SCALE
          </text>
        </svg>
      )}

      {/* 2. User's Exact Silhouette Image (Hands on hips, zero background, 70% transparency) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/configurator/silhouette_clean.png"
        alt="1.70m Architectural Scale Silhouette"
        style={{
          position: 'absolute',
          left: `${leftX}px`,
          top: `${topY}px`,
          height: `${heightPx}px`,
          width: `${widthPx}px`,
          opacity,
          pointerEvents: 'none',
          userSelect: 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          filter: 'none',
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
};

export default ArchitecturalHumanScaleFigure;
