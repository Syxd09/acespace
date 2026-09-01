'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Material } from '@/data/materials';

interface MaterialModalProps {
  material: Material | null;
  onClose: () => void;
  onRequestSample: () => void;
}

export default function MaterialModal({ material, onClose, onRequestSample }: MaterialModalProps) {
  useEffect(() => {
    if (material) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [material, onClose]);

  if (!material) return null;

  return (
    <div
      className={`modal-backdrop ${material ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <div style={{ position: 'relative', width: '100%', minHeight: '450px' }}>
          <Image
            src={material.image}
            alt={material.name}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="modal-details">
          <p className="eyebrow">{material.collection}</p>
          <h2>{material.name}</h2>
          <p>{material.description}</p>
          <div className="modal-specs">
            <span>
              Finish <b>{material.finish}</b>
            </span>
            <span>
              Colour <b>{material.colour}</b>
            </span>
          </div>
          <button
            className="button button-dark"
            onClick={() => {
              onClose();
              onRequestSample();
            }}
          >
            Request a sample <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
