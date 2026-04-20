import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, id }) => {
  const toggleId = id || 'toggle-' + Math.random().toString(36).slice(2);
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={toggleId} className={styles.label}>{label}</label>}
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        className={[styles.toggle, checked ? styles.on : styles.off].join(' ')}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
};
