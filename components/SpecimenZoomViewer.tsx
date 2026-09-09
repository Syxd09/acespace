'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface SpecimenZoomViewerProps {
  textureImage?: string;
  applicationImage?: string;
  materialName: string;
  materialFinish?: string;
  materialColour?: string;
  fallbackBg?: string;
  textureCss?: string;
  initialView?: 'texture' | 'application';
  aspectRatio?: string;
  minHeight?: string;
  className?: string;
}

export default function SpecimenZoomViewer({
  textureImage,
  applicationImage,
  materialName,
  materialFinish = 'Polished Honed',
  materialColour = '',
  fallbackBg = '#dcd7cd',
  textureCss,
  initialView = 'texture',
  minHeight = '320px',
}: SpecimenZoomViewerProps) {
  // Toggle between 1:1 macro texture and architectural in-situ application
  const hasBoth = Boolean(textureImage && applicationImage);
  const [activeView, setActiveView] = useState<'texture' | 'application'>(
    textureImage ? initialView : 'application'
  );

  const currentImage =
    activeView === 'texture'
      ? textureImage || applicationImage
      : applicationImage || textureImage;

  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  // Clamping zoom boundaries
  const minScale = 1;
  const maxScale = isFullscreen ? 5 : 4;
  const progressRatio = Math.min(Math.max((scale - minScale) / (maxScale - minScale), 0), 1);

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScale((prev) => {
      const next = Math.min(Number((prev + 0.5).toFixed(1)), maxScale);
      return next;
    });
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScale((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(1)), minScale);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Double click toggles zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2.5);
    }
  };

  // Wheel zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0025;
    setScale((prev) => {
      const next = Math.min(Math.max(Number((prev + delta).toFixed(2)), 1), isFullscreen ? 5 : 4);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  }, [isFullscreen]);

  // Lock document body scroll while in fullscreen loupe mode to prevent layout shift
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  // Attach non-passive wheel listener to container so browser doesn't block preventDefault
  useEffect(() => {
    const target = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (!target) return;

    target.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      target.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, isFullscreen]);

  // Keyboard navigation when in fullscreen or focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        handleResetZoom();
      } else if (e.key === '+' || e.key === '=') {
        setScale((prev) => Math.min(prev + 0.5, maxScale));
      } else if (e.key === '-' || e.key === '_') {
        setScale((prev) => {
          const next = Math.max(prev - 0.5, 1);
          if (next <= 1) setPosition({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, maxScale]);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Constrain panning within bounds relative to scale
    const activeRef = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    const rect = activeRef?.getBoundingClientRect();
    const maxBoundX = rect ? (rect.width * (scale - 1)) / 2 : 200 * scale;
    const maxBoundY = rect ? (rect.height * (scale - 1)) / 2 : 200 * scale;

    setPosition({
      x: Math.min(Math.max(newX, -maxBoundX), maxBoundX),
      y: Math.min(Math.max(newY, -maxBoundY), maxBoundY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture support for mobile pinch-to-zoom and drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistance;
      setScale((prev) => {
        const next = Math.min(Math.max(prev * factor, 1), 4);
        if (next <= 1) setPosition({ x: 0, y: 0 });
        return next;
      });
      setTouchDistance(dist);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        style={{
          position: 'relative',
          width: '100%',
          minHeight,
          height: '100%',
          background: textureCss || fallbackBg,
          overflow: 'hidden',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={scale > 1 ? 'Drag to pan across texture' : 'Scroll wheel or click + to zoom into surface'}
      >
        {/* Render Image with CSS Transform */}
        {currentImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >
            <img
              src={currentImage}
              alt={`${materialName} - ${activeView}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* View Mode Switcher (1:1 Texture vs In-Situ Application) */}
        {/* View Mode Switcher (1:1 Texture vs In-Situ Application) - Centered at Top */}
        {hasBoth && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              background: 'rgba(233, 232, 226, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--line)',
              padding: '2px',
              borderRadius: '100px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setActiveView('texture');
                handleResetZoom();
              }}
              style={{
                padding: '4px 12px',
                fontSize: '9px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '100px',
                background: activeView === 'texture' ? 'var(--ink)' : 'transparent',
                color: activeView === 'texture' ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              1:1 Texture
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('application');
                handleResetZoom();
              }}
              style={{
                padding: '4px 12px',
                fontSize: '9px',
                fontFamily: 'DM Mono, monospace',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '100px',
                background: activeView === 'application' ? 'var(--ink)' : 'transparent',
                color: activeView === 'application' ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              In-Situ
            </button>
          </div>
        )}

        {/* Floating Zoom Controls Bar - CENTERED at Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'rgba(233, 232, 226, 0.96)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--line)',
            padding: '3px 8px',
            borderRadius: '100px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            whiteSpace: 'nowrap',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= minScale}
            title="Zoom Out (−)"
            style={{
              width: '26px',
              height: '26px',
              display: 'grid',
              placeItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: scale <= minScale ? 'default' : 'pointer',
              opacity: scale <= minScale ? 0.35 : 1,
              color: 'var(--ink)',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: 1,
              transition: 'background 0.15s ease',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              if (scale > minScale) e.currentTarget.style.background = 'rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            −
          </button>

          {/* Zoom Level Indicator */}
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'DM Mono, monospace',
              color: 'var(--ink)',
              minWidth: '38px',
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {zoomPercent}%
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= maxScale}
            title="Zoom In (+)"
            style={{
              width: '26px',
              height: '26px',
              display: 'grid',
              placeItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: scale >= maxScale ? 'default' : 'pointer',
              opacity: scale >= maxScale ? 0.35 : 1,
              color: 'var(--ink)',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: 1,
              transition: 'background 0.15s ease',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              if (scale < maxScale) e.currentTarget.style.background = 'rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            +
          </button>

          {/* Reset Zoom Button */}
          {scale > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom (0)"
              style={{
                fontSize: '9px',
                fontFamily: 'DM Mono, monospace',
                background: 'rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.1)',
                color: 'var(--ink)',
                padding: '2px 5px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                borderRadius: '2px',
                marginLeft: '2px',
              }}
            >
              Reset
            </button>
          )}

          {/* Divider */}
          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.15)', margin: '0 2px' }} />

          {/* Fullscreen Expansion Button */}
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(true);
            }}
            title="Inspect Ultra-High Resolution (Fullscreen)"
            style={{
              width: '26px',
              height: '26px',
              display: 'grid',
              placeItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              fontSize: '13px',
              lineHeight: 1,
              transition: 'background 0.15s ease',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Expand texture fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Fullscreen Ultra-Res Loupe Modal Portal */}
      {isFullscreen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              maxWidth: '100vw',
              maxHeight: '100vh',
              background: 'rgba(10, 12, 10, 0.96)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 9999999,
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalFadeIn 0.2s ease-out',
            }}
            onClick={() => {
              setIsFullscreen(false);
              handleResetZoom();
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(18, 21, 18, 0.8)',
                zIndex: 20,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    color: '#9aa398',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  Ultra-Resolution Specimen Inspector
                </span>
                <h3
                  style={{
                    color: '#f4f3ef',
                    fontSize: '18px',
                    fontWeight: 400,
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {materialName}{' '}
                  <span style={{ fontSize: '13px', color: '#9aa398', fontFamily: 'DM Mono, monospace' }}>
                    · {materialFinish} {materialColour ? `(${materialColour})` : ''}
                  </span>
                </h3>
              </div>

              {/* View Switcher in Fullscreen - Centered Capsule Pill */}
              {hasBoth && (
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    padding: '3px',
                    borderRadius: '100px',
                    gap: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('texture');
                      handleResetZoom();
                    }}
                    style={{
                      padding: '5px 14px',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderRadius: '100px',
                      background: activeView === 'texture' ? '#f4f3ef' : 'transparent',
                      color: activeView === 'texture' ? '#181b18' : '#e0dfd5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    1:1 Macro Texture
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('application');
                      handleResetZoom();
                    }}
                    style={{
                      padding: '5px 14px',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderRadius: '100px',
                      background: activeView === 'application' ? '#f4f3ef' : 'transparent',
                      color: activeView === 'application' ? '#181b18' : '#e0dfd5',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    In-Situ Architectural
                  </button>
                </div>
              )}

              {/* Close Fullscreen Button */}
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  handleResetZoom();
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '20px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                title="Close Fullscreen (Esc)"
                aria-label="Close fullscreen"
              >
                ✕
              </button>
            </div>

            {/* Canvas Viewport */}
            <div
              ref={fullscreenContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
              style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {currentImage && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'transform',
                  }}
                >
                  <img
                    src={currentImage}
                    alt={`${materialName} - Fullscreen`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              )}

              {/* Fullscreen Bottom Controls Floating Pill - Perfectly Centered & Concentric */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '28px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(22, 25, 22, 0.94)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55)',
                  zIndex: 30,
                  whiteSpace: 'nowrap',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Zoom Out Button */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={scale <= minScale}
                  title="Zoom Out (−)"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: scale <= minScale ? 'default' : 'pointer',
                    opacity: scale <= minScale ? 0.3 : 1,
                    display: 'grid',
                    placeItems: 'center',
                    lineHeight: 1,
                    padding: 0,
                    margin: 0,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (scale > minScale) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  −
                </button>

                {/* Range Slider with Mathematically Concentric Track Line & Centered Ball */}
                <div
                  style={{
                    position: 'relative',
                    width: '120px',
                    height: '32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    margin: '0 4px',
                  }}
                >
                  {/* Background Track Line - Exactly at 50% vertical midline */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '7px',
                      right: '7px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.28)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Active Progress Track Line - Highlighted up to the center of the ball */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '7px',
                      width: `calc(${progressRatio} * (100% - 14px))`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '3px',
                      borderRadius: '3px',
                      background: 'rgba(244, 243, 239, 0.85)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* The Ball (Small Circle) - DEAD CENTER Concentric on the Line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `calc(7px + ${progressRatio} * (100% - 14px))`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#f4f3ef',
                      border: '1.5px solid rgba(22, 25, 22, 0.95)',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.55)',
                      pointerEvents: 'none',
                      transition: 'transform 0.12s ease',
                    }}
                  />

                  {/* Native Range Input Overlay - Intercepts all mouse, touch, and keyboard interactions */}
                  <input
                    type="range"
                    min={minScale}
                    max={maxScale}
                    step={0.05}
                    value={scale}
                    onChange={(e) => {
                      const next = parseFloat(e.target.value);
                      setScale(next);
                      if (next <= 1) setPosition({ x: 0, y: 0 });
                    }}
                    title="Drag to zoom"
                    aria-label="Specimen zoom scale"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      margin: 0,
                      padding: 0,
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* Zoom In Button */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={scale >= maxScale}
                  title="Zoom In (+)"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: scale >= maxScale ? 'default' : 'pointer',
                    opacity: scale >= maxScale ? 0.3 : 1,
                    display: 'grid',
                    placeItems: 'center',
                    lineHeight: 1,
                    padding: 0,
                    margin: 0,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (scale < maxScale) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  +
                </button>

                {/* Subtle Divider */}
                <div
                  style={{
                    width: '1px',
                    height: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    margin: '0 2px',
                  }}
                />

                {/* Zoom percentage badge */}
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    color: '#fff',
                    minWidth: '40px',
                    textAlign: 'center',
                    fontWeight: 500,
                    lineHeight: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '32px',
                  }}
                >
                  {zoomPercent}%
                </span>

                {/* Reset Zoom Button */}
                <button
                  type="button"
                  onClick={handleResetZoom}
                  disabled={scale <= 1.01}
                  title="Reset Zoom to 100% (0 / Esc)"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    background: scale > 1.01 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: scale > 1.01 ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                    padding: '0 10px',
                    height: '26px',
                    borderRadius: '100px',
                    cursor: scale > 1.01 ? 'pointer' : 'default',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (scale > 1.01) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    if (scale > 1.01) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  Reset (100%)
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
