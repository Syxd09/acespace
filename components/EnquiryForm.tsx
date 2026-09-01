'use client';

import React, { useState } from 'react';

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="spec-table" id="enquiry" onSubmit={handleSubmit}>
      <div className="spec-row">
        <span>Name</span>
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitted}
        />
      </div>
      <div className="spec-row">
        <span>Email</span>
        <input
          required
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitted}
        />
      </div>
      <div className="spec-row">
        <span>Project type</span>
        <input
          placeholder="Residential, hospitality, commercial…"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          disabled={submitted}
        />
      </div>
      <div className="spec-row">
        <span>Message</span>
        <textarea
          rows={4}
          placeholder="Tell us about the space"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitted}
        />
      </div>
      <button className="button" type="submit" disabled={submitted}>
        {submitted ? 'Enquiry noted ↗' : 'Send enquiry ↗'}
      </button>
    </form>
  );
}
