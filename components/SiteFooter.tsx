import React from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="footer section-pad">
      <div className="footer-top">
        <Link className="wordmark" href="/">
          <span className="mark">A</span>
          <span>
            ACE<br />
            <em>SPACES</em>
          </span>
        </Link>
        <p>
          Architectural materials
          <br />& fabrication
        </p>
        <div className="footer-coro">
          <small>Part of the ecosystem</small>
          <strong>Coro Collective ↗</strong>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Ace Spaces</span>
        <span>Bengaluru / India</span>
        <span>Instagram ↗ &nbsp; LinkedIn ↗</span>
      </div>
    </footer>
  );
}
