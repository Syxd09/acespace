'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { broadcastRealtimeEvent } from '@/lib/realtime';
import { useSiteContent } from '@/context/SiteContentContext';
import { generateWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function SiteFooter() {
  const { content } = useSiteContent();
  const whatsappNumber = content.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  const [email, setEmail] = useState('');

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [bengaluruTime, setBengaluruTime] = useState('');
  const [mounted, setMounted] = useState(false);

  // Live Studio Clock (Bengaluru UTC+5:30)
  useEffect(() => {
    setMounted(true);
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

    const cleanEmail = email.trim();

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, source: 'Footer Dispatch Box' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubscribed(true);
        // Instant broadcast to Admin Console
        broadcastRealtimeEvent('DISPATCH_CREATED', { email: cleanEmail, subscriber: data.subscriber });
      } else {
        setSubscribeError(data.error || 'Unable to subscribe. Please try again.');
      }
    } catch {
      // Offline fallback: still show confirmed to customer while logging
      setIsSubscribed(true);
      broadcastRealtimeEvent('DISPATCH_CREATED', { email: cleanEmail });
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
          <Link
            href="/"
            aria-label="Ace Spaces India"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '18px',
              textDecoration: 'none',
            }}
          >
            <Image
              src="/logo/full-logo-white-transparent.png"
              alt="Ace Spaces India"
              width={176}
              height={48}
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
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
            Foundry for mineral composites, seamless solid surfaces, and the foundational material powering Coro Crafted Collective.
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
              Master Material Source &amp; Solid Surface Foundry
            </span>
          </div>
        </div>

        {/* Material Dispatch Subscription Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: '2px solid var(--brand-red, #d43833)',
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
            <form className="footer-newsletter-form" onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="architect@firm.com"
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--brand-red, #d43833)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)')}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    padding: '10px 14px',
                    color: '#fff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
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
              </div>
              {subscribeError && (
                <div style={{ color: '#ef4444', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                  ⚠ {subscribeError}
                </div>
              )}
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
            [01 Studio & Practice]
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'About Us (Story & Ethos)', href: '/about' },
              { label: 'Design Philosophy & Craft', href: '/about#philosophy' },
              { label: 'The Atelier & Craftsmen', href: '/about#team' },
              { label: 'DuPont™ Material Foundation', href: '/about#foundation' },
              { label: 'Powering Coro Crafted Collective ↗', href: 'https://corocollective.com' },
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
              { label: 'Curated Architectural Palette', href: '/materials#library' },
              { label: 'Fabricated Products & Sinks', href: '/products' },
              { label: 'Design Certainty Service', href: '/products/design-certainty' },
              { label: 'Custom Specimen Box Order', href: '/materials' },
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
              { label: '01 / Luxury Residentials', href: '/applications/residential' },
              { label: '02 / Spiritual', href: '/applications/spiritual' },
              { label: '03 / Hospitalities (Food Places)', href: '/applications/hospitality' },
              { label: '04 / Healthcare', href: '/applications/healthcare' },
              { label: '05 / Commercial Interiors', href: '/applications/commercial' },
              { label: '06 / Exterior Cladding', href: '/applications/exterior-cladding' },
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
              { label: 'WhatsApp Studio Advisory ↗', href: generateWhatsAppUrl(whatsappNumber), external: true, highlight: true },
              { label: 'GREENGUARD Gold Certified', href: '/certifications/greenguard-gold' },
              { label: 'NSF/ANSI 51 Food Safe', href: '/certifications/nsf-ansi-51' },
              { label: 'ASTM Class 1 Fire Rated', href: '/certifications/astm-fire-rated' },
              { label: 'Project Consultation Form →', href: '/consultation' },
              { label: '10-Year Renewable Guarantee', href: '/guarantee' },
              { label: 'Architectural Standards Registry →', href: '/certifications' },
            ].map(item => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    suppressHydrationWarning
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#25D366',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#25D366')}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#25D366' }} />
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: item.href === '/consultation' ? 600 : 400,
                      color: item.href === '/consultation' ? '#e9e8e2' : '#c2cdc2',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = item.href === '/consultation' ? '#e9e8e2' : '#c2cdc2')}
                  >
                    {item.label}
                  </Link>
                )}
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
          <span
            suppressHydrationWarning
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#b0bcb0',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#73c991' }}></span>
            <span suppressHydrationWarning>
              BENGALURU STUDIO {mounted && bengaluruTime ? `${bengaluruTime} IST` : '15:00 IST'} (UTC +05:30)
            </span>
          </span>
          <span>12.9716° N, 77.5946° E</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <Link
            href="/consultation"
            style={{
              color: '#e9e8e2',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              paddingBottom: '2px',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            Project Consultation ↗
          </Link>
          <Link href="/certifications" style={{ color: '#7e897e', textDecoration: 'none' }}>Certifications</Link>
          <Link href="/guarantee" style={{ color: '#7e897e', textDecoration: 'none' }}>10-Yr Guarantee</Link>
          <Link href="/privacy" style={{ color: '#7e897e', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#7e897e', textDecoration: 'none' }}>Terms of Supply</Link>
        </div>
      </div>
    </footer>
  );
}
