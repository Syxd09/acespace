import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { journalArticles } from '@/data/journal';

export const metadata: Metadata = {
  title: 'Journal — Ace Spaces',
  description: 'Notes on making, material knowledge, fabrication thinking, and architectural essays from Ace Spaces.',
};

export default function JournalPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <p className="eyebrow">Journal / Notes on making</p>
        <h1>
          Space
          <br />
          <i>matter.</i>
        </h1>
        <p>Material knowledge, fabrication thinking and observations from the world of considered interiors.</p>
      </section>

      <section className="page-grid" id="edge">
        <h2>
          The edge is
          <br />
          where material
          <br />
          becomes <i>architecture.</i>
        </h2>
        <div className="page-copy">
          <p>
            The precision of an edge defines how light transitions across planes and how a volume is felt in a room.
          </p>
          <p className="eyebrow">Material knowledge / 06 min read</p>
        </div>
      </section>

      <section className="card-grid">
        {journalArticles.slice(1).map((article) => (
          <article key={article.slug} className="info-card" id={article.slug}>
            <h3>{article.title}</h3>
            <p>{article.category} / {article.readTime}</p>
          </article>
        ))}
      </section>

      <section className="callout">
        <p className="eyebrow">Stay close to the work</p>
        <h2>
          More notes
          <br />
          <i>soon.</i>
        </h2>
        <Link className="button" href="/contact">
          Talk to Ace Spaces <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
