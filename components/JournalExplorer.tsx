'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { journalArticles, JournalArticle } from '@/data/journal';

export default function JournalExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  const categories = ['All', 'Material Knowledge', 'Fabrication Craft', 'Spatial Design', 'Material Science'];

  const filteredArticles = useMemo(() => {
    return journalArticles.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const leadArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="journal-explorer">
      {/* Category Tabs & Search Bar */}
      <div
        style={{
          background: '#dcd7cd',
          padding: '24px 30px',
          border: '1px solid var(--line)',
          marginBottom: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  border: '1px solid var(--line)',
                  background: isActive ? 'var(--ink)' : 'var(--paper)',
                  color: isActive ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays & research notes..."
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              padding: '10px 16px',
              paddingRight: '32px',
              fontSize: '12px',
              color: 'var(--ink)',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Featured Lead Article Split Card */}
      {leadArticle && (
        <div
          style={{
            background: '#dcd7cd',
            border: '1px solid var(--line)',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.2fr) 0.8fr',
            marginBottom: '60px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            cursor: 'pointer',
          }}
          onClick={() => setActiveArticle(leadArticle)}
        >
          <div style={{ padding: 'clamp(32px, 5vw, 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
                <span className="eyebrow" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>
                  {leadArticle.category}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                  {leadArticle.readTime} • {leadArticle.date}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
                {leadArticle.title}
              </h2>

              <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#4a5249', marginBottom: '24px' }}>
                {leadArticle.summary}
              </p>

              {leadArticle.quote && (
                <blockquote
                  style={{
                    margin: '0 0 24px',
                    paddingLeft: '18px',
                    borderLeft: '2px solid var(--ink)',
                    fontStyle: 'italic',
                    fontSize: '16px',
                    color: 'var(--ink)',
                    lineHeight: 1.5,
                  }}
                >
                  "{leadArticle.quote}"
                </blockquote>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                Written by {leadArticle.author}
              </span>
              <button
                type="button"
                className="button button-dark"
                style={{ padding: '10px 18px', fontSize: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveArticle(leadArticle);
                }}
              >
                Read Full Essay <span>↗</span>
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: '340px', background: '#ccc' }}>
            <Image
              src={leadArticle.image || '/assets/material-macro.png'}
              alt={leadArticle.title}
              fill
              sizes="(max-width: 800px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', marginBottom: '80px' }}>
        {gridArticles.map((art) => (
          <article
            key={art.slug}
            style={{
              background: '#dcd7cd',
              border: '1px solid var(--line)',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
            }}
            onClick={() => setActiveArticle(art)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'var(--ink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--line)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="eyebrow" style={{ color: 'var(--muted)', margin: 0 }}>
                  {art.category}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                  {art.readTime}
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1.2, margin: '0 0 16px', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                {art.title}
              </h3>

              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '20px' }}>
                {art.summary}
              </p>

              {art.takeaways && art.takeaways.length > 0 && (
                <div style={{ background: 'var(--paper)', padding: '16px', border: '1px solid var(--line)', marginBottom: '20px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Core Takeaway
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
                    • {art.takeaways[0]}
                  </p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                {art.author} • {art.date}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--ink)' }}>↗</span>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Essay Reader Modal / Drawer */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              background: 'var(--paper)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--line)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              position: 'relative',
              padding: 'clamp(32px, 6vw, 60px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--line)',
                background: 'transparent',
                display: 'grid',
                placeItems: 'center',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <span className="eyebrow" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>
                {activeArticle.category}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                {activeArticle.readTime} • {activeArticle.date}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.04em' }}>
              {activeArticle.title}
            </h1>

            <p style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '32px' }}>
              By {activeArticle.author} • Bengaluru Studio
            </p>

            {activeArticle.quote && (
              <blockquote
                style={{
                  margin: '0 0 32px',
                  paddingLeft: '24px',
                  borderLeft: '3px solid var(--ink)',
                  fontStyle: 'italic',
                  fontSize: '19px',
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  background: '#dcd7cd',
                  padding: '24px',
                }}
              >
                "{activeArticle.quote}"
              </blockquote>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {activeArticle.content.map((p, idx) => (
                <p key={idx} style={{ fontSize: '16px', lineHeight: 1.8, color: '#3a4239', margin: 0 }}>
                  {p}
                </p>
              ))}
            </div>

            {activeArticle.takeaways && (
              <div style={{ background: '#dcd7cd', padding: '30px', border: '1px solid var(--line)', marginBottom: '32px' }}>
                <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
                  Architectural Summary & Key Findings
                </span>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '10px', fontSize: '14px', color: 'var(--ink)' }}>
                  {activeArticle.takeaways.map((t, idx) => (
                    <li key={idx} style={{ lineHeight: 1.5 }}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                Ace Spaces Architectural Research
              </span>
              <button
                type="button"
                className="button button-dark"
                onClick={() => setActiveArticle(null)}
                style={{ padding: '10px 20px', fontSize: '10px' }}
              >
                Close Essay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
