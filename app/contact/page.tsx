import React from 'react';
import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata: Metadata = {
  title: 'Contact — Ace Spaces',
  description: 'Start a material consultation, request samples or discuss architectural fabrication details with Ace Spaces.',
};

export default function ContactPage() {
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
          <a className="button" href="#enquiry">
            Open enquiry form <span>↘</span>
          </a>
        </div>
      </section>

      <EnquiryForm />
    </main>
  );
}
