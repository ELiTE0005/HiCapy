import React, { useEffect, useState, useCallback } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

let _showToast: (msg: string, type?: ToastType) => void = () => {};

export function showToast(msg: string, type: ToastType = 'success') {
  _showToast(msg, type);
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const show = useCallback((msg: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  useEffect(() => {
    _showToast = show;
  }, [show]);

  return (
    <div style={{
      position: 'fixed', bottom: '50px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999,
      pointerEvents: 'none', alignItems: 'center',
    }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast-item toast-${t.type}`}>
          {t.type === 'success' && '✓ '}
          {t.type === 'error' && '✕ '}
          {t.type === 'warn' && '⚠ '}
          {t.type === 'info' && 'ℹ '}
          {t.msg}
        </div>
      ))}
    </div>
  );
};
