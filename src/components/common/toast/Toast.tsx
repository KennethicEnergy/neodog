'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

export type ToastScheme = 'primary' | 'success' | 'danger' | 'warning';

interface ToastProps {
  scheme: ToastScheme;
  title: string;
  message: string | string[];
  onDismiss?: () => void;
  timeout?: number;
}

const FADE_DURATION = 300;

const Toast: React.FC<ToastProps> = ({ scheme, title, message, onDismiss, timeout = 4000 }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!timeout) return;
    autoTimeoutRef.current = setTimeout(() => {
      setFading(true);
      fadeTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, FADE_DURATION);
    }, timeout);
    return () => {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [timeout, onDismiss]);

  const handleDismiss = () => {
    setFading(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, FADE_DURATION);
  };

  if (!visible) return null;

  // Handle message rendering - support both string and array of strings
  const renderMessage = () => {
    if (Array.isArray(message)) {
      return (
        <div className={styles.message}>
          {message.map((msg, index) => (
            <div key={index} className={styles.messageLine}>
              {message.length > 1 && '• '}
              {msg}
            </div>
          ))}
        </div>
      );
    }
    return <div className={styles.message}>{message}</div>;
  };

  return (
    <div
      className={`${styles.toast} ${styles[scheme]} ${fading ? styles.fadeOut : styles.fadeIn}`}
      role="alert"
      aria-live="assertive"
      style={
        {
          '--toast-loader-duration': `${timeout}ms`
        } as React.CSSProperties
      }>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button className={styles.dismiss} onClick={handleDismiss} aria-label="Dismiss">
          &times;
        </button>
      </div>
      {renderMessage()}
    </div>
  );
};

export default Toast;
