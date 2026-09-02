import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { journalArticles } from '@/data/journal';

export const metadata: Metadata = {
  title: 'Journal & Material Essays — Ace Spaces',
  description: 'Notes on making, material science, fabrication philosophy, and architectural essays from Ace Spaces.',
};

export default function JournalPage() {
  const leadArticle = journalArticles[0];
  const remainingArticles = journalArticles.slice(1);

  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Journal / Notes on Architecture & Making</p>
        <h1>
          Space &
          <br />
          <i>matter.</i>
        </h1>
        <p>
          Material knowledge, fabrication thinking, and observations from the world of considered architectural interiors.
        </p>
      </section>

      {/* Featured Lead Essay */}
      {leadArticle && (
        <section style={{ marginBottom: '100px', borderBottom: '1px solid var(--line)', paddingBottom: '80px' }}>
          <div className="page-grid" style={{ padding: '80px 0 40px' }}>
            <div>
              <p className="eyebrow">{leadArticle.category} • {leadArticle.readTime} • {leadArticle.date}</p>
              <h2 style={{ fontSize: 'clamp(42px, 5.5vw, 76px)', lineHeight: 0.95, margin: '16px 0 24px' }}>
                {leadArticle.title}
              </h2>
              <p style={{ fontSize: '14px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Written by {leadArticle.author}
              </p>
            </div>

            <div className="page-copy">
              <blockquote style={{ margin: '0 0 28px', paddingLeft: '20px', borderLeft: '2px solid var(--ink)', fontStyle: 'italic', fontSize: '19px', lineHeight: 1.5, color: 'var(--ink)' }}>
                "{leadArticle.quote || leadArticle.summary}"
              </blockquote>
              {leadArticle.content?.map((paragraph, i) => (
                <p key={i} style={{ fontSize: '15px', lineHeight: 1.75, color: '#4a5249', marginBottom: '16px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Essays & Notes Grid */}
      <section style={{ marginBottom: '120px' }}>
        <div className="section-head" style={{ marginBottom: '40px' }}>
          <div>
            <p className="eyebrow">Selected Essays & Research Notes</p>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              Fabrication &
              <br />
              <i>Spatial Theory.</i>
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {remainingArticles.map((article) => (
            <article
              key={article.slug}
              style={{
                background: '#dcd7cd',
                padding: '40px 35px',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', margin: 0 }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                    {article.readTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 400, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.03em' }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '24px' }}>
                  {article.summary}
                </p>

                {article.content && (
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#667066', fontStyle: 'italic', borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '16px' }}>
                    "{article.content[0]}"
                  </p>
                )}
              </div>

              <div style={{ marginTop: '28px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {article.author} • {article.date}
                </span>
                <span style={{ fontSize: '18px', color: 'var(--ink)' }}>↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter / Stay Close to the Work */}
      <section className="callout">
        <p className="eyebrow">Stay close to the work</p>
        <h2>
          Architectural
          <br />
          <i>notes & updates.</i>
        </h2>
        <p>
          Receive occasional essays on material science, newly completed case studies, and workshop prototyping updates directly from our Bengaluru studio.
        </p>
        <Link className="button button-dark" href="/contact">
          Subscribe for Studio Notes <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
