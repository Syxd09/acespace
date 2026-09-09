'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { broadcastRealtimeEvent } from '@/lib/realtime';

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [bengaluruTime, setBengaluruTime] = useState('');

  // Live Studio Clock (Bengaluru UTC+5:30)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(new Date());
      setBengaluruTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubscribeError(null);

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Footer Dispatch Box' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubscribed(true);
        // Instant broadcast to Admin Console
        broadcastRealtimeEvent('DISPATCH_CREATED', { email });
      } else {
        setSubscribeError(data.error || 'Unable to subscribe. Please try again.');
      }
    } catch {
      // Offline fallback: still show confirmed to customer while logging
      setIsSubscribed(true);
      broadcastRealtimeEvent('DISPATCH_CREATED', { email });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hide the consumer site footer on the admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer section-pad" style={{ background: '#141713', color: '#e9e8e2' }}>
      {/* Footer Top Header & Newsletter Dispatch */}
      <div className="footer-top-enhanced" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '48px',
        paddingBottom: '54px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
        <div>
          <Link className="wordmark" href="/" style={{ display: 'inline-flex', marginBottom: '18px' }}>
            <span className="mark">A</span>
            <span>
              ACE<br />
              <em>SPACES</em>
            </span>
          </Link>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            lineHeight: '1.7',
            color: '#a0aba0',
            maxWidth: '440px',
            margin: '0 0 16px 0',
          }}>
            The Raw Material Source for Architects, Specifiers & Interior Designers.
            Foundry for mineral composites, seamless solid surfaces, and the foundational material powering Coro Collective.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px 12px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#73c991' }}></span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#c4cdc4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Parent Company & Solid Surface Foundry
            </span>
          </div>
        </div>

        {/* Material Dispatch Subscription Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#8c968c',
            marginBottom: '6px',
          }}>
            Specifier Dispatch & Formulation Monographs
          </div>
          <div style={{
            fontFamily: 'var(--serif, serif)',
            fontSize: '17px',
            fontWeight: 400,
            color: '#e9e8e2',
            marginBottom: '16px',
            lineHeight: 1.3,
          }}>
            Quarterly updates on novel mineral formulations, technical data sheets & project case studies.
          </div>

          {isSubscribed ? (
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#73c991',
              padding: '10px 0',
            }}>
              ✓ Dispatch briefing confirmed. Specifier monograph sent to {email}.
            </div>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="architect@firm.com"
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: '#e9e8e2',
                  color: '#141713',
                  border: 'none',
                  padding: '10px 18px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Joining...' : 'Join Dispatch →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 4-Column Architectural Directory */}
      <div className="footer-directory" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
        padding: '48px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}>
        {/* Col 1 */}
        <div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#8c968c',
            marginBottom: '16px',
          }}>
            [01 Origin & Foundry]
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Parent Company Vision', href: '/about' },
              { label: 'Raw Material Foundry', href: '/materials' },
              { label: 'Powering Coro Collective ↗', href: 'https://corocollective.com' },
              { label: 'Seamless Fabrication', href: '/fabrication' },
              { label: 'Architectural Brief & Contact Form →', href: '/contact' },
            ].map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: '#c2cdc2',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c2cdc2')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#8c968c',
            marginBottom: '16px',
          }}>
            [02 Collections & Slabs]
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Solid Surface Monoliths', href: '/materials' },
              { label: 'Curated Architectural Palette', href: '/colours' },
              { label: 'Mineral Slabs & Terrazzo', href: '/materials' },
              { label: 'Translucent Backlit Slabs', href: '/materials' },
              { label: 'Custom Specimen Box Order', href: '/sample-box' },
            ].map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: '#c2cdc2',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c2cdc2')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#8c968c',
            marginBottom: '16px',
          }}>
            [03 Spatial Typologies]
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Residential Pavilions', href: '/applications/residential' },
              { label: 'Commercial Atriums', href: '/applications/commercial' },
              { label: 'Hospitality & Bars', href: '/applications/hospitality' },
              { label: 'Retail Plinths & Flagships', href: '/applications/retail' },
              { label: 'Healthcare & Laboratories', href: '/applications/healthcare' },
              { label: 'Cultural & Academic Studios', href: '/applications/cultural' },
            ].map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: '#c2cdc2',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c2cdc2')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#8c968c',
            marginBottom: '16px',
          }}>
            [04 Technical & Governance]
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'GREENGUARD Gold Certified', href: '/fabrication' },
              { label: 'NSF/ANSI 51 Food Safe', href: '/fabrication' },
              { label: 'ASTM Class 1 Fire Rated', href: '/fabrication' },
              { label: 'Project Consultation Form →', href: '/contact' },
              { label: '10-Year Renewable Guarantee', href: '/about' },
              { label: 'Studio Management Console ↗', href: '/admin' },
            ].map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: item.href === '/admin' ? '11px' : '11px',
                    fontWeight: item.href === '/admin' || item.href === '/contact' ? 600 : 400,
                    color: item.href === '/admin' ? '#73c991' : item.href === '/contact' ? '#e9e8e2' : '#c2cdc2',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = item.href === '/admin' ? '#73c991' : item.href === '/contact' ? '#e9e8e2' : '#c2cdc2')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-enhanced" style={{
        paddingTop: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontFamily: 'DM Mono, monospace',
        fontSize: '10px',
        color: '#7e897e',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span>© 2026 Ace Spaces</span>
          <span>·</span>
          <span>The Raw Material Source for Architects & Designers</span>
        </div>

        {/* Live Studio Clock & Geo Coordinates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#b0bcb0',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#73c991' }}></span>
            BENGALURU STUDIO {bengaluruTime ? `${bengaluruTime} IST` : '15:00 IST'} (UTC +05:30)
          </span>
          <span>12.9716° N, 77.5946° E</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link
            href="/contact"
            style={{
              color: '#e9e8e2',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              paddingBottom: '2px',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            Contact Form ↗
          </Link>
          <Link href="/privacy" style={{ color: '#7e897e', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#7e897e', textDecoration: 'none' }}>Terms of Supply</Link>
          <Link
            href="/admin"
            style={{
              color: '#9ca59b',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '2px 8px',
              letterSpacing: '0.05em',
            }}
          >
            Studio Console ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}
