'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteContent } from '@/context/SiteContentContext';
import {
  generateWhatsAppUrl,
  WHATSAPP_CONSULTATION_PROMPTS,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_DISPLAY,
} from '@/lib/whatsapp';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedNotice, setHasDismissedNotice] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const pathname = usePathname();
  const { content } = useSiteContent();

  const studioContact = content.studioContact;
  const whatsappNumber = studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const displayPhone = studioContact?.whatsappDisplay || DEFAULT_WHATSAPP_DISPLAY;
  const statusNote = studioContact?.availabilityStatus || 'Studio Online · Material Advisory';

  // Do not render on the admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleOpenWhatsApp = (text?: string) => {
    const url = generateWhatsAppUrl(whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) {
      handleOpenWhatsApp();
    } else {
      handleOpenWhatsApp(
        `Hello Ace Spaces Studio, regarding: ${customQuery.trim()}`
      );
    }
    setCustomQuery('');
  };

  return (
    <>
      {/* Floating Concierge Container */}
      <aside
        className="whatsapp-concierge-root"
        aria-label="Direct WhatsApp Studio Advisory"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 990,
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {/* Expanded Concierge Card */}
        {isOpen && (
          <div
            className="whatsapp-card"
            style={{
              position: 'absolute',
              bottom: '56px',
              right: '0',
              width: 'min(360px, calc(100vw - 32px))',
              background: '#141713',
              color: '#e9e8e2',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '6px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
              overflow: 'hidden',
              animation: 'conciergePopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Studio Header */}
            <div
              style={{
                padding: '18px 20px 14px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#25D366',
                      boxShadow: '0 0 10px #25D366',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#a0aba0',
                    }}
                  >
                    Ace Spaces Studio Desk
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    margin: 0,
                    color: '#f4f3ef',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Material & Fabrication Advisory
                </h4>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#8c968c',
                    marginTop: '2px',
                    fontFamily: 'DM Mono, monospace',
                  }}
                >
                  Direct WhatsApp Liaison · {displayPhone}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close WhatsApp Consultation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a0aba0',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a0aba0')}
              >
                ✕
              </button>
            </div>

            {/* Content & Quick Topics */}
            <div style={{ padding: '16px 20px 20px' }}>
              <p
                style={{
                  fontSize: '12px',
                  lineHeight: '1.55',
                  color: '#b8c2b8',
                  margin: '0 0 14px 0',
                }}
              >
                Connect directly with our Bengaluru technical team for slab inquiries, joint details, and sample dispatch.
              </p>

              {/* Consultation Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '9px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#717c71',
                  }}
                >
                  Select Consultation Topic:
                </span>
                {WHATSAPP_CONSULTATION_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => handleOpenWhatsApp(prompt.message)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#e9e8e2',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(37, 211, 102, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <span>
                      <span style={{ marginRight: '6px' }}>{prompt.icon}</span>
                      {prompt.label}
                    </span>
                    <span style={{ opacity: 0.6, fontSize: '11px' }}>↗</span>
                  </button>
                ))}
              </div>

              {/* Custom message prompt */}
              <form onSubmit={handleCustomSubmit}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Or type inquiry / project name..."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '3px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#25D366',
                      color: '#0e2b15',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '0 14px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Send ↗
                  </button>
                </div>
              </form>

              {/* Status Note Footer */}
              <div
                style={{
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  color: '#717c71',
                }}
              >
                <span>Bengaluru UTC+5:30</span>
                <span style={{ color: '#25D366' }}>● Available on WhatsApp</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Trigger Pill */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Direct WhatsApp Studio Consultation"
          className="whatsapp-trigger-pill"
          style={{
            background: isOpen ? '#1a1d19' : 'rgba(20, 23, 19, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#f4f3ef',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '100px',
            padding: '8px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isOpen ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.6)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
          }}
        >
          {/* WhatsApp Icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#25D366',
              display: 'grid',
              placeItems: 'center',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>

          {/* Text & Active Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#f4f3ef',
                }}
              >
                WhatsApp Advisory
              </span>
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#25D366',
                  display: 'inline-block',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '9px',
                color: '#8c968c',
                fontFamily: 'DM Mono, monospace',
                letterSpacing: '0.02em',
              }}
            >
              Direct Studio Line
            </span>
          </div>

          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#25D366',
              marginLeft: '2px',
            }}
          >
            {isOpen ? '✕' : '↗'}
          </span>
        </button>
      </aside>

      <style jsx global>{`
        @keyframes conciergePopIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 640px) {
          .whatsapp-concierge-root {
            bottom: 16px !important;
            right: 16px !important;
          }
          .whatsapp-trigger-pill {
            padding: 6px 12px !important;
          }
        }
      `}</style>
    </>
  );
}
