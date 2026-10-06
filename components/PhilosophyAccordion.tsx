'use client';

import React, { useState, useEffect } from 'react';

export interface PhilosophyPillarItem {
  num: string;
  title: string;
  subtitle: string;
  body: string;
  detail?: string;
}

interface PhilosophyAccordionProps {
  pillars: PhilosophyPillarItem[];
}

export default function PhilosophyAccordion({ pillars }: PhilosophyAccordionProps) {
  // Store set of open indices
  // On desktop (>= 769px), all are open
  // On mobile (< 769px), only the first card (index 0) is open by default to conserve space
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // On mobile, collapse cards 1..N and keep only card 0 open by default
        setOpenIndices((prev) => (prev.length > 2 ? [0] : prev));
      } else {
        // On desktop, expand all 6 cards
        setOpenIndices([0, 1, 2, 3, 4, 5]);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = (index: number) => {
    if (!isMobile) return; // Desktop is a fixed full grid

    setOpenIndices((prev) => {
      if (prev.includes(index)) {
        // Allow collapsing if at least one remains or user closes it
        return prev.filter((i) => i !== index);
      } else {
        // Accordion behavior: open this card (optionally single open mode or multi)
        return [...prev, index];
      }
    });
  };

  return (
    <div className="philosophy-accordion-grid">
      {pillars.map((pillar, index) => {
        const isOpen = !isMobile || openIndices.includes(index);

        return (
          <details
            key={pillar.num || index}
            className="philosophy-detail-card"
            open={isOpen}
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleToggle(index);
              }
            }}
          >
            <summary className="philosophy-summary">
              <div>
                <span className="philosophy-num">{pillar.num} / Philosophy</span>
                <h3 className="philosophy-title">{pillar.title}</h3>
              </div>
              <span className="philosophy-indicator" aria-hidden="true" />
            </summary>
            <div className="philosophy-content">
              <div className="philosophy-subtitle">{pillar.subtitle}</div>
              <p className="philosophy-body">{pillar.body}</p>
              {pillar.detail && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    color: 'var(--muted)',
                  }}
                >
                  {pillar.detail}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
