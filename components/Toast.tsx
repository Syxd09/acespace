'use client';

import React from 'react';

interface ToastProps {
  show: boolean;
  message?: string;
}

export default function Toast({ show, message = 'Added to your sample shortlist' }: ToastProps) {
  return (
    <div className={`toast ${show ? 'show' : ''}`} id="toast">
      {message}
    </div>
  );
}
