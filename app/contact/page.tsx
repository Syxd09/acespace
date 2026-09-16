import React from 'react';
import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';
import { getSiteContent } from '@/data/contentStore';
import { generateWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact — Ace Spaces',
  description: 'Start a material consultation, request samples or discuss architectural fabrication details with Ace Spaces.',
};

export default function ContactPage() {
  const content = getSiteContent();
  const whatsappNumber = content.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Contact / Start a conversation</p>
        <h1>
          Bring us
          <br />
          the <i>brief.</i>
        </h1>
        <p>Choose the conversation that best fits your project. Our team is ready to consult on material and fabrication details.</p>
      </section>

      <section className="page-grid">
        <h2>
          What can we
          <br />
          <i>help with?</i>
        </h2>
        <div className="page-copy">
          <p>
            Material consultation
            <br />
            Sample request
            <br />
            Fabrication detail
            <br />
            Project execution
            <br />
            Technical question
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            <a className="button" href="#enquiry">
              Open enquiry form <span>↘</span>
            </a>
            <a
              className="button"
              href={generateWhatsAppUrl(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#25D366',
                color: '#082510',
                border: '1px solid #25D366',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Chat on WhatsApp</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <EnquiryForm />
    </main>
  );
}
