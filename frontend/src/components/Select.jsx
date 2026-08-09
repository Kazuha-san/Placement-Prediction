import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * A themed dropdown that looks and behaves like a native <select> but is
 * fully CSS-able end to end (including the open list, which a real <select>
 * hands off to the OS and can never be styled). Keyboard support: Enter/Space
 * opens, ArrowUp/ArrowDown navigates, Enter selects, Escape closes.
 *
 * options: [{ value: string, label: string }]
 */
const Select = ({ id, value, onChange, options, placeholder = '—' }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex];
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  const openList = () => {
    setOpen(true);
    const currentIdx = options.findIndex((o) => o.value === value);
    setActiveIndex(currentIdx >= 0 ? currentIdx : 0);
  };

  const commit = (idx) => {
    const opt = options[idx];
    if (opt) onChange(opt.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left pl-4 pr-3.5 py-3 bg-card
          border-2 border-line rounded-2xl text-ink focus:outline-none focus:ring-2
          focus:ring-[var(--color-primary-to)] focus:border-transparent cursor-pointer"
      >
        <span className={selected ? 'text-ink' : 'text-muted'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-muted shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto py-1.5
            bg-card border-2 border-line rounded-2xl shadow-soft"
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.value || 'empty'}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(idx)}
                className={`flex items-center justify-between mx-1.5 px-3 py-2 rounded-xl text-sm
                  cursor-pointer transition-colors
                  ${isActive ? 'bg-panel' : ''}
                  ${isSelected ? 'font-semibold text-ink' : 'text-ink'}`}
              >
                {opt.label}
                {isSelected && <Check size={16} className="text-[var(--color-primary-to)]" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
