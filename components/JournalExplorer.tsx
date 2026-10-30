'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { journalArticles, JournalArticle } from '@/data/journal';
import { useSiteContent } from '@/context/SiteContentContext';
import JournalGallery from '@/components/JournalGallery';

export default function JournalExplorer() {
  const { journalArticles: liveArticles } = useSiteContent();
  const articles = (liveArticles && liveArticles.length > 0) ? liveArticles : journalArticles;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeArticle) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('lenis-stopped');
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.classList.remove('lenis-stopped');
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      };
    }
  }, [activeArticle]);

  const categories = ['All', 'Material Knowledge', 'Fabrication Craft', 'Spatial Design', 'Material Science'];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return articles.length;
    return articles.filter((a) => a.category === cat).length;
  };

  const leadArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="journal-explorer">
      {/* Architectural Journal Search & Editorial Filter Bar */}
      <div className="journal-console-bar">
        {/* Search Input Bar */}
        <div className="journal-search-wrapper">
          <svg
            className="journal-search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays, joinery, monographs..."
            className="journal-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="journal-search-clear"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Editorial Category Filter Pills */}
        <div className="journal-topic-bar" role="tablist" aria-label="Journal topics">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`journal-topic-pill ${isActive ? 'is-active' : ''}`}
              >
                <span>{cat}</span>
                <span className="journal-topic-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Lead Article Split Card */}
      {leadArticle && (
        <div
          className="journal-lead-card"
          onClick={() => setActiveArticle(leadArticle)}
        >
          <div className="journal-lead-content" style={{ padding: 'clamp(28px, 5vw, 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span className="eyebrow" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>
                  {leadArticle.category}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                  {leadArticle.readTime} / {leadArticle.date}
                </span>
                {leadArticle.galleryImages && leadArticle.galleryImages.length > 0 && (
                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', padding: '3px 8px', background: 'rgba(30,33,29,0.06)', borderRadius: '2px', color: '#3a4239', fontWeight: 600 }}>
                    📷 {leadArticle.galleryImages.length} Photos
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: '-0.04em' }}>
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

            <div className="journal-lead-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '20px' }}>
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

          <div className="journal-lead-image" style={{ position: 'relative', minHeight: '340px', background: '#ccc' }}>
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
      <div className="journal-articles-grid">
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>
                    {art.readTime}
                  </span>
                  {art.galleryImages && art.galleryImages.length > 0 && (
                    <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', padding: '2px 6px', background: 'rgba(30,33,29,0.06)', borderRadius: '2px', color: '#3a4239', fontWeight: 600 }}>
                      📷 {art.galleryImages.length}
                    </span>
                  )}
                </div>
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
                    {art.takeaways[0]}
                  </p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                {art.author} / {art.date}
              </span>
              <span style={{ fontSize: '16px', color: 'var(--ink)' }}>↗</span>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Essay Reader Modal / Drawer */}
      {activeArticle && mounted && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(15, 17, 14, 0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'clamp(14px, 3vh, 28px)',
            animation: 'modalFadeIn 0.2s ease-out',
            overscrollBehavior: 'contain',
          }}
          onClick={() => setActiveArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            data-lenis-prevent="true"
            style={{
              background: 'var(--paper)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: 'min(90vh, 740px)',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              border: '1px solid var(--line)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
              position: 'relative',
              padding: 'clamp(24px, 4vw, 48px)',
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Top Navigation Bar */}
            <div className="journal-modal-header">
              <div className="journal-modal-meta-box">
                <span className="eyebrow" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>
                  {activeArticle.category}
                </span>
                <span className="journal-modal-meta-text">
                  {activeArticle.readTime} / {activeArticle.date}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article modal"
                className="journal-modal-close-btn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.04em' }}>
              {activeArticle.title}
            </h1>

            <p style={{ fontSize: '13px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '32px' }}>
              By {activeArticle.author} / Bengaluru Studio
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

            {activeArticle.galleryImages && activeArticle.galleryImages.length > 0 && (
              <JournalGallery images={activeArticle.galleryImages} articleTitle={activeArticle.title} />
            )}

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
        </div>,
        document.body
      )}
    </div>
  );
}
