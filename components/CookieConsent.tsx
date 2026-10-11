'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'acespaces_cookie_consent_v1';

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    functional: false,
    timestamp: '',
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPreferences(parsed);
      } else {
        // Delay opening slightly for smooth entrance after initial hero render
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const saveConsent = useCallback((newPrefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (e) {
      console.warn('Unable to persist cookie consent:', e);
    }
    setPreferences(newPrefs);
    setIsOpen(false);
    setShowPreferences(false);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie-consent-updated', { detail: newPrefs })
      );
    }
  }, []);

  // Handler to open preferences dialog from outside (e.g. from footer)
  useEffect(() => {
    const handleOpen = () => {
      setShowPreferences(true);
      setIsOpen(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpen);
    return () => window.removeEventListener('open-cookie-preferences', handleOpen);
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      functional: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      functional: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent({
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Preferences"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '520px',
        margin: '0 auto 0 0',
        zIndex: 99990,
        backgroundColor: '#181a17',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderLeft: '3px solid var(--brand-red, #d43833)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3)',
        color: '#e9e8e2',
        fontFamily: 'Manrope, sans-serif',
        padding: '22px 24px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-red, #d43833)' }} />
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#a0aba0',
            }}
          >
            Privacy &amp; Telemetry Protocol
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Dismiss banner"
          style={{
            background: 'none',
            border: 'none',
            color: '#7e897e',
            cursor: 'pointer',
            padding: '4px',
            lineHeight: 1,
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      <p
        style={{
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#c4cdc4',
          margin: '0 0 16px 0',
        }}
      >
        We use essential cookies to ensure sample tray persistence, CAD access, and secure communication. Optional performance telemetry helps us refine architectural specifier workflows.
      </p>

      {showPreferences && (
        <div
          role="dialog"
          aria-label="Cookie Preferences"
          style={{
            backgroundColor: '#111310',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Essential Category */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0efe9' }}>Strictly Essential</div>
              <div style={{ fontSize: '11px', color: '#8c968c', lineHeight: 1.4 }}>Security, sample tray state, CSRF tokens</div>
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#73c991', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Required
            </span>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Performance & Analytics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0efe9' }}>Performance &amp; Diagnostics</div>
              <div style={{ fontSize: '11px', color: '#8c968c', lineHeight: 1.4 }}>Anonymous speed metrics &amp; spec sheet downloads</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                style={{ cursor: 'pointer', accentColor: 'var(--brand-red, #d43833)', width: '15px', height: '15px' }}
              />
            </label>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

          {/* Functional Preferences */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0efe9' }}>Architectural Preferences</div>
              <div style={{ fontSize: '11px', color: '#8c968c', lineHeight: 1.4 }}>Saved filter settings and specimen view modes</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                style={{ cursor: 'pointer', accentColor: 'var(--brand-red, #d43833)', width: '15px', height: '15px' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Buttons Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        {showPreferences ? (
          <>
            <button
              onClick={handleSavePreferences}
              style={{
                backgroundColor: 'var(--brand-red, #d43833)',
                color: '#fff',
                border: 'none',
                padding: '9px 18px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Save Preferences
            </button>
            <button
              onClick={() => setShowPreferences(false)}
              style={{
                backgroundColor: 'transparent',
                color: '#b0bcb0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '9px 16px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAcceptAll}
              style={{
                backgroundColor: 'var(--brand-red, #d43833)',
                color: '#fff',
                border: 'none',
                padding: '9px 18px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Accept All
            </button>
            <button
              onClick={handleRejectAll}
              style={{
                backgroundColor: 'transparent',
                color: '#e9e8e2',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '9px 16px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
            >
              Essential Only
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#8c968c',
                border: 'none',
                padding: '9px 12px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Preferences
            </button>
          </>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <Link
            href="/privacy"
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              color: '#7e897e',
              textDecoration: 'none',
            }}
          >
            Privacy Policy ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
