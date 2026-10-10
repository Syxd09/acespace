'use client';

import React, { useState, useEffect } from 'react';
import { broadcastRealtimeEvent } from '@/lib/realtime';

const TYPOLOGY_PRESETS = [
  'Material Specification & Samples',
  'CAD / CNC Drawing Review',
  'Residential Monolith / Island',
  'Commercial Reception / Facade',
  'Backlit Translucent Surface',
  'Atelier Visit & Inspection',
];

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inquiryNumber, setInquiryNumber] = useState<string>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [message, setMessage] = useState('');

  // Listen for preset triggers from pathway cards
  useEffect(() => {
    const handleTypologySelect = (e: CustomEvent<string>) => {
      if (e.detail) {
        setProjectType(e.detail);
        const formEl = document.getElementById('enquiry');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('select-typology' as any, handleTypologySelect as any);
    return () => {
      window.removeEventListener('select-typology' as any, handleTypologySelect as any);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          projectType: projectType || 'General Consultation',
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.inquiryNumber) {
          setInquiryNumber(data.inquiryNumber);
        }
        setSubmitted(true);
        // Instant broadcast to Admin Console
        broadcastRealtimeEvent('INQUIRY_CREATED', data.inquiry || { name, email, phone });
      } else {
        setErrorMessage(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Network error while sending enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setProjectType('');
    setMessage('');
    setInquiryNumber('');
    setErrorMessage(null);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: '#e4e1d7',
          border: '1px solid var(--line)',
          padding: '40px 36px',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 80px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--ink)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
            fontSize: '20px',
          }}
        >
          ✓
        </div>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '8px' }}>
          Consultation Brief Logged
        </p>
        {inquiryNumber && (
          <div
            style={{
              display: 'inline-block',
              margin: '0 auto 14px',
              background: '#dcd7cd',
              border: '1px solid var(--line)',
              padding: '6px 14px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ref: <strong>{inquiryNumber}</strong>
          </div>
        )}
        <h3 style={{ fontSize: '26px', fontWeight: 400, margin: '0 0 14px' }}>
          Thank you, <i>{name}.</i>
        </h3>
        <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#5d665c', maxWidth: '480px', margin: '0 auto 24px' }}>
          Our architectural technical team has received your brief for <strong>{projectType || 'your project'}</strong>. A material specialist will review your specifications and reach out to <strong>{email}</strong> {phone ? `or ${phone}` : ''} within 24 hours.
        </p>
        <button className="button button-dark" onClick={handleReset} style={{ margin: '0 auto' }}>
          Submit Another Consultation <span>↗</span>
        </button>
      </div>
    );
  }

  return (
    <form className="spec-table" id="enquiry" onSubmit={handleSubmit} style={{ marginBottom: '80px' }}>
      {errorMessage && (
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(215, 65, 50, 0.1)',
            border: '1px solid rgba(215, 65, 50, 0.3)',
            color: '#b93222',
            fontSize: '13px',
            fontFamily: 'DM Mono, monospace',
            marginBottom: '16px',
          }}
        >
          ⚠ {errorMessage}
        </div>
      )}

      <div className="spec-row">
        <span>Name *</span>
        <input
          required
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="spec-row">
        <span>Email *</span>
        <input
          required
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="spec-row">
        <span>Phone / Mobile</span>
        <input
          type="tel"
          placeholder="+91 98000 00000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="spec-row">
        <span>Project Typology</span>
        <div>
          <div className="typology-pills">
            {TYPOLOGY_PRESETS.map((preset) => {
              const isSelected = projectType === preset;
              return (
                <button
                  type="button"
                  key={preset}
                  className={`typology-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setProjectType(isSelected ? '' : preset)}
                  disabled={isSubmitting}
                >
                  {preset}
                </button>
              );
            })}
          </div>
          <input
            placeholder="Or type custom scope (e.g. Residential island, reception monolith, hotel vanity…)"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="spec-row">
        <span>Message & Brief *</span>
        <div>
          <textarea
            required
            rows={4}
            placeholder="Describe the architectural scope, dimensions, required solid surface thicknesses (6mm / 12mm / 19mm), edge details, and expected schedule…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#5d665c', fontFamily: 'DM Mono, monospace', lineHeight: 1.5 }}>
            ⓘ <strong>CAD & BIM Drawings:</strong> If you have shop drawings (.dwg, .step, .skp, .rvt), mention them above or forward directly to <strong>studio@acespaces.in</strong> referencing this submission.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Transmitting brief...' : 'Transmit Consultation Brief ↗'}
        </button>
        <span style={{ fontSize: '12px', color: '#5d665c', fontFamily: 'DM Mono, monospace' }}>
          Response within 24h &middot; Bengaluru Studio Team
        </span>
      </div>
    </form>
  );
}
