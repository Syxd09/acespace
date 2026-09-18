import React from 'react';
import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';
import JsonLd from '@/components/JsonLd';
import { getSiteContent } from '@/data/contentStore';
import { generateWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact & Consultation — Studio Briefs, Samples & CAD Submission',
  description:
    'Start an architectural material consultation, request specifier sample swatches, or submit CAD/BIM shop drawings for 5-axis CNC fabrication with Ace Spaces in Indiranagar, Bengaluru, India.',
  keywords: [
    'contact Ace Spaces',
    'DuPont Corian Bangalore contact',
    'specifier sample box request',
    'CAD drawing submission solid surface',
    'Indiranagar architecture studio',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact & Material Consultation | Ace Spaces',
    description:
      'Consult with our architectural materials team in Bengaluru. Direct CAD submission, sample box orders, and project estimation.',
    url: 'https://acespacesindia.vercel.app/contact',
    images: [
      {
        url: '/assets/hero-ace.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces Indiranagar Studio & Specifier Desk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Material Consultation | Ace Spaces',
    description:
      'Start an architectural conversation, request sample boxes, or submit drawings for fabrication in Bengaluru.',
    images: ['/assets/hero-ace.png'],
  },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Ace Spaces',
  url: 'https://acespacesindia.vercel.app/contact',
  mainEntity: {
    '@type': 'HomeAndConstructionBusiness',
    name: 'Ace Spaces',
    telephone: '+919845012345',
    email: 'studio@acespaces.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560038',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.6412,
    },
  },
};

export default function ContactPage() {
  const content = getSiteContent();
  const whatsappNumber = content.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  return (
    <main className="page-main">
      <JsonLd data={contactJsonLd} />
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
            <a className="button button-dark" href="#enquiry">
              Open enquiry form <span>↘</span>
            </a>
            <a
              className="button-outline-dark"
              href={generateWhatsAppUrl(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              title="Connect directly with our Bangalore Material Specifier Desk on WhatsApp"
            >
              <span className="live-pulse" />
              <svg className="wa-svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Material Desk</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </div>
      </section>

      <EnquiryForm />
    </main>
  );
}
