'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';

interface MaterialModalProps {
  material: Material;
  onClose: () => void;
}

export default function MaterialModal({ material, onClose }: MaterialModalProps) {
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();
  const inTray = isShortlisted(material.slug);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div
          className="modal-swatch"
          style={{
            background: material.textureCss || material.hexColor,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {material.textureImage && (
            <Image
              src={material.textureImage}
              alt={material.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        <div className="modal-content">
          <span className="eyebrow">{material.code} • {material.collection}</span>
          <h2>{material.name}</h2>
          <p className="modal-colour">{material.finish} / {material.colour}</p>
          <p className="modal-desc">{material.description}</p>

          <div className="modal-specs">
            <div>
              <span className="spec-label">Light Transmission</span>
              <strong className="spec-val">{material.lightTransmission}</strong>
            </div>
            <div>
              <span className="spec-label">Standard Sheet</span>
              <strong className="spec-val">{material.dimensions}</strong>
            </div>
            <div>
              <span className="spec-label">Thickness Options</span>
              <strong className="spec-val">{material.thicknessOptions.join(', ')}</strong>
            </div>
            <div>
              <span className="spec-label">Fire Performance</span>
              <strong className="spec-val">{material.fireRating}</strong>
            </div>
          </div>

          <div className="modal-apps">
            <span className="spec-label">Primary Applications</span>
            <div className="app-tags">
              {material.applications.map((app) => (
                <span key={app} className="app-tag">{app}</span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="button button-dark"
              onClick={() => {
                if (inTray) {
                  removeSample(material.slug);
                } else {
                  addSample(material);
                }
              }}
              style={{ minWidth: '170px', justifyContent: 'center' }}
            >
              {inTray ? 'In Sample Tray ✓' : '+ Add to Sample Box'}
            </button>
            <Link
              href={`/materials/${material.slug}`}
              className="button"
              style={{ border: '1px solid var(--line)', background: 'transparent' }}
            >
              Full Spec Sheet <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
