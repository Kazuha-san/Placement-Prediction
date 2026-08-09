import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-10 w-[72px] rounded-full bg-panel border border-line transition-colors shrink-0"
      aria-label="Toggle theme"
    >
      <span className="absolute inset-0 flex items-center justify-between px-2.5 text-muted/40">
        <Sun size={18} />
        <Moon size={18} />
      </span>
      <span
        className={`absolute left-1 flex items-center justify-center w-8 h-8 bg-card rounded-full shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-8' : 'translate-x-0'}`}
      >
        {isDark ? <Moon size={18} className="text-ink" /> : <Sun size={18} className="text-ink" />}
      </span>
    </button>
  );
};

export default ThemeToggle;
