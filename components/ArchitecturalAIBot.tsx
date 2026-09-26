'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; href?: string; prompt?: string }[];
  matchedTopic?: string;
  isGuardrailTriggered?: boolean;
}

const STARTER_PROMPTS = [
  {
    title: '📍 Coro Maps Location',
    prompt: 'Where is the Coro Collective showroom located in Bangalore, and can you share Google Maps directions?',
  },
  {
    title: '🏛️ Founders & Leadership',
    prompt: 'Who founded Ace Spaces and Coro Collective?',
  },
  {
    title: '✨ Better Material Advice',
    prompt: 'Can you compare Italian marble vs Corian solid surface and suggest a better material for a kitchen island?',
  },
  {
    title: 'Zero-Silica Safety',
    prompt: 'What makes DuPont™ Corian® 100% zero-silica and safe?',
  },
  {
    title: 'Coro Synergy',
    prompt: 'How are Ace Spaces and Coro Collective related?',
  },
  {
    title: 'Physical Sample Box',
    prompt: 'How do I order a physical specifier sample box across India?',
  },
];

export default function ArchitecturalAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const navigateToSiteLink = (href: string) => {
    if (!href) return;

    // External link
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    // Auto close chat on mobile screens so user can see target content
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      handleCloseChat();
    }

    const [targetPath, hash] = href.split('#');
    const cleanTargetPath = targetPath === '' ? pathname : targetPath;
    const isSamePage = cleanTargetPath === pathname;

    const performScrollToHash = (targetHash: string) => {
      const el = document.getElementById(targetHash) || document.querySelector(`[id="${targetHash}"]`);
      if (el) {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement | number, opts?: unknown) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.2 });
        } else {
          const y = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        return true;
      }
      return false;
    };

    if (isSamePage) {
      if (hash) {
        history.pushState(null, '', href);
        performScrollToHash(hash);
      } else {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: unknown) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      router.push(href);
      if (hash) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          const scrolled = performScrollToHash(hash);
          if (scrolled || attempts >= 15) {
            clearInterval(interval);
          }
        }, 150);
      }
    }
  };

  const handleCloseChat = () => {
    if (isClosing) return;
    setIsClosing(true);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  };

  const handleToggleChat = () => {
    if (isOpen || isClosing) {
      handleCloseChat();
    } else {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      setIsClosing(false);
      setIsOpen(true);
    }
  };

  // Keyboard shortcut: ESC to gracefully close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isOpen || isClosing)) {
        handleCloseChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Load or initialize chat from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('acespaces_ai_chat_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Initial welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome-0',
          role: 'assistant',
          content: `Welcome to **Ace Spaces Studio Material Intelligence**.

I am your private architectural assistant, grounded exclusively in our Bangalore fabrication data, certified DuPont™ Corian® slab catalog, Coro Collective spatial lineage, and zero-silica mineral specifications.

I can assist with:
• **Coro Collective Showroom Location & Google Maps directions**
• **Founders & Leadership (Syed Matheen & Architectural Direction)**
• **Material Chemistry & Recommending Better Materials for Your Space**
• **DuPont™ Corian® Zero-Silica Safety & 5-Axis CNC Fabrication**

How may I assist your specifications today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            { label: 'Open in Google Maps ↗', href: 'https://maps.google.com/?q=Ace+Spaces+Coro+Collective+Bangalore' },
            { label: 'The Coro Synergy', href: '/about#coro' },
            { label: 'Explore Materials', href: '/materials' },
          ],
        };
        setMessages([welcomeMessage]);
      }
    } catch (e) {
      console.error('Session storage error:', e);
    }
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('acespaces_ai_chat_history', JSON.stringify(messages));
      } catch (e) {
        // quota ignore
      }
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  // Lock background body scroll when open on mobile
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth <= 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Hide bot on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Our studio intelligence has received your query. Please review our material catalog.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions,
        matchedTopic: data.matchedTopic,
        isGuardrailTriggered: data.isGuardrailTriggered,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('AI chat fetch error:', err);
      const fallbackMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: `Thank you for your architectural inquiry. 

Our studio engineers specialize in DuPont™ Corian® solid surfaces, sub-0.2mm 5-axis CNC machining, thermoforming, and Coro Collective spatial integration.

To discuss your project drawings or obtain immediate material estimates, please tap the **WhatsApp Desk** button in the top navigation bar or browse our certified materials.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Browse Materials', href: '/materials' },
          { label: 'WhatsApp in Navbar', href: 'https://wa.me/919845012345' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: `Conversation refreshed.

I am Ace Spaces' private material intelligence, strictly grounded in DuPont™ Corian®, Coro Collective spatial lineage, 5-axis CNC fabrication, and zero-silica surface engineering.

How may I assist your architectural practice today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Explore Materials', href: '/materials' },
        { label: 'The Coro Synergy', href: '/about#coro' },
      ],
    };
    setMessages([freshWelcome]);
    try {
      sessionStorage.removeItem('acespaces_ai_chat_history');
    } catch (e) {}
  };

  // Format markdown-like text (bold, headers, bullets, tables)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const trimmed = lines[i].trim();

      // --- TABLE DETECTION ---
      // A markdown table line starts and ends with `|`, or has multiple `|` chars
      if (trimmed.startsWith('|') && trimmed.includes('|', 1)) {
        // Collect all consecutive table lines
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        // Parse rows — skip separator lines (---|---)
        const rows = tableLines
          .filter(row => !/^\|[\s|:-]+\|$/.test(row))
          .map(row =>
            row
              .replace(/^\|/, '')
              .replace(/\|$/, '')
              .split('|')
              .map(cell => cell.trim())
          );

        if (rows.length > 0) {
          const [headerRow, ...bodyRows] = rows;
          elements.push(
            <div
              key={`table-${i}`}
              style={{ overflowX: 'auto', marginBottom: '10px', marginTop: '4px' }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '11.5px',
                  fontFamily: 'DM Mono, monospace',
                  letterSpacing: '0.02em',
                }}
              >
                <thead>
                  <tr>
                    {headerRow.map((cell, ci) => (
                      <th
                        key={ci}
                        style={{
                          padding: '7px 10px',
                          textAlign: 'left',
                          color: '#f2f0ea',
                          fontWeight: 700,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: 'rgba(242, 240, 234, 0.1)',
                          borderBottom: '1px solid rgba(242, 240, 234, 0.25)',
                          borderRight: ci < headerRow.length - 1 ? '1px solid rgba(242,240,234,0.08)' : 'none',
                          whiteSpace: 'nowrap',
                        }}
                        dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: '6px 10px',
                            color: ci === 0 ? '#e5d5be' : '#c8cec8',
                            fontWeight: ci === 0 ? 600 : 400,
                            borderBottom: '1px solid rgba(242, 240, 234, 0.06)',
                            borderRight: ci < row.length - 1 ? '1px solid rgba(242,240,234,0.06)' : 'none',
                            verticalAlign: 'top',
                          }}
                          dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      if (!trimmed) {
        elements.push(<div key={i} style={{ height: '8px' }} />);
        i++;
        continue;
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4
            key={i}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#e5d5be',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontFamily: 'DM Mono, monospace',
              margin: '12px 0 6px',
            }}
          >
            {trimmed.replace('### ', '')}
          </h4>
        );
        i++;
        continue;
      }

      // Bullet points
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const text = trimmed.slice(2);
        elements.push(
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#d6dcd6',
              marginBottom: '4px',
            }}
          >
            <span style={{ color: '#73c991', fontSize: '14px', lineHeight: '1.4' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </div>
        );
        i++;
        continue;
      }

      // Numbered lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#d6dcd6',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                color: '#f2f0ea',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 600,
                minWidth: '16px',
              }}
            >
              {numMatch[1]}.
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
          </div>
        );
        i++;
        continue;
      }

      elements.push(
        <p
          key={i}
          style={{
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#d6dcd6',
            margin: '0 0 6px',
          }}
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
      i++;
    }

    return <div className="ai-message-body">{elements}</div>;
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
        const isExternal = href.startsWith('http') || href.startsWith('//');
        return `<a href="${href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="ai-inline-nav-link" data-href="${href}">${label}</a>`;
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff; font-weight:600;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#f2f0ea;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:1px 5px; border-radius:0px; font-family:DM Mono,monospace; font-size:11px; color:#f2f0ea; border:1px solid rgba(255,255,255,0.12);">$1</code>');
  };

  return (
    <>
      {/* Floating Container (replaces previous floating pill) */}
      <aside
        className={`ace-ai-bot-root ${isOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}
        aria-label="Ace Spaces Private Studio Material Intelligence"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 990,
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {/* Expanded Chat Pane with Open and Close Animations */}
        {(isOpen || isClosing) && (
          <div
            className={`ace-ai-chat-window ${isClosing ? 'ai-window-closing' : 'ai-window-opening'}`}
            style={{
              position: 'absolute',
              bottom: '58px',
              right: '0',
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              height: '620px',
              maxHeight: 'calc(100vh - 110px)',
              background: '#121512',
              color: '#f4f3ef',
              border: '1px solid rgba(242, 240, 234, 0.22)',
              borderRadius: '0px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(242, 240, 234, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'bottom right',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Architectural Header */}
            <header
              className="ace-ai-chat-header"
              style={{
                padding: '14px 18px',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
                borderBottom: '1px solid rgba(242, 240, 234, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Minimalist Geometric Studio Emblem */}
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '0px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(242, 240, 234, 0.35)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#f2f0ea',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  A
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#f4f3ef',
                        fontFamily: 'DM Mono, monospace',
                      }}
                    >
                      Ace Spaces AI
                    </h3>
                    {/* Live Indicator Dot */}
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#73c991',
                        boxShadow: '0 0 7px rgba(115, 201, 145, 0.8)',
                        display: 'inline-block',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(242, 240, 234, 0.55)',
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.04em',
                      marginTop: '1px',
                    }}
                  >
                    Private Material Intelligence · Grounded
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Clear Conversation */}
                <button
                  type="button"
                  className="ace-ai-header-btn"
                  onClick={handleClearChat}
                  title="Refresh & Clear Conversation"
                  aria-label="Refresh conversation"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(242, 240, 234, 0.18)',
                    color: '#f2f0ea',
                    width: '26px',
                    height: '26px',
                    borderRadius: '0px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.6)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f2f0ea';
                    e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.18)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                >
                  ↻
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  className="ace-ai-header-btn"
                  onClick={handleCloseChat}
                  title="Close AI Material Concierge"
                  aria-label="Close conversation"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(242, 240, 234, 0.18)',
                    color: '#f2f0ea',
                    width: '26px',
                    height: '26px',
                    borderRadius: '0px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.6)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#f2f0ea';
                    e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.18)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                >
                  ✕
                </button>
              </div>
            </header>

            {/* Scrollable Conversation Feed */}
            <div
              className="ace-ai-messages-scroll"
              data-lenis-prevent
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                scrollBehavior: 'smooth',
              }}
              onWheel={(e) => e.stopPropagation()}
              onClick={(e) => {
                const anchor = (e.target as HTMLElement).closest('a');
                if (anchor) {
                  const href = anchor.getAttribute('href') || anchor.getAttribute('data-href');
                  if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    e.preventDefault();
                    navigateToSiteLink(href);
                  }
                }
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  {/* Message Bubble */}
                  <div
                    style={{
                      maxWidth: msg.role === 'user' ? '86%' : '94%',
                      padding: msg.role === 'user' ? '10px 14px' : '14px 16px',
                      borderRadius: '0px',
                      background:
                        msg.role === 'user'
                          ? '#f2f0ea'
                          : 'rgba(255, 255, 255, 0.03)',
                      color: msg.role === 'user' ? '#161815' : '#f2f0ea',
                      border:
                        msg.role === 'user'
                          ? '1px solid #e0ded6'
                          : msg.isGuardrailTriggered
                          ? '1px solid rgba(220, 90, 90, 0.35)'
                          : '1px solid rgba(242, 240, 234, 0.12)',
                      boxShadow:
                        msg.role === 'user'
                          ? '0 2px 8px rgba(0,0,0,0.15)'
                          : '0 4px 16px rgba(0,0,0,0.25)',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <div style={{ fontSize: '13px', lineHeight: '1.45', fontWeight: 500 }}>
                        {msg.content}
                      </div>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}

                    {/* Suggested In-Context Actions */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        {msg.suggestedActions.map((action, actionIdx) => (
                          action.href ? (
                            <button
                              key={actionIdx}
                              type="button"
                              onClick={() => navigateToSiteLink(action.href!)}
                              style={{
                                fontSize: '10px',
                                fontFamily: 'DM Mono, monospace',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                color: '#f2f0ea',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(242, 240, 234, 0.2)',
                                padding: '5px 9px',
                                borderRadius: '0px',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(242, 240, 234, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.6)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.2)';
                              }}
                            >
                              <span>{action.label}</span>
                              <span style={{ fontSize: '9px' }}>↗</span>
                            </button>
                          ) : (
                            <button
                              key={actionIdx}
                              type="button"
                              onClick={() => handleSendMessage(action.prompt || action.label)}
                              style={{
                                fontSize: '10px',
                                fontFamily: 'DM Mono, monospace',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                color: '#f2f0ea',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(242, 240, 234, 0.18)',
                                padding: '5px 9px',
                                borderRadius: '0px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(242, 240, 234, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.6)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.18)';
                              }}
                            >
                              {action.label}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span
                    style={{
                      fontSize: '9px',
                      color: 'rgba(242, 240, 234, 0.45)',
                      fontFamily: 'DM Mono, monospace',
                      marginTop: '3px',
                      padding: '0 4px',
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Loading Synthesizer State */}
              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxWidth: '90%',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '0px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(242, 240, 234, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span className="ai-dot-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="ai-dot-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="ai-dot-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        letterSpacing: '0.04em',
                        color: '#73c991',
                      }}
                    >
                      Synthesizing material specifications...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Starter Prompt Chips (shown if only 1 message exists) */}
            {messages.length <= 1 && (
              <div
                style={{
                  padding: '8px 16px 12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#849084',
                    marginBottom: '6px',
                  }}
                >
                  Quick Architectural Topics:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  {STARTER_PROMPTS.map((starter, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSendMessage(starter.prompt)}
                      style={{
                        fontSize: '10px',
                        fontFamily: 'DM Mono, monospace',
                        padding: '5px 10px',
                        borderRadius: '0px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(242, 240, 234, 0.16)',
                        color: 'rgba(242, 240, 234, 0.8)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.6)';
                        e.currentTarget.style.background = 'rgba(242, 240, 234, 0.08)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.16)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = 'rgba(242, 240, 234, 0.8)';
                      }}
                    >
                      {starter.title} ↗
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form & Composer */}
            <form
              className="ace-ai-chat-footer"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '12px 14px',
                background: '#0d100d',
                borderTop: '1px solid rgba(242, 240, 234, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(242, 240, 234, 0.18)',
                  borderRadius: '0px',
                  padding: '8px 12px',
                }}
              >
                <textarea
                  ref={textareaRef}
                  className="ace-ai-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Inquire about Corian®, Coro, slab gauges, CNC tolerances..."
                  rows={2}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f4f3ef',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    fontFamily: 'inherit',
                    resize: 'none',
                  }}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Inquiry"
                  style={{
                    background: input.trim() && !isLoading ? '#f2f0ea' : 'rgba(255, 255, 255, 0.08)',
                    color: input.trim() && !isLoading ? '#161815' : 'rgba(242, 240, 234, 0.3)',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '0px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  ↗
                </button>
              </div>

              {/* Sub-label reminding of navbar WhatsApp line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '9px',
                  fontFamily: 'DM Mono, monospace',
                  color: 'rgba(242, 240, 234, 0.5)',
                  letterSpacing: '0.02em',
                }}
              >
                <span>Press Enter to send · Shift+Enter for newline</span>
                <Link
                  href="https://wa.me/919845012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#73c991', textDecoration: 'none' }}
                >
                  WhatsApp in Navbar ↗
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Floating Trigger Plaque (Architectural Specifier Plaque) */}
        {/* Bottom Floating Trigger Button */}
        <button
          type="button"
          onClick={handleToggleChat}
          aria-expanded={isOpen}
          aria-label="Ace Spaces Private AI Material Intelligence"
          className="ace-ai-trigger-pill"
          style={{
            background: (isOpen && !isClosing) ? '#141714' : 'rgba(18, 21, 18, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#f4f3ef',
            border: (isOpen && !isClosing) ? '1px solid rgba(242, 240, 234, 0.65)' : '1px solid rgba(242, 240, 234, 0.24)',
            borderRadius: '0px',
            padding: '10px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: (isOpen && !isClosing)
              ? '0 16px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(242, 240, 234, 0.15)'
              : '0 12px 32px rgba(0, 0, 0, 0.45)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: (isOpen && !isClosing) ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.7)';
            e.currentTarget.style.background = 'rgba(26, 30, 26, 0.98)';
            e.currentTarget.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.55)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            if (!isOpen || isClosing) {
              e.currentTarget.style.borderColor = 'rgba(242, 240, 234, 0.24)';
              e.currentTarget.style.background = 'rgba(18, 21, 18, 0.94)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.45)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {/* Architectural Desktop Emblem Frame */}
          <div
            className="ace-ai-trigger-emblem-desktop"
            style={{
              width: '20px',
              height: '20px',
              border: '1px solid rgba(242, 240, 234, 0.35)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'grid',
              placeItems: 'center',
              color: '#f4f3ef',
              flexShrink: 0,
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: 0,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: (isOpen && !isClosing) ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            +
          </div>

          {/* Architectural Mobile Emblem (Compact 44x44 trigger badge) */}
          <div
            className="ace-ai-trigger-emblem-mobile"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: (isOpen && !isClosing) ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            {(isOpen && !isClosing) ? (
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#f4f3ef' }}>✕</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: '#f4f3ef', letterSpacing: '0.04em' }}>
                  AI
                </span>
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#73c991',
                    boxShadow: '0 0 6px rgba(115, 201, 145, 0.95)',
                    display: 'inline-block',
                  }}
                />
              </div>
            )}
          </div>

          {/* Text & Active Indicator (Desktop) */}
          <div className="ace-ai-trigger-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#f4f3ef',
                }}
              >
                Ace Spaces AI
              </span>
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#73c991',
                  boxShadow: '0 0 6px rgba(115, 201, 145, 0.85)',
                  display: 'inline-block',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '9px',
                color: 'rgba(242, 240, 234, 0.55)',
                fontFamily: 'DM Mono, monospace',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              Material Intelligence
            </span>
          </div>

          <span
            className="ace-ai-trigger-arrow"
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '13px',
              color: '#f4f3ef',
              marginLeft: '4px',
              lineHeight: 1,
              display: 'inline-block',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: (isOpen && !isClosing) ? 'rotate(45deg)' : 'rotate(0deg)',
            }}
          >
            ↗
          </span>
        </button>
      </aside>

      {/* Global CSS for Animations and Full Responsiveness */}
      <style jsx global>{`
        /* Desktop Architectural Open / Close Animations */
        @keyframes aiWindowPopIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes aiWindowPopOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
            filter: blur(3px);
          }
        }

        .ace-ai-chat-window.ai-window-opening {
          animation: aiWindowPopIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ace-ai-chat-window.ai-window-closing {
          animation: aiWindowPopOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          pointer-events: none;
        }

        .ai-dot-pulse {
          width: 5px;
          height: 5px;
          background: #73c991;
          border-radius: 50%;
          display: inline-block;
          animation: aiPulse 1.2s infinite ease-in-out;
        }

        @keyframes aiPulse {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        /* Custom Scrollbar for Chat Feed */
        .ace-ai-messages-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .ace-ai-messages-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .ace-ai-messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }
        .ace-ai-messages-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(242, 240, 234, 0.35);
        }

        @keyframes aiMobileSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0.4;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes aiMobileSlideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0.4;
          }
        }

        /* Responsive Mobile Behavior (<640px) */
        @media (max-width: 640px) {
          .ace-ai-bot-root {
            bottom: max(16px, env(safe-area-inset-bottom)) !important;
            right: 16px !important;
          }
          .ace-ai-bot-root.is-open .ace-ai-trigger-pill {
            display: none !important;
          }
          .ace-ai-trigger-pill {
            width: 46px !important;
            height: 46px !important;
            min-width: 46px !important;
            padding: 0 !important;
            gap: 0 !important;
            justify-content: center !important;
            align-items: center !important;
            border-radius: 50% !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
          }
          .ace-ai-trigger-emblem-desktop,
          .ace-ai-trigger-text,
          .ace-ai-trigger-arrow {
            display: none !important;
          }
          .ace-ai-trigger-emblem-mobile {
            display: flex !important;
          }
          .ace-ai-chat-window {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100% !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            bottom: 0 !important;
            right: 0 !important;
            z-index: 10000 !important;
          }
          .ace-ai-chat-window.ai-window-opening {
            animation: aiMobileSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          }
          .ace-ai-chat-window.ai-window-closing {
            animation: aiMobileSlideDown 0.26s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
          }
          .ace-ai-chat-header {
            padding-top: max(16px, env(safe-area-inset-top)) !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .ace-ai-header-btn {
            width: 36px !important;
            height: 36px !important;
            font-size: 15px !important;
          }
          .ace-ai-chat-footer {
            padding-bottom: max(14px, env(safe-area-inset-bottom)) !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .ace-ai-textarea {
            font-size: 16px !important;
          }
        }

        /* Responsive Tablet Behavior (641px - 1024px) */
        @media (min-width: 641px) and (max-width: 1024px) {
          .ace-ai-chat-window {
            width: 390px !important;
            height: 560px !important;
          }
        }
      `}</style>
    </>
  );
}
