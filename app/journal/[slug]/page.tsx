import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { journalArticles as defaultArticles, JournalArticle } from '@/data/journal';
import { getSiteContent } from '@/data/contentStore';

export const dynamic = 'force-dynamic';

function getLiveArticles(): JournalArticle[] {
  const content = getSiteContent();
  return content.journalArticles && content.journalArticles.length > 0
    ? content.journalArticles
    : defaultArticles;
}

export async function generateStaticParams() {
  const articles = getLiveArticles();
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const articles = getLiveArticles();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Essay Not Found — Ace Spaces Journal' };
  return {
    title: `${article.title} — Ace Spaces Journal`,
    description: article.summary,
  };
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const articles = getLiveArticles();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const otherArticles = articles.filter((a) => a.slug !== article.slug);

  return (
    <main>
      {/* Editorial Header Section */}
      <section className="detail-hero" style={{ background: '#1c201b', color: '#fff', padding: '140px 9vw 60px' }}>
        <div>
          <div style={{ marginBottom: '20px' }}>
            <Link
              href="/journal"
              style={{
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                color: '#a0aba0',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Back to All Journal Essays
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '3px 8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#73c991',
              }}
            >
              {article.category}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#a0aba0' }}>
              {article.date} • {article.readTime}
            </span>
          </div>

          <h1 style={{ maxWidth: '900px', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.03em' }}>
            {article.title}
          </h1>

          <p style={{ fontFamily: 'var(--serif, serif)', fontSize: 'clamp(17px, 2vw, 22px)', color: '#d0cfc7', maxWidth: '780px', lineHeight: 1.5, margin: 0 }}>
            {article.summary}
          </p>
        </div>
      </section>

      {/* Featured Imagery Frame */}
      {article.image && (
        <div
          style={{
            width: '100%',
            height: 'clamp(320px, 45vw, 600px)',
            position: 'relative',
            background: '#141713',
            borderBottom: '1px solid var(--line)',
            overflow: 'hidden',
          }}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '9vw',
              background: 'rgba(20, 23, 19, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e9e8e2',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Author: {article.author} • Ace Spaces Monograph
          </div>
        </div>
      )}

      {/* Article Body Content */}
      <div className="page-main" style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px' }}>
        {/* Editorial Pull-Quote */}
        {article.quote && (
          <blockquote
            style={{
              margin: '0 0 54px 0',
              padding: '32px 36px',
              background: '#f4f3ed',
              borderLeft: '4px solid var(--ink)',
              fontFamily: 'var(--serif, serif)',
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              lineHeight: 1.45,
              color: 'var(--ink)',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{article.quote}&rdquo;
          </blockquote>
        )}

        {/* Narrative Paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '18px', lineHeight: 1.8, color: '#333b32', fontFamily: 'Manrope, sans-serif' }}>
          {article.content?.map((para, pIdx) => (
            <p key={pIdx} style={{ margin: 0 }}>
              {para}
            </p>
          ))}
        </div>

        {/* Key Architectural Takeaways Box */}
        {article.takeaways && article.takeaways.length > 0 && (
          <div
            style={{
              marginTop: '60px',
              padding: '32px',
              background: '#1a1d19',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#73c991', marginBottom: '16px' }}>
              Key Technical & Spatial Takeaways
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {article.takeaways.map((point, tIdx) => (
                <li key={tIdx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '15px', lineHeight: 1.6, color: '#dcd7cd' }}>
                  <span style={{ color: '#73c991', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Author Footer Bar */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>
              Published By
            </span>
            <strong style={{ fontFamily: 'var(--serif, serif)', fontSize: '16px', color: 'var(--ink)' }}>
              {article.author}
            </strong>
          </div>
          <Link
            href="/contact"
            className="button button-dark"
            style={{ padding: '8px 18px', fontSize: '11px', textTransform: 'uppercase' }}
          >
            Discuss Material Specification ↗
          </Link>
        </div>

        {/* Explore Other Essays */}
        <div style={{ marginTop: '90px', paddingTop: '60px', borderTop: '1px solid var(--line)' }}>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>Continue Reading</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {otherArticles.slice(0, 2).map((other) => (
              <Link
                key={other.slug}
                href={`/journal/${other.slug}`}
                style={{
                  display: 'block',
                  padding: '24px',
                  background: '#f8f7f2',
                  border: '1px solid var(--line)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s ease',
                }}
              >
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  {other.category} • {other.readTime}
                </span>
                <h4 style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', fontWeight: 500, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {other.title}
                </h4>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--ink)' }}>
                  Read Essay →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
