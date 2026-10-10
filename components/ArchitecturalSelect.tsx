'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  meta?: string;
}

export interface ArchitecturalSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ArchitecturalSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  name,
  id,
  disabled = false,
  required = false,
  className = '',
  style = {},
}: ArchitecturalSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Normalize options to uniform shape
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedIndex = normalizedOptions.findIndex((o) => o.value === value);
  const selectedOption = selectedIndex >= 0 ? normalizedOptions[selectedIndex] : null;

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Scroll highlighted item into view if navigating with keyboard
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return next;
    });
  };

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < normalizedOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : normalizedOptions.length - 1
      );
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
        handleSelect(normalizedOptions[highlightedIndex].value);
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`architectural-select-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
        ...style,
      }}
    >
      <style>{`
        .arch-select-trigger:hover:not(:disabled) {
          background: #f4f3ec !important;
          border-color: rgba(30, 33, 29, 0.45) !important;
        }
        .arch-select-trigger:focus-visible {
          outline: 2px solid #dc2626 !important;
          outline-offset: 2px !important;
        }
        .arch-select-menu {
          animation: archSelectSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(30, 33, 29, 0.25) transparent;
        }
        @keyframes archSelectSlideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .arch-select-menu::-webkit-scrollbar {
          width: 5px;
        }
        .arch-select-menu::-webkit-scrollbar-track {
          background: #faf9f5;
        }
        .arch-select-menu::-webkit-scrollbar-thumb {
          background: rgba(30, 33, 29, 0.2);
          border-radius: 2px;
        }
        .arch-select-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(30, 33, 29, 0.35);
        }
      `}</style>

      {/* Hidden native input for form compatibility */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        id={selectId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="arch-select-trigger"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '11px 14px',
          background: isOpen ? '#ffffff' : '#faf9f5',
          border: `1px solid ${isOpen ? 'var(--ink, #1a1d19)' : 'var(--line, rgba(30,33,29,0.2))'}`,
          borderRadius: '1px',
          color: selectedOption ? '#1a1d19' : '#8c948c',
          fontFamily: 'Manrope, system-ui, -apple-system, sans-serif',
          fontSize: '13.5px',
          fontWeight: 500,
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen
            ? '0 3px 12px rgba(26, 29, 25, 0.08)'
            : 'none',
          transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            color: selectedOption ? '#1a1d19' : '#888888',
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Minimalist architectural chevron with red highlight on open */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease',
            color: isOpen ? '#dc2626' : '#788078',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" />
          </svg>
        </span>
      </button>

      {/* Floating Options Panel */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby={selectId}
          className="arch-select-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            right: 0,
            zIndex: 90,
            margin: 0,
            padding: '6px 0',
            listStyle: 'none',
            background: '#ffffff',
            border: '1px solid rgba(30, 33, 29, 0.16)',
            borderRadius: '2px',
            boxShadow:
              '0 16px 36px -6px rgba(26, 29, 25, 0.16), 0 4px 14px -2px rgba(26, 29, 25, 0.08)',
            maxHeight: '290px',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            outline: 'none',
          }}
        >
          {normalizedOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontFamily: 'Manrope, system-ui, sans-serif',
                  fontSize: '13px',
                  color: isSelected ? 'var(--ink, #1a1d19)' : '#2e332d',
                  fontWeight: isSelected ? 600 : 400,
                  background: isSelected
                    ? '#edeae0'
                    : isHighlighted
                    ? '#f6f5ef'
                    : 'transparent',
                  borderLeft: isSelected
                    ? '3px solid #dc2626'
                    : '3px solid transparent',
                  transition: 'background 0.12s ease, border-left-color 0.12s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      color: isSelected ? '#dc2626' : '#99a199',
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt.label}
                  </span>
                </div>

                {isSelected && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#dc2626',
                      flexShrink: 0,
                    }}
                    title="Selected"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
                    </svg>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
