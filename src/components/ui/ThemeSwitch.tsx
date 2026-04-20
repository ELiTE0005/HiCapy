import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import './ThemeSwitch.css';

interface ThemeSwitchProps {
  className?: string;
  theme: 'light' | 'dark';
  onChange: () => void;
}

export function ThemeSwitch({ className = '', theme, onChange }: ThemeSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`theme-switch-btn ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      <Sun
        className={`theme-icon ${
          theme === 'light' ? 'icon-active' : 'icon-inactive'
        }`}
      />
      <Moon
        className={`theme-icon ${
          theme === 'dark' ? 'icon-active' : 'icon-inactive'
        }`}
      />
    </button>
  );
}
