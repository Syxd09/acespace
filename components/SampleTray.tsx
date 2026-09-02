'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSampleShortlist } from '@/context/SampleContext';

export default function SampleTray() {
  const { shortlist, removeSample, clearShortlist, isTrayOpen, setIsTrayOpen, toggleTray } = useSampleShortlist();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    studio: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    projectType: 'Residential',
  });

  if (shortlist.length === 0 && !isTrayOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setFormSubmitted(false);
    clearShortlist();
    setIsTrayOpen(false);
    setFormData({
      name: '',
      studio: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      projectType: 'Residential',
    });
  };

  return (
    <>
      {/* Floating Sample Shortlist Pill Trigger */}
      {!isTrayOpen && shortlist.length > 0 && (
        <button
          type="button"
          onClick={toggleTray}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 900,
            background: 'var(--ink)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '100px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            transition: 'transform 0.25s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--paper)',
              color: 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              fontWeight: 700,
            }}
          >
            {shortlist.length}
          </span>
          <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
            Sample Tray ({shortlist.length})
          </span>
          <span style={{ fontSize: '16px' }}>↗</span>
        </button>
      )}

      {/* Slide-over Sample Shortlist Drawer */}
      <div
        className={`mobile-overlay ${isTrayOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsTrayOpen(false);
        }}
        style={{ zIndex: 1100 }}
      >
        <div
          className="mobile-drawer"
          style={{
            width: 'min(92vw, 480px)',
            background: 'var(--paper)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="mobile-drawer-top" style={{ marginBottom: '20px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', margin: 0 }}>
                Architectural Specimen Box
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 400, margin: '4px 0 0', letterSpacing: '-0.03em' }}>
                Sample Shortlist ({shortlist.length})
              </h3>
            </div>
            <button
              className="mobile-close"
              onClick={() => setIsTrayOpen(false)}
              aria-label="Close sample tray"
            >
              ×
            </button>
          </div>

          {formSubmitted ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '28px',
                  margin: '0 auto 24px',
                }}
              >
                ✓
              </div>
              <p className="eyebrow" style={{ color: 'var(--muted)' }}>Sample Order Dispatched</p>
              <h2 style={{ fontSize: '32px', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.1 }}>
                Specimen box on its way to <i>{formData.studio || formData.name}.</i>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#5d665c', marginBottom: '32px' }}>
                We have logged your order for {shortlist.length} material specimens (100mm × 100mm). Our courier partner will deliver the sample box to <strong>{formData.address}, {formData.city}</strong> within 48–72 hours.
              </p>
              <button className="button button-dark" onClick={handleReset} style={{ justifyContent: 'center' }}>
                Done / Return to Palette <span>↗</span>
              </button>
            </div>
          ) : shortlist.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
              <span className="eyebrow" style={{ color: 'var(--muted)' }}>Tray Empty</span>
              <h3 style={{ fontSize: '28px', fontWeight: 400, margin: '12px 0 16px' }}>
                No specimens added yet.
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5d665c', marginBottom: '30px' }}>
                Browse our mineral palette and click <strong>"+ Add to Sample Tray"</strong> to compile your studio sample box.
              </p>
              <Link
                className="button button-dark"
                href="/materials"
                onClick={() => setIsTrayOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                Explore Materials <span>↗</span>
              </Link>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Selected Specimens (100mm × 100mm)
                </span>
                <button
                  onClick={clearShortlist}
                  style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>

              {/* Shortlist Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                {shortlist.map((mat) => (
                  <div
                    key={mat.slug}
                    style={{
                      background: '#dcd7cd',
                      padding: '14px 16px',
                      border: '1px solid var(--line)',
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 24px',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      className={`swatch ${mat.swatch}`}
                      style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                        {mat.name}
                      </strong>
                      <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {mat.finish} • 12mm Specimen
                      </span>
                    </div>
                    <button
                      onClick={() => removeSample(mat.slug)}
                      style={{ fontSize: '18px', color: 'var(--muted)', cursor: 'pointer' }}
                      aria-label={`Remove ${mat.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Sample Box Order Form */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
                <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '14px' }}>
                  Studio Dispatch Information
                </span>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Studio / Architectural Firm *"
                      required
                      value={formData.studio}
                      onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="email"
                      placeholder="Studio Email *"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone / Mobile *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Studio Delivery Address *"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="City *"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Postal Code *"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="submit"
                      className="button button-dark"
                      style={{ width: '100%', justifyContent: 'center', padding: '18px 24px' }}
                    >
                      Order Complimentary Sample Box ({shortlist.length}) <span>↗</span>
                    </button>
                    <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textAlign: 'center', marginTop: '10px', textTransform: 'uppercase' }}>
                      Free delivery to studios across India • 100mm × 100mm
                    </span>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
