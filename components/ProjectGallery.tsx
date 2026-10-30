'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects as defaultProjects, Project } from '@/data/projects';
import { useSiteContent } from '@/context/SiteContentContext';

export default function ProjectGallery({ initialProjects }: { initialProjects?: Project[] }) {
  const { projects: liveProjects } = useSiteContent();
  const allProjects = (liveProjects && liveProjects.length > 0)
    ? liveProjects
    : (initialProjects && initialProjects.length > 0)
      ? initialProjects
      : defaultProjects;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = selectedCategory === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Projects', count: allProjects.length },
    { id: 'residential', label: 'Residential', count: allProjects.filter((p) => p.category === 'residential').length },
    { id: 'hospitality', label: 'Hospitality', count: allProjects.filter((p) => p.category === 'hospitality').length },
    { id: 'commercial', label: 'Commercial & Studio', count: allProjects.filter((p) => p.category === 'commercial').length },
    { id: 'retail', label: 'Retail & Display', count: allProjects.filter((p) => p.category === 'retail').length },
    { id: 'healthcare', label: 'Healthcare', count: allProjects.filter((p) => p.category === 'healthcare').length },
  ];

  const heroProject = filteredProjects[0];
  const gridProjects = filteredProjects.slice(1);

  return (
    <div className="project-gallery">
      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '48px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              border: selectedCategory === cat.id ? '1px solid var(--ink, #1e211d)' : '1px solid var(--line, rgba(30, 33, 29, 0.12))', borderRadius: '4px',
              background: selectedCategory === cat.id ? 'var(--ink, #1e211d)' : 'transparent',
              color: selectedCategory === cat.id ? '#ffffff' : 'var(--ink, #1e211d)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat.label} <span style={{ opacity: 0.6, marginLeft: '4px' }}>({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Hero Featured Case Study */}
      {heroProject && (
        <article
          style={{
            marginBottom: '60px',
            background: 'var(--paper, #f5f4ee)', border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', overflow: 'hidden', borderRadius: '6px',
          }}
          className="project-hero-card"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                position: 'relative',
                minHeight: '440px',
                width: '100%',
                background: '#161815',
                overflow: 'hidden',
              }}
            >
              <Image
                src={heroProject.image}
                alt={heroProject.title}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
                priority
                className="project-hero-img"
              />
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(20, 23, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 10px', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px',
                }}
              >
                Lead Case Study / {heroProject.location}
              </span>
            </div>

            <div
              style={{
                padding: '36px 36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--muted, #687268)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                  }}
                >
                  Case 01 / {heroProject.year} / {heroProject.architect}
                </p>

                <h3
                  style={{
                    fontSize: 'clamp(26px, 3.2vw, 38px)',
                    lineHeight: 1.12,
                    fontWeight: 400,
                    margin: '0 0 16px',
                    letterSpacing: '-0.03em',
                    color: 'var(--ink, #1e211d)',
                  }}
                >
                  {heroProject.title}
                </h3>

                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#4a5249',
                    marginBottom: '28px',
                  }}
                >
                  {heroProject.description}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '28px',
                    padding: '16px', background: 'rgba(30, 33, 29, 0.04)', border: '1px solid rgba(30, 33, 29, 0.08)', borderRadius: '4px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '9.5px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                      Material Specified
                    </span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                      {heroProject.materialUsed}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '9.5px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                      Scale / Footprint
                    </span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>
                      {heroProject.area}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link className="button button-dark" href={`/projects/${heroProject.slug}`}>
                  Explore Project <span>→</span>
                </Link>
                <Link className="text-link" href={`/materials/${heroProject.materialSlug}`}>
                  Material Spec <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Editorial Grid of Further Case Studies */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '32px',
          marginBottom: '80px',
        }}
      >
        {gridProjects.map((project, idx) => (
          <article
            key={project.slug}
            style={{
              background: 'var(--paper, #f5f4ee)', border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', overflow: 'hidden', borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            }}
            className="project-grid-card"
          >
            <div
              style={{
                position: 'relative',
                height: '320px',
                width: '100%',
                background: '#161815',
                overflow: 'hidden',
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 800px) 100vw, 33vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="project-grid-img"
              />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(20, 23, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9.5px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 8px', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px',
                }}
              >
                {project.category} / {project.location.split(',')[0]}
              </span>
            </div>

            <div
              style={{
                padding: '24px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10.5px',
                    color: 'var(--muted, #687268)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    margin: '0 0 8px',
                  }}
                >
                  Case 0{idx + 2} / {project.architect}
                </p>

                <h4
                  style={{
                    fontSize: '19px',
                    fontWeight: 500,
                    margin: '0 0 10px',
                    color: 'var(--ink, #1e211d)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {project.title}
                </h4>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#555e54',
                    margin: '0 0 16px',
                  }}
                >
                  {project.description}
                </p>
              </div>

              <div
                style={{
                  paddingTop: '14px',
                  borderTop: '1px dashed rgba(30, 33, 29, 0.14)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--muted, #687268)',
                  }}
                >
                  {project.materialUsed}
                </span>

                <Link
                  href={`/projects/${project.slug}`}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--ink, #1e211d)',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  View Case Study →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .project-hero-card:hover .project-hero-img {
          transform: scale(1.02);
        }
        .project-grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }
        .project-grid-card:hover .project-grid-img {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}
