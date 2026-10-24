'use client';

import React from 'react';

// ============================================================================
// 1. CORNER PROFILE DIAGRAM
// ============================================================================
// ============================================================================
// 1. CORNER PROFILE DIAGRAM (Matching Image 3 Reference)
// ============================================================================
export function CornerProfileDiagram({
  type,
  side = 'left',
  active = false,
}: {
  type: 'sharp' | 'fillet' | 'chamfer' | 'shift';
  side?: 'left' | 'right';
  active?: boolean;
  radiusMm?: number;
  chamferMm?: number;
  shiftMm?: number;
}) {
  const stroke = active ? '#d43833' : '#222521';
  const hatchColor = '#b5baa9';
  const fill = active ? '#ffffff' : '#f4f3ef';
  const isLeft = side === 'left';

  return (
    <svg viewBox="0 0 88 56" width="100%" height="46" style={{ display: 'block' }}>
      {/* Wall Structure on top with 45-deg Hatching (Matching Image 3) */}
      <rect x="6" y="6" width="76" height="8" fill="#eae8e0" stroke="#ccc8be" strokeWidth="0.8" />
      <line x1="10" y1="14" x2="18" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="22" y1="14" x2="30" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="34" y1="14" x2="42" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="46" y1="14" x2="54" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="58" y1="14" x2="66" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="70" y1="14" x2="78" y2="6" stroke={hatchColor} strokeWidth="1" />
      <line x1="6" y1="14" x2="82" y2="14" stroke="#222521" strokeWidth="1.2" />

      {/* SHIFT CORNER */}
      {type === 'shift' && (
        <>
          {/* Main Vanity Slab */}
          <rect x={isLeft ? 26 : 6} y="14" width="56" height="24" fill={fill} stroke={stroke} strokeWidth="1.4" />
          {/* Dashed shifted angle triangle lines */}
          <polygon
            points={isLeft ? '26,14 12,38 26,38' : '62,14 76,38 62,38'}
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            strokeDasharray="2,2"
          />
          {/* Tick marks & +/- scale indicator */}
          <line x1={isLeft ? '8' : '58'} y1="44" x2={isLeft ? '30' : '80'} y2="44" stroke={stroke} strokeWidth="1.2" />
          <line x1={isLeft ? '12' : '62'} y1="41" x2={isLeft ? '12' : '62'} y2="47" stroke={stroke} strokeWidth="1.2" />
          <circle cx={isLeft ? 12 : 62} cy="44" r="2.2" fill={stroke} />
          <line x1={isLeft ? '19' : '69'} y1="42" x2={isLeft ? '19' : '69'} y2="46" stroke={stroke} strokeWidth="1" />
          <circle cx={isLeft ? 19 : 69} cy="44" r="1.6" fill={stroke} />
          <line x1={isLeft ? '26' : '76'} y1="41" x2={isLeft ? '26' : '76'} y2="47" stroke={stroke} strokeWidth="1.2" />
          <circle cx={isLeft ? 26 : 76} cy="44" r="2.2" fill={stroke} />
          <text x={isLeft ? 8 : 60} y="44" fontSize="6.5" fontFamily="monospace" fontWeight="bold" fill={stroke} textAnchor="end">+</text>
          <text x={isLeft ? 31 : 82} y="44" fontSize="6.5" fontFamily="monospace" fontWeight="bold" fill={stroke} textAnchor="start">-</text>
        </>
      )}

      {/* FILLET CORNER (ROUNDED RADIUS) */}
      {type === 'fillet' && (
        <>
          {/* Vanity Slab with Rounded Corner */}
          <path
            d={
              isLeft
                ? 'M 14,14 L 80,14 L 80,38 L 26,38 Q 14,38 14,26 Z'
                : 'M 8,14 L 74,14 L 74,26 Q 74,38 62,38 L 8,38 Z'
            }
            fill={fill}
            stroke={stroke}
            strokeWidth="1.4"
          />
          {/* Dashed original 90-deg square guidelines */}
          <path
            d={isLeft ? 'M 14,26 L 14,38 L 26,38' : 'M 74,26 L 74,38 L 62,38'}
            fill="none"
            stroke="#999"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          {/* Dimension indicator line and dots */}
          <line x1={isLeft ? '14' : '62'} y1="45" x2={isLeft ? '26' : '74'} y2="45" stroke={stroke} strokeWidth="1.2" />
          <line x1={isLeft ? '14' : '62'} y1="39" x2={isLeft ? '14' : '62'} y2="47" stroke={stroke} strokeWidth="1" />
          <line x1={isLeft ? '26' : '74'} y1="39" x2={isLeft ? '26' : '74'} y2="47" stroke={stroke} strokeWidth="1" />
          <circle cx={isLeft ? 14 : 62} cy="45" r="2" fill={stroke} />
          <circle cx={isLeft ? 26 : 74} cy="45" r="2" fill={stroke} />
        </>
      )}

      {/* CHAMFER CORNER (45-DEG BEVEL) */}
      {type === 'chamfer' && (
        <>
          {/* Vanity Slab with 45-deg Chamfer Bevel */}
          <polygon
            points={
              isLeft
                ? '14,14 80,14 80,38 26,38 14,26'
                : '8,14 74,14 74,26 62,38 8,38'
            }
            fill={fill}
            stroke={stroke}
            strokeWidth="1.4"
          />
          {/* Dashed original corner square */}
          <path
            d={isLeft ? 'M 14,26 L 14,38 L 26,38' : 'M 74,26 L 74,38 L 62,38'}
            fill="none"
            stroke="#999"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          {/* Dimension indicator line and dots */}
          <line x1={isLeft ? '14' : '62'} y1="45" x2={isLeft ? '26' : '74'} y2="45" stroke={stroke} strokeWidth="1.2" />
          <line x1={isLeft ? '14' : '62'} y1="39" x2={isLeft ? '14' : '62'} y2="47" stroke={stroke} strokeWidth="1" />
          <line x1={isLeft ? '26' : '74'} y1="39" x2={isLeft ? '26' : '74'} y2="47" stroke={stroke} strokeWidth="1" />
          <circle cx={isLeft ? 14 : 62} cy="45" r="2" fill={stroke} />
          <circle cx={isLeft ? 26 : 74} cy="45" r="2" fill={stroke} />
        </>
      )}

      {/* SHARP CORNER (CLEAN 90-DEG) */}
      {type === 'sharp' && (
        <>
          {/* Pure clean 90-deg slab */}
          <rect x={isLeft ? 14 : 8} y="14" width="66" height="24" fill={fill} stroke={stroke} strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 2. SINK INTEGRATION DIAGRAM (Isometric Architectural Wireframe)
// ============================================================================
export function SinkIntegrationDiagram({
  type,
  active = false,
}: {
  type: 'integrated' | 'undermount' | 'topmount' | 'none';
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#222521';
  const slabFill = active ? '#ffffff' : '#f9f8f5';
  const accent = active ? '#d43833' : '#737e73';

  return (
    <svg viewBox="0 0 100 58" width="100%" height="46" style={{ display: 'block' }}>
      {type === 'integrated' && (
        <>
          {/* Isometric Countertop Slab */}
          <polygon points="12,32 64,12 88,23 36,43" fill={slabFill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="12,32 36,43 36,47 12,36" fill="#e8e5dc" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="36,43 88,23 88,27 36,47" fill="#dfdcd2" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />

          {/* Inset Flush Basin (IN) */}
          <ellipse cx="50" cy="27" rx="13" ry="6.5" fill="#ebe7de" stroke={stroke} strokeWidth="1.4" transform="rotate(-6 50 27)" />
          {/* Inner basin cavity depth drop */}
          <path d="M 38,27 Q 50,38 62,26" fill="none" stroke={stroke} strokeWidth="1.2" />
          <circle cx="50" cy="30" r="1.6" fill={stroke} />
        </>
      )}

      {type === 'undermount' && (
        <>
          {/* Isometric Countertop Slab (ON / Straight Cylinder Drum Basin on Deck - Screenshot 2) */}
          <polygon points="12,34 64,14 88,25 36,45" fill={slabFill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="12,34 36,45 36,49 12,38" fill="#e8e5dc" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="36,45 88,25 88,29 36,49" fill="#dfdcd2" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />

          {/* Straight Vertical Cylindrical Drum Basin sitting ON slab */}
          <path d="M 38,18 L 38,30 Q 50,37 62,30 L 62,18 Z" fill="#eeeae1" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <ellipse cx="50" cy="18" rx="12" ry="5.5" fill={slabFill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="50" cy="18" rx="9.5" ry="4.2" fill="#ded8cc" stroke={stroke} strokeWidth="1.2" />
          <circle cx="50" cy="24" r="1.5" fill={stroke} />
        </>
      )}

      {type === 'topmount' && (
        <>
          {/* Isometric Countertop Slab (TOP / Curved Round Bowl on Deck - Screenshot 1) */}
          <polygon points="12,34 64,14 88,25 36,45" fill={slabFill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="12,34 36,45 36,49 12,38" fill="#e8e5dc" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="36,45 88,25 88,29 36,49" fill="#dfdcd2" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />

          {/* Curved Hemispherical Round Bowl sitting ON slab */}
          <path d="M 38,20 C 38,36 62,36 62,20 Z" fill="#eeeae1" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <ellipse cx="50" cy="20" rx="12" ry="5.5" fill={slabFill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="50" cy="20" rx="9.5" ry="4.2" fill="#ded8cc" stroke={stroke} strokeWidth="1.2" />
          <circle cx="50" cy="26" r="1.5" fill={stroke} />
        </>
      )}

      {type === 'none' && (
        <>
          {/* Solid Continuous Surface Slabs (no sink) */}
          <polygon points="12,32 64,12 88,23 36,43" fill={slabFill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="12,32 36,43 36,47 12,36" fill="#e8e5dc" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="36,43 88,23 88,27 36,47" fill="#dfdcd2" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 3. TAP LOCATION DIAGRAM (Cross-Section Architecture matching Reference)
// ============================================================================
export function TapLocationDiagram({
  type,
  location,
  active = false,
}: {
  type?: 'top-mounted' | 'wall-mounted';
  location?: 'top-mounted' | 'wall-mounted';
  tapHoles?: number;
  active?: boolean;
}) {
  const currentType = location || type || 'top-mounted';
  const stroke = active ? '#d43833' : '#222521';
  const wallHatch = active ? 'rgba(212, 56, 51, 0.4)' : '#b2b8af';
  const deckFill = active ? '#ffffff' : '#f8f7f2';

  return (
    <svg viewBox="0 0 74 68" width="100%" height="56" style={{ display: 'block' }}>
      {currentType === 'top-mounted' && (
        <>
          {/* Wall Structure on left with 45-deg Hatching */}
          <rect x="6" y="8" width="12" height="52" fill="#eae8e0" stroke={stroke} strokeWidth="1.4" />
          <line x1="6" y1="16" x2="18" y2="28" stroke={wallHatch} strokeWidth="1" />
          <line x1="6" y1="28" x2="18" y2="40" stroke={wallHatch} strokeWidth="1" />
          <line x1="6" y1="40" x2="18" y2="52" stroke={wallHatch} strokeWidth="1" />
          <line x1="6" y1="52" x2="18" y2="60" stroke={wallHatch} strokeWidth="1" />

          {/* Countertop Deck */}
          <rect x="18" y="44" width="50" height="4" fill={deckFill} stroke={stroke} strokeWidth="1.4" />

          {/* Deck Mounted Swan-Neck Faucet */}
          {/* Base escutcheon plate */}
          <rect x="26" y="41" width="14" height="3" fill="#ffffff" stroke={stroke} strokeWidth="1.3" />
          {/* Faucet Pipe Curve */}
          <path d="M 33,41 L 33,26 Q 33,14 43,14 Q 53,14 53,24 L 53,26" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          {/* Aerator nozzle */}
          <rect x="51.5" y="26" width="3" height="3" fill={stroke} />

          {/* Water Droplet */}
          <path d="M 53,35 C 51.5,37 51.5,40 53,41 C 54.5,40 54.5,37 53,35 Z" fill={stroke} />

          {/* Dimension connection link line between wall and faucet axis */}
          <line x1="18" y1="26" x2="33" y2="26" stroke={stroke} strokeWidth="1.2" />
          <circle cx="18" cy="26" r="2.2" fill={stroke} />
          <circle cx="33" cy="26" r="2.2" fill={stroke} />

          {/* Sub-deck supply tube dashed lines */}
          <line x1="31" y1="48" x2="31" y2="58" stroke={stroke} strokeWidth="1" strokeDasharray="2,2" />
          <line x1="35" y1="48" x2="35" y2="58" stroke={stroke} strokeWidth="1" strokeDasharray="2,2" />
        </>
      )}

      {currentType === 'wall-mounted' && (
        <>
          {/* Wall Structure on left with Tile Lines */}
          <rect x="6" y="8" width="14" height="52" fill="#eae8e0" stroke={stroke} strokeWidth="1.4" />
          <line x1="6" y1="20" x2="20" y2="20" stroke="#ccc8be" strokeWidth="1" />
          <line x1="6" y1="34" x2="20" y2="34" stroke="#ccc8be" strokeWidth="1" />
          <line x1="6" y1="48" x2="20" y2="48" stroke="#ccc8be" strokeWidth="1" />

          {/* Countertop Deck */}
          <rect x="20" y="44" width="48" height="4" fill={deckFill} stroke={stroke} strokeWidth="1.4" />

          {/* Wall Mounted Spout */}
          <rect x="20" y="18" width="4" height="12" fill="#ffffff" stroke={stroke} strokeWidth="1.3" />
          <path d="M 24,24 L 46,24 Q 52,24 52,30 L 52,32" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="50.5" y="32" width="3" height="3" fill={stroke} />

          {/* Water Droplet */}
          <path d="M 52,39 C 50.5,41 50.5,43 52,44 C 53.5,43 53.5,41 52,39 Z" fill={stroke} />

          {/* Dimension connection link line from wall to drop axis */}
          <line x1="20" y1="28" x2="42" y2="28" stroke={stroke} strokeWidth="1.2" />
          <line x1="42" y1="28" x2="42" y2="44" stroke={stroke} strokeWidth="1" strokeDasharray="2,2" />
          <circle cx="20" cy="28" r="2.2" fill={stroke} />
          <circle cx="42" cy="28" r="2.2" fill={stroke} />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 3B. SINK MODEL DIAGRAM (Architectural Isometric Line Art for A, B, RO, OV, DB, UB, UC, WDT)
// ============================================================================
export function SinkModelDiagram({
  model,
  active = false,
}: {
  model: 'A' | 'RO' | 'OV' | 'B' | 'DB' | 'UB' | 'UC' | 'WDT' | string;
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#222521';
  const rimFill = '#ffffff';
  const floorFill = '#f4f3ee';
  const wallDrop = '#eae7df';
  const underbelly = '#e5e1d7';
  const slotFill = active ? '#d43833' : '#222521';

  const m = (model || '').toLowerCase();
  const isModelA = m === 'a' || m === 'coved-rect' || m === 'rectangular' || m.startsWith('sq') || m.includes('sq');
  const isRound = m === 'ro' || m === 'round-bowl' || m.startsWith('circ') || m.includes('circ');
  const isOval = m === 'ov' || m === 'coved-oval' || m.startsWith('oval') || m.startsWith('capsule') || m.includes('oval') || m.includes('capsule');
  const isBox = m === 'b' || m === 'crisp-rect';
  const isDouble = m === 'db' || m === 'double-basin';
  const isUndermountBox = m === 'ub' || m === 'undermount-box';
  const isUndermountChannel = m === 'uc' || m === 'undermount-channel';
  const isWashdesk = m === 'wdt' || m === 'washdesk-trough' || m === 'linear-trough';

  return (
    <svg viewBox="0 0 88 56" width="100%" height="46" style={{ display: 'block' }}>
      {/* 1. SQUARE & RECTANGULAR BASINS (sq 1, sq 2, sq 3, sq 4, sq 11, Model A, Model B) */}
      {(isModelA || isBox) && (
        <image
          href="/icons/basins/sink-square.png"
          x="3"
          y="2"
          width="82"
          height="52"
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: active ? 'drop-shadow(0 2px 4px rgba(212, 56, 51, 0.35))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
          }}
        />
      )}

      {/* 2. CIRCULAR BASINS (circ 8, circ 9, Model RO) */}
      {isRound && (
        <image
          href="/icons/basins/sink-circle.png"
          x="5"
          y="2"
          width="78"
          height="52"
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: active ? 'drop-shadow(0 2px 4px rgba(212, 56, 51, 0.35))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
          }}
        />
      )}

      {/* 3. OVAL & CAPSULE BASINS (oval 5, capsule 6, oval 7, oval 10, oval 12, Model OV) */}
      {isOval && (
        <image
          href="/icons/basins/sink-oval.png"
          x="2"
          y="2"
          width="84"
          height="52"
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: active ? 'drop-shadow(0 2px 4px rgba(212, 56, 51, 0.35))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
          }}
        />
      )}

      {/* 5. MODEL DB: Curved Hammock Trough Basin (Exact match to Reference Image 4) */}
      {isDouble && (
        <>
          {/* Deep curved cradle underside hammock contour */}
          <path
            d="M 18,20 C 18,38 32,44 48,44 C 64,44 76,35 76,22"
            fill={underbelly}
            stroke={stroke}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Top opening with curved front lip and straight sides */}
          <path
            d="M 18,20 L 64,11 L 76,22 Q 53,35 30,31 Z"
            fill={rimFill}
            stroke={stroke}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Inner curved scoop cavity */}
          <path
            d="M 20,21 L 62,13 L 74,22 Q 52,33 31,29 Z"
            fill={floorFill}
            stroke={stroke}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          {/* Rear-left overflow slot */}
          <ellipse cx="35" cy="16" rx="2.4" ry="1.1" fill={slotFill} transform="rotate(-11 35 16)" />
          {/* Centered concentric pop-up drain */}
          <ellipse cx="48" cy="28" rx="4" ry="2" fill={wallDrop} stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="48" cy="28" rx="2.2" ry="1.1" fill={stroke} />
        </>
      )}

      {/* 6. MODEL UB: Undermount Box with Ramp (Exact match to Reference Image 5) */}
      {isUndermountBox && (
        <>
          {/* Stepped left side exterior & front face */}
          <path
            d="M 17,17 L 17,27 L 28,39 L 75,31 L 75,23"
            fill={underbelly}
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <polygon points="17,27 28,39 28,32 17,22" fill={wallDrop} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />

          {/* Top rectangular rim */}
          <polygon points="17,17 64,9 75,17 28,25" fill={rimFill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />

          {/* Inner front vertical drop */}
          <polygon points="28,25 75,17 75,21 28,29" fill={wallDrop} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />

          {/* Sloped ramp descending to rear drainage trench */}
          <polygon points="28,29 75,21 68,14 22,22" fill={floorFill} stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />

          {/* Rear drainage trench gap */}
          <polygon points="22,22 68,14 68,12 22,19" fill={slotFill} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
        </>
      )}

      {/* 7. MODEL UC: Undermount Sloped Channel (Exact match to Reference Image 6) */}
      {isUndermountChannel && (
        <>
          {/* Wedge left side exterior & front bottom */}
          <path
            d="M 17,17 L 28,39 L 75,31 L 75,23"
            fill={underbelly}
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <polygon points="17,17 28,39 28,25" fill={wallDrop} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />

          {/* Top rectangular rim */}
          <polygon points="17,17 64,9 75,17 28,25" fill={rimFill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />

          {/* Continuous sloping ramp descending directly from front to rear */}
          <polygon points="28,25 75,17 68,12 20,20" fill={floorFill} stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />

          {/* Rear drainage trench gap */}
          <polygon points="20,20 68,12 68,10 20,18" fill={slotFill} stroke={stroke} strokeWidth="1" strokeLinejoin="round" />
        </>
      )}

      {/* 8. MODEL WDT: Deep Rectangular Trough (Exact match to Reference Image 7 - Highlighted Card) */}
      {isWashdesk && (
        <>
          {/* Left wall with curved front-bottom corner & bottom front edge */}
          <path
            d="M 17,18 L 17,32 C 17,38 22,41 28,41 L 75,33 L 75,18"
            fill={underbelly}
            stroke={stroke}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Front face with curved bottom edge */}
          <path
            d="M 28,26 L 75,18 L 75,33 L 28,41 Z"
            fill={rimFill}
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Top rim opening */}
          <polygon points="17,18 64,10 75,18 28,26" fill={rimFill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />

          {/* Inner wall thickness lip reveal */}
          <polygon points="19,19 63,11.5 73,18.5 29,26" fill={floorFill} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />

          {/* Inner trough floor */}
          <polygon points="23,30 65,22 70,26 29,34" fill={floorFill} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />

          {/* Rear wall overflow slot */}
          <ellipse cx="36" cy="15" rx="2.5" ry="1.1" fill={slotFill} transform="rotate(-11 36 15)" />

          {/* Centered concentric pop-up drain */}
          <ellipse cx="46" cy="28" rx="4.2" ry="2.2" fill={wallDrop} stroke={stroke} strokeWidth="1.2" />
          <ellipse cx="46" cy="28" rx="2.2" ry="1.1" fill={stroke} />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 4. DOWNSTAND / APRON DIAGRAM
// ============================================================================
export function DownstandDiagram({
  preset,
  heightMm,
  active = false,
}: {
  preset?: '12' | '30' | '100' | '150' | '200' | 'front' | 'sides' | string;
  heightMm?: number;
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#4a5249';
  const fill = active ? 'rgba(212, 56, 51, 0.12)' : 'rgba(30, 33, 29, 0.04)';
  const accent = active ? '#d43833' : '#737e73';

  const heights: Record<string, number> = {
    '12': 8,
    '30': 14,
    '100': 24,
    '150': 30,
    '200': 36,
  };
  const effectivePreset = heightMm !== undefined ? String(heightMm) : (preset || '100');
  const h = heights[effectivePreset] || (heightMm ? Math.max(8, Math.min(36, heightMm / 5)) : 24);

  return (
    <svg viewBox="0 0 80 50" width="100%" height="44" style={{ display: 'block' }}>
      {/* Top Worktop Surface (Isometric Perspective) */}
      <polygon points="12,12 48,12 68,18 32,18" fill="rgba(255,255,255,0.7)" stroke={stroke} strokeWidth="1.2" />

      {/* Front Mitred Downstand Fascia Drop */}
      <polygon
        points={`32,18 68,18 68,${18 + h} 32,${18 + h}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />

      {/* Side Return Apron */}
      <polygon
        points={`12,12 32,18 32,${18 + h} 12,${12 + h}`}
        fill={active ? 'rgba(212,56,51,0.2)' : 'rgba(30,33,29,0.08)'}
        stroke={stroke}
        strokeWidth="1.2"
      />

      {/* Mitred 45° Corner Line */}
      <line x1="32" y1="18" x2="32" y2={18 + h} stroke={accent} strokeWidth="1.2" />

      {/* Height Dimension Leader */}
      <line x1="72" y1="18" x2="72" y2={18 + h} stroke={accent} strokeWidth="1" strokeDasharray="1,1" />
      <line x1="70" y1="18" x2="74" y2="18" stroke={accent} strokeWidth="1" />
      <line x1="70" y1={18 + h} x2="74" y2={18 + h} stroke={accent} strokeWidth="1" />
      <text x="76" y={18 + h / 2 + 2} fill={accent} fontSize="6" fontFamily="DM Mono, monospace">
        {effectivePreset === 'front' ? 'F' : effectivePreset === 'sides' ? 'S' : `${effectivePreset}mm`}
      </text>
    </svg>
  );
}

// ============================================================================
// 5. UPSTAND / SPLASHBACK DIAGRAM
// ============================================================================
export function UpstandDiagram({
  type,
  mode,
  coved,
  isCoved,
  active = false,
}: {
  type?: 'none' | 'standard' | 'coved' | 'full' | string;
  mode?: string;
  coved?: boolean;
  isCoved?: boolean;
  active?: boolean;
}) {
  const currentMode = mode || type || 'standard';
  const covedActive = coved ?? isCoved ?? (currentMode === 'coved');
  const stroke = active ? '#d43833' : '#4a5249';
  const fill = active ? 'rgba(212, 56, 51, 0.12)' : 'rgba(30, 33, 29, 0.04)';
  const accent = active ? '#d43833' : '#737e73';

  return (
    <svg viewBox="0 0 80 50" width="100%" height="44" style={{ display: 'block' }}>
      {/* Wall Line (Left) */}
      <line x1="18" y1="6" x2="18" y2="44" stroke="#c8c6be" strokeWidth="1.5" strokeDasharray="2,2" />

      {currentMode === 'none' && (
        <>
          {/* Flush Worktop directly touching wall without upstand */}
          <polygon points="18,34 70,34 70,42 18,42" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <text x="44" y="24" fill={accent} fontSize="6.5" fontFamily="DM Mono, monospace" textAnchor="middle">
            NO UPSTAND
          </text>
        </>
      )}

      {(currentMode === 'standard' || currentMode === 'specific' || (!covedActive && currentMode !== 'none' && currentMode !== 'full')) && (
        <>
          {/* Worktop */}
          <polygon points="26,34 70,34 70,42 18,42 18,34" fill={fill} stroke={stroke} strokeWidth="1.5" />
          {/* 90° Standard Upstand Lip */}
          <rect x="18" y="20" width="8" height="14" fill={active ? 'rgba(212,56,51,0.2)' : 'rgba(30,33,29,0.08)'} stroke={stroke} strokeWidth="1.5" />
          <line x1="26" y1="34" x2="18" y2="34" stroke={accent} strokeWidth="1" strokeDasharray="1,1" />
          <text x="44" y="22" fill={accent} fontSize="6" fontFamily="DM Mono, monospace">
            80mm LIP
          </text>
        </>
      )}

      {(currentMode === 'coved' || (covedActive && currentMode !== 'none' && currentMode !== 'full')) && (
        <>
          {/* Coved Seamless Fusion Concave Curve */}
          <path
            d="M 18,16 L 24,16 L 24,28 Q 24,34 32,34 L 70,34 L 70,42 L 18,42 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Coved Radius Arc Guide */}
          <circle cx="28" cy="30" r="1.5" fill={accent} />
          <text x="42" y="22" fill={accent} fontSize="6" fontFamily="DM Mono, monospace">
            R10 COVED
          </text>
        </>
      )}

      {currentMode === 'full' && (
        <>
          {/* High 300mm Full Splashback Panel */}
          <polygon points="26,34 70,34 70,42 18,42 18,8 26,8 26,34" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <line x1="26" y1="8" x2="26" y2="34" stroke={accent} strokeWidth="1.2" />
          <text x="42" y="16" fill={accent} fontSize="6" fontFamily="DM Mono, monospace">
            300mm WALL
          </text>
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 6. TOWEL HOLDER CUTOUT DIAGRAM
// ============================================================================
export function TowelHolderDiagram({
  position = 'center',
  fillet = 12,
  cornerRadius,
  lengthMm,
  active = false,
}: {
  position?: 'left' | 'center' | 'right';
  fillet?: 4 | 12 | 25 | number;
  cornerRadius?: number;
  lengthMm?: number;
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#4a5249';
  const fill = active ? 'rgba(212, 56, 51, 0.12)' : 'rgba(30, 33, 29, 0.04)';
  const slotFill = active ? '#ffffff' : '#faf9f5';
  const accent = active ? '#d43833' : '#737e73';
  const effectiveFillet = cornerRadius || fillet || 12;

  const xPositions: Record<string, number> = {
    left: 14,
    center: 26,
    right: 38,
  };
  const slotX = xPositions[position] || 26;

  return (
    <svg viewBox="0 0 80 50" width="100%" height="44" style={{ display: 'block' }}>
      {/* Front Vanity Fascia Apron */}
      <rect x="8" y="10" width="64" height="30" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />

      {/* Towel Slot Cutout */}
      <rect
        x={slotX}
        y="21"
        width="28"
        height="8"
        rx={effectiveFillet >= 25 ? 4 : effectiveFillet >= 12 ? 2.5 : 1}
        fill={slotFill}
        stroke={stroke}
        strokeWidth="1.4"
      />

      {/* CNC Center Axis Marker */}
      <line x1={slotX + 14} y1="16" x2={slotX + 14} y2="34" stroke={accent} strokeWidth="0.8" strokeDasharray="2,2" />
      <text x="40" y="46" fill={accent} fontSize="6" fontFamily="DM Mono, monospace" textAnchor="middle">
        {lengthMm ? `${lengthMm}mm` : `${(position || 'right').toUpperCase()} · R${effectiveFillet}mm`}
      </text>
    </svg>
  );
}

// ============================================================================
// 7. TOP EDGE FINISH DIAGRAM (Profile Section)
// ============================================================================
export function EdgeFinishDiagram({
  type,
  radius = 6,
  radiusMm,
  chamferMm,
  active = false,
}: {
  type: 'sharp' | 'fillet' | 'chamfer';
  radius?: number;
  radiusMm?: number;
  chamferMm?: number;
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#4a5249';
  const fill = active ? 'rgba(212, 56, 51, 0.12)' : 'rgba(30, 33, 29, 0.04)';
  const accent = active ? '#d43833' : '#737e73';
  const effectiveRadius = radiusMm || radius || 6;

  return (
    <svg viewBox="0 0 80 50" width="100%" height="44" style={{ display: 'block' }}>
      {type === 'sharp' && (
        <>
          {/* Micro-Arris Sharp Pencil Corner */}
          <polygon points="16,40 16,14 64,14 64,40" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <circle cx="16" cy="14" r="2" fill={accent} />
          <text x="40" y="32" fill={accent} fontSize="6" fontFamily="DM Mono, monospace" textAnchor="middle">
            SHARP ARRIS
          </text>
        </>
      )}

      {type === 'fillet' && (
        <>
          {/* Rounded Top Edge Bullnose */}
          <path
            d="M 16,40 L 16,22 Q 16,14 26,14 L 64,14 L 64,40 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
          />
          {/* Radius Dimension Arc */}
          <path d="M 18,22 Q 18,16 24,16" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="1,1" />
          <text x="40" y="32" fill={accent} fontSize="6" fontFamily="DM Mono, monospace" textAnchor="middle">
            R{effectiveRadius}mm FILLET
          </text>
        </>
      )}

      {type === 'chamfer' && (
        <>
          {/* 45° Chamfer Bevel Profile */}
          <polygon points="16,40 16,24 26,14 64,14 64,40" fill={fill} stroke={stroke} strokeWidth="1.6" />
          <line x1="16" y1="24" x2="26" y2="14" stroke={accent} strokeWidth="1.2" />
          <text x="40" y="32" fill={accent} fontSize="6" fontFamily="DM Mono, monospace" textAnchor="middle">
            {chamferMm ? `${chamferMm}mm BEVEL` : '45° BEVEL'}
          </text>
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 8. DRAIN ACCESSORY THUMBNAIL
// ============================================================================
export function DrainTypeThumbnail({
  type,
  materialColor = '#f3f2ee',
  colorHex,
  active = false,
}: {
  type: string;
  materialColor?: string;
  colorHex?: string;
  active?: boolean;
}) {
  const stroke = active ? '#d43833' : '#3c423c';
  const effectiveColor = colorHex || materialColor;
  const isCorianCap = type.includes('corian');

  return (
    <svg viewBox="0 0 80 50" width="100%" height="44" style={{ display: 'block' }}>
      {/* Waste Pipe Thread / Collar */}
      <rect x="34" y="26" width="12" height="16" fill="#888" stroke="#555" strokeWidth="1" />
      <line x1="34" y1="31" x2="46" y2="31" stroke="#444" strokeWidth="0.8" />
      <line x1="34" y1="36" x2="46" y2="36" stroke="#444" strokeWidth="0.8" />

      {/* Chrome Drain Flange Rim */}
      <ellipse cx="40" cy="24" rx="22" ry="7" fill="#e4e4df" stroke="#666" strokeWidth="1.2" />

      {type.includes('click-clack') && (
        <>
          {/* Spring Pop-Up Disc */}
          <ellipse
            cx="40"
            cy="18"
            rx="16"
            ry="5.5"
            fill={isCorianCap ? effectiveColor : '#ffffff'}
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Specular Sheen */}
          <ellipse cx="38" cy="17" rx="10" ry="2.5" fill="rgba(255,255,255,0.6)" />
        </>
      )}

      {type.includes('freeflow') && (
        <>
          {/* Slotted Flush Grate */}
          <ellipse cx="40" cy="23" rx="16" ry="5" fill={isCorianCap ? effectiveColor : '#333'} stroke={stroke} strokeWidth="1.2" />
          <line x1="32" y1="23" x2="48" y2="23" stroke="#fff" strokeWidth="1" />
          <line x1="35" y1="21" x2="45" y2="21" stroke="#fff" strokeWidth="1" />
          <line x1="35" y1="25" x2="45" y2="25" stroke="#fff" strokeWidth="1" />
        </>
      )}

      {type.includes('rubber-plug') && (
        <>
          {/* Classic Rubber Plug */}
          <ellipse cx="40" cy="22" rx="14" ry="4.5" fill="#222" stroke="#111" strokeWidth="1.2" />
          <circle cx="40" cy="18" r="2.5" fill="none" stroke="#888" strokeWidth="1.2" />
          <path d="M 40,16 Q 48,12 56,18 Q 62,24 64,34" fill="none" stroke="#aaa" strokeWidth="0.9" strokeDasharray="1,1" />
        </>
      )}
    </svg>
  );
}

// ============================================================================
// 9. REUSABLE TECHNICAL OPTION CARD
// ============================================================================
export interface TechnicalOptionCardProps {
  label?: string;
  title?: string;
  code?: string;
  subtitle?: string;
  badge?: string;
  active?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltip?: string;
  children: React.ReactNode;
}

export function TechnicalOptionCard({
  label,
  title,
  code,
  subtitle,
  badge,
  active = false,
  isActive = false,
  disabled = false,
  onClick,
  tooltip,
  children,
}: TechnicalOptionCardProps) {
  const isCurrentActive = Boolean(active || isActive);
  const displayTitle = title || label || '';
  const displaySubtitle = subtitle || code;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip || displayTitle}
      style={{
        position: 'relative',
        background: isCurrentActive ? '#ffffff' : disabled ? '#f0eee8' : '#faf9f5',
        border: isCurrentActive ? '1.5px solid var(--brand-red, #d43833)' : '1px solid rgba(30, 33, 29, 0.14)',
        borderRadius: '2px',
        padding: '10px 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isCurrentActive ? '0 2px 10px rgba(212,56,51,0.12)' : 'none',
        outline: 'none',
        minHeight: '84px',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!isCurrentActive && !disabled) {
          e.currentTarget.style.borderColor = 'rgba(30, 33, 29, 0.35)';
          e.currentTarget.style.background = '#ffffff';
        }
      }}
      onMouseLeave={e => {
        if (!isCurrentActive && !disabled) {
          e.currentTarget.style.borderColor = 'rgba(30, 33, 29, 0.14)';
          e.currentTarget.style.background = '#faf9f5';
        }
      }}
    >
      {/* Top Technical Badge */}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '5px',
            fontSize: '8px',
            fontFamily: 'DM Mono, monospace',
            letterSpacing: '0.04em',
            padding: '1px 4px',
            borderRadius: '2px',
            background: isCurrentActive ? 'rgba(212,56,51,0.12)' : 'rgba(30,33,29,0.06)',
            color: isCurrentActive ? 'var(--brand-red, #d43833)' : '#737e73',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      )}

      {/* Diagram Canvas */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>

      {/* Label and Code */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: '6px' }}>
        <div
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            fontWeight: isCurrentActive ? 600 : 500,
            color: isCurrentActive ? 'var(--brand-red, #d43833)' : '#1e211d',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        >
          {displayTitle}
        </div>
        {displaySubtitle && (
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '8.5px',
              color: '#8b948b',
              marginTop: '2px',
            }}
          >
            {displaySubtitle}
          </div>
        )}
      </div>
    </button>
  );
}
