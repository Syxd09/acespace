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
    title: 'In-Stock Slabs',
    prompt: 'Which materials are currently in stock at Ace Spaces?',
  },
  {
    title: 'Calacatta Greige Specs',
    prompt: 'Tell me about Calacatta Greige (COR-CG01) and if it is in stock',
  },
  {
    title: 'Marble vs Corian',
    prompt: 'How does Corian solid surface compare to natural marble for kitchen countertops?',
  },
  {
    title: 'Waterfall Islands',
    prompt: 'Suggest the best in-stock material for a seamless kitchen island with waterfall edges',
  },
  {
    title: 'Studio Location',
    prompt: 'Where is the Ace Spaces studio located in Bengaluru, and how can I visit?',
  },
  {
    title: 'Zero-Silica Safety',
    prompt: 'What makes DuPont™ Corian® 100% zero-silica and safe?',
  },
];

export default function ArchitecturalAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHalfScreen, setIsHalfScreen] = useState(false);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleHalfScreen = () => {
    if (isHalfScreen) {
      setIsHalfScreen(false);
      setCustomWidth(420);
    } else {
      setIsHalfScreen(true);
      setCustomWidth(null);
    }
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    const chatEl = document.querySelector('.ace-ai-chat-window') as HTMLElement | null;
    const currentW = chatEl
      ? chatEl.getBoundingClientRect().width
      : customWidth || (isHalfScreen ? window.innerWidth * 0.5 : 420);
    startWidthRef.current = currentW;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startXRef.current - moveEvent.clientX;
      const minW = 380;
      const maxW = Math.min(window.innerWidth * 0.88, 1280);
      const newWidth = Math.max(minW, Math.min(maxW, startWidthRef.current + deltaX));
      setCustomWidth(newWidth);
      if (newWidth >= window.innerWidth * 0.45) {
        setIsHalfScreen(true);
      } else {
        setIsHalfScreen(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const navigateToSiteLink = (href: string) => {
    if (!href) return;

    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isOpen || isClosing)) {
        handleCloseChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isClosing]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('acespaces_ai_chat_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const welcomeMessage: ChatMessage = {
          id: 'welcome-0',
          role: 'assistant',
          content: `Welcome to the **Ace Spaces Studio Desk**.

We can help you with in-stock DuPont™ Corian® mineral slabs, sample dispatch, 5-axis CNC machining, and joint details for kitchen islands, vanities, and commercial fixtures.

How can we help with your drawings or material selection today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            { label: 'In-Stock Materials', prompt: 'Which materials are currently in stock at Ace Spaces?' },
            { label: 'Calacatta Greige Specs', prompt: 'Tell me about Calacatta Greige (COR-CG01) and if it is in stock' },
            { label: 'Studio on Google Maps', href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7' },
          ],
        };
        setMessages([welcomeMessage]);
      }
    } catch (e) {
      console.error('Session storage error:', e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('acespaces_ai_chat_history', JSON.stringify(messages));
      } catch (e) {
        // quota ignore
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth <= 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
        content: data.response || 'Thank you. Please review our material catalog or connect with our workshop team.',
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
        content: `Thank you for your inquiry.

Our workshop team in Bengaluru works directly with DuPont™ Corian® mineral surfaces, 5-axis CNC routing, and custom thermoforming.

You can message our studio directly via the WhatsApp link in the top navigation or explore our in-stock materials.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Browse Materials', href: '/materials' },
          { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' },
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
    try {
      sessionStorage.removeItem('acespaces_ai_chat_history');
    } catch {
      // ignore
    }
    const welcomeMessage: ChatMessage = {
      id: 'welcome-fresh',
      role: 'assistant',
      content: `Conversation refreshed.

Ask about in-stock slabs, custom fabrication tolerances, or visit details for our Bengaluru workshop.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'In-Stock Materials', prompt: 'Which materials are currently in stock at Ace Spaces?' },
        { label: 'Studio Location', href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7' },
      ],
    };
    setMessages([welcomeMessage]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={i} style={{ height: '8px' }} />);
        i++;
        continue;
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4
            key={i}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1e211d',
              letterSpacing: '-0.01em',
              margin: '12px 0 6px',
            }}
          >
            {trimmed.replace('### ', '')}
          </h4>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3
            key={i}
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1e211d',
              letterSpacing: '-0.02em',
              margin: '14px 0 8px',
            }}
          >
            {trimmed.replace('## ', '')}
          </h3>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const itemText = trimmed.replace(/^[-•]s*/, '');
        elements.push(
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '12.5px',
              lineHeight: '1.6',
              color: '#384037',
              margin: '3px 0',
            }}
          >
            <span
              style={{
                color: 'var(--brand-red, #c4433d)',
                fontSize: '11px',
                marginTop: '1px',
                flexShrink: 0,
              }}
            >
              —
            </span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemText) }} />
          </div>
        );
        i++;
        continue;
      }

      const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
      if (numMatch) {
        elements.push(
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '12.5px',
              lineHeight: '1.6',
              color: '#384037',
              margin: '3px 0',
            }}
          >
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                color: '#6f786f',
                flexShrink: 0,
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
            fontSize: '12.5px',
            lineHeight: '1.6',
            color: '#384037',
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
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#1e211d; font-weight:600;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#2a3029;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(30,33,29,0.06); padding:1px 5px; border-radius:3px; font-family:DM Mono,monospace; font-size:11px; color:#1e211d; border:1px solid rgba(30,33,29,0.1);">$1</code>');
  };

  const isConfigurator = pathname?.startsWith('/configurator') || pathname?.startsWith('/basin-configurator');

  return (
    <>
      <aside
        className={`ace-ai-bot-root ${isOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''} ${isConfigurator ? 'is-configurator' : ''}`}
        aria-label="Ace Spaces Studio Desk Advisory"
        style={{
          position: 'fixed',
          bottom: isConfigurator ? '96px' : '24px',
          right: '24px',
          zIndex: 990,
          fontFamily: 'Manrope, sans-serif',
          transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {(isOpen || isClosing) && (
          <div
            className={`ace-ai-chat-window ${isClosing ? 'ai-window-closing' : 'ai-window-opening'} ${isHalfScreen ? 'is-half-screen' : ''}`}
            style={{
              position: 'absolute',
              bottom: '58px',
              right: '0',
              width: customWidth ? `${customWidth}px` : isHalfScreen ? '50vw' : '420px',
              minWidth: '380px',
              maxWidth: 'calc(100vw - 32px)',
              height: isHalfScreen ? 'calc(100vh - 96px)' : '620px',
              maxHeight: 'calc(100vh - 96px)',
              background: '#fcfbf9',
              color: '#1e211d',
              border: '1px solid rgba(30, 33, 29, 0.12)',
              borderRadius: '6px',
              boxShadow: '0 24px 60px rgba(30, 33, 29, 0.15), 0 4px 16px rgba(30, 33, 29, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'bottom right',
              transition: isDragging
                ? 'none'
                : 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            }}
          >
            {/* Left Edge Drag Handle */}
            <div
              className="ace-ai-resize-handle"
              onMouseDown={handleMouseDownResize}
              onDoubleClick={toggleHalfScreen}
              title="Drag left to resize (Double-click to toggle 50% spread)"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '12px',
                cursor: 'ew-resize',
                zIndex: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '3px',
                  height: isDragging ? '46px' : '26px',
                  borderRadius: '2px',
                  background: isDragging ? 'var(--brand-red, #c4433d)' : 'rgba(30, 33, 29, 0.16)',
                  transition: 'background 0.2s ease, height 0.2s ease',
                }}
              />
            </div>

            {/* Studio Header */}
            <header
              className="ace-ai-chat-header"
              style={{
                padding: '14px 18px',
                background: '#ffffff',
                borderBottom: '1px solid rgba(30, 33, 29, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/logo/icon-logo-transparent.png"
                    alt="Ace Spaces Logo"
                    style={{ width: '22px', height: '22px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#1e211d',
                      fontFamily: 'DM Mono, monospace',
                    }}
                  >
                    Ace Spaces Studio Desk
                  </h3>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#6f786f',
                      fontFamily: 'var(--serif)',
                      fontStyle: 'italic',
                      marginTop: '1px',
                    }}
                  >
                    Atelier Material &amp; Technical Advisory
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className="ace-ai-header-btn"
                  onClick={handleClearChat}
                  title="Refresh Conversation"
                  aria-label="Refresh conversation"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(30, 33, 29, 0.12)',
                    color: '#495248',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ↻
                </button>

                <button
                  type="button"
                  className="ace-ai-header-btn"
                  onClick={toggleHalfScreen}
                  title={isHalfScreen ? 'Compact View' : 'Spread View'}
                  aria-label={isHalfScreen ? 'Compact View' : 'Spread View'}
                  style={{
                    background: isHalfScreen ? 'rgba(30, 33, 29, 0.08)' : 'transparent',
                    border: '1px solid rgba(30, 33, 29, 0.12)',
                    color: '#495248',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isHalfScreen ? '⤡' : '⤢'}
                </button>

                <button
                  type="button"
                  className="ace-ai-header-btn"
                  onClick={handleCloseChat}
                  title="Close Advisory Desk"
                  aria-label="Close conversation"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(30, 33, 29, 0.12)',
                    color: '#495248',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
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
                background: '#fbfaf7',
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
                  <div
                    style={{
                      maxWidth: msg.role === 'user' ? '86%' : '94%',
                      padding: msg.role === 'user' ? '10px 14px' : '14px 16px',
                      borderRadius: msg.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                      background: msg.role === 'user' ? '#eae6dc' : '#ffffff',
                      color: '#1e211d',
                      border: '1px solid rgba(30, 33, 29, 0.08)',
                      boxShadow: msg.role === 'user'
                        ? '0 2px 6px rgba(30, 33, 29, 0.04)'
                        : '0 2px 10px rgba(30, 33, 29, 0.04)',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <div style={{ fontSize: '13px', lineHeight: '1.45', fontWeight: 500 }}>
                        {msg.content}
                      </div>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}

                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid rgba(30, 33, 29, 0.07)',
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
                                color: '#2d332c',
                                background: 'rgba(30, 33, 29, 0.04)',
                                border: '1px solid rgba(30, 33, 29, 0.12)',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
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
                                color: '#2d332c',
                                background: 'rgba(30, 33, 29, 0.04)',
                                border: '1px solid rgba(30, 33, 29, 0.12)',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {action.label}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      color: '#8a9489',
                      fontFamily: 'DM Mono, monospace',
                      marginTop: '3px',
                      padding: '0 4px',
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              ))}

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
                      borderRadius: '12px 12px 12px 3px',
                      background: '#ffffff',
                      border: '1px solid rgba(30, 33, 29, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontFamily: 'DM Mono, monospace',
                        letterSpacing: '0.04em',
                        color: '#6f786f',
                      }}
                    >
                      Reviewing workshop details...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Starter Prompt Chips */}
            {messages.length <= 1 && (
              <div
                style={{
                  padding: '8px 16px 12px',
                  background: '#f5f3ec',
                  borderTop: '1px solid rgba(30, 33, 29, 0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6f786f',
                    marginBottom: '6px',
                  }}
                >
                  Quick Topics:
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
                        fontSize: '10.5px',
                        fontFamily: 'DM Mono, monospace',
                        padding: '6px 11px',
                        borderRadius: '4px',
                        background: '#ffffff',
                        border: '1px solid rgba(30, 33, 29, 0.12)',
                        color: '#2a3029',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1e211d';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#1e211d';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#2a3029';
                        e.currentTarget.style.borderColor = 'rgba(30, 33, 29, 0.12)';
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
                background: '#ffffff',
                borderTop: '1px solid rgba(30, 33, 29, 0.08)',
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
                  background: 'rgba(30, 33, 29, 0.03)',
                  border: '1px solid rgba(30, 33, 29, 0.12)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                }}
              >
                <textarea
                  ref={textareaRef}
                  className="ace-ai-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about slabs, finishes, kitchen islands, or vanities..."
                  rows={2}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#1e211d',
                    fontSize: '12.5px',
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
                    background: input.trim() && !isLoading ? '#1e211d' : 'rgba(30, 33, 29, 0.08)',
                    color: input.trim() && !isLoading ? '#ffffff' : '#8c968b',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  ↗
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '9.5px',
                  fontFamily: 'DM Mono, monospace',
                  color: '#788278',
                  letterSpacing: '0.02em',
                }}
              >
                <span>Enter to send · Shift+Enter for new line</span>
                <Link
                  href="https://wa.me/919741044776"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1e211d', textDecoration: 'none', fontWeight: 500 }}
                >
                  WhatsApp Studio Line ↗
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Architectural Floating Trigger Seal */}
        <button
          type="button"
          onClick={handleToggleChat}
          aria-expanded={isOpen}
          aria-label="Ace Spaces Studio Desk Advisory"
          className="ace-ai-trigger-seal"
          style={{
            background: '#151714',
            color: '#f5f2ea',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '100px',
            height: '40px',
            padding: '0 16px 0 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0, 0, 0, 0.16)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: (isOpen && !isClosing) ? 'scale(0.97)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(196, 67, 61, 0.55)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.38)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0, 0, 0, 0.16)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Logo Monogram */}
          <div
            style={{
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src="/logo/icon-logo-white-transparent.png"
              alt="Ace Spaces Logo"
              style={{ width: '18px', height: '18px', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Clean Single-Line Architectural Monogram Label */}
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#f5f2ea',
              lineHeight: 1,
            }}
          >
            Studio Desk
          </span>

          <span
            style={{
              width: '1px',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.18)',
              margin: '0 1px',
            }}
          />

          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.04em',
              color: 'rgba(245, 242, 234, 0.62)',
              lineHeight: 1,
            }}
          >
            Advisory
          </span>

          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: 'var(--brand-red, #c4433d)',
              marginLeft: '2px',
              lineHeight: 1,
              transition: 'transform 0.2s ease',
            }}
          >
            {isOpen ? '✕' : '↗'}
          </span>
        </button>
      </aside>

      <style jsx global>{`
        @keyframes aiWindowPopIn {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes aiWindowPopOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
        }

        .ace-ai-chat-window.ai-window-opening {
          animation: aiWindowPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ace-ai-chat-window.ai-window-closing {
          animation: aiWindowPopOut 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          pointer-events: none;
        }

        .ace-ai-messages-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .ace-ai-messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .ace-ai-messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(30, 33, 29, 0.14);
          border-radius: 4px;
        }

        .ai-inline-nav-link {
          color: var(--brand-red, #c4433d);
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 640px) {
          .ace-ai-bot-root {
            bottom: max(16px, env(safe-area-inset-bottom)) !important;
            right: 16px !important;
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
        }
      `}</style>
    </>
  );
}
