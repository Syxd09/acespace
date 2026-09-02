'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';

export default function ProjectGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'residential', label: 'Residential', count: projects.filter((p) => p.category === 'residential').length },
    { id: 'hospitality', label: 'Hospitality', count: projects.filter((p) => p.category === 'hospitality').length },
    { id: 'commercial', label: 'Commercial & Studio', count: projects.filter((p) => p.category === 'commercial').length },
    { id: 'retail', label: 'Retail & Display', count: projects.filter((p) => p.category === 'retail').length },
  ];

  return (
    <div className="project-gallery">
      <div className="filter-row" style={{ marginBottom: '45px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={selectedCategory === cat.id ? 'filter active' : 'filter'}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label} <span style={{ opacity: 0.6, marginLeft: '6px' }}>({cat.count})</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', marginBottom: '80px' }}>
        {filteredProjects.map((project, idx) => (
          <article
            key={project.slug}
            className="project-feature"
            style={{
              paddingTop: idx > 0 ? '60px' : '0',
              borderTop: idx > 0 ? '1px solid var(--line)' : 'none'
            }}
          >
            <div className="project-photo">
              <span className="project-tag">{project.subtitle} / {project.location}</span>
            </div>

            <div className="project-info">
              <p className="eyebrow" style={{ marginBottom: '16px' }}>
                Case 0{idx + 1} / {project.year} / {project.architect}
              </p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="project-meta" style={{ margin: '30px 0' }}>
                <div>
                  <span>Material Specified</span>
                  <strong>{project.materialUsed}</strong>
                </div>
                <div>
                  <span>Application</span>
                  <strong>{project.application.split(',')[0]}</strong>
                </div>
                <div>
                  <span>Fabrication Technique</span>
                  <strong>{project.fabrication.split(',')[0]}</strong>
                </div>
                <div>
                  <span>Scale / Area</span>
                  <strong>{project.area}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link className="text-link" href={`/projects/${project.slug}`}>
                  Read Full Case Study <span>↗</span>
                </Link>
                <Link className="text-link" href={`/materials/${project.materialSlug}`} style={{ opacity: 0.7 }}>
                  View Specified Material <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
