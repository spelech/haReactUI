import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiLock, mdiLockOpen } from '@mdi/js';

interface SecureButtonProps {
  onConfirm: () => void;
  label: string;
  confirmLabel?: string;
  icon?: string;
  style?: React.CSSProperties;
}

export const SecureButton: React.FC<SecureButtonProps> = ({
  onConfirm,
  label,
  confirmLabel = 'Confirm?',
  icon,
  style,
}) => {
  const [isPrimed, setIsPrimed] = useState(false);

  useEffect(() => {
    if (!isPrimed) return;

    const timer = setTimeout(() => {
      setIsPrimed(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPrimed]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrimed) {
      onConfirm();
      setIsPrimed(false);
    } else {
      setIsPrimed(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        ...styles.button(isPrimed),
        ...style,
      }}
      aria-label={isPrimed ? confirmLabel : label}
    >
      <Icon
        path={icon || (isPrimed ? mdiLockOpen : mdiLock)}
        size={0.8}
        color={isPrimed ? '#ef4444' : '#ffffff'}
      />
      <span style={styles.text(isPrimed)}>
        {isPrimed ? confirmLabel : label}
      </span>
    </button>
  );
};

const styles = {
  button: (isPrimed: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '8px',
    backgroundColor: isPrimed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
    border: isPrimed ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isPrimed ? '0 0 12px rgba(239, 68, 68, 0.15)' : 'none',
    boxSizing: 'border-box' as const,
  }),
  text: (isPrimed: boolean) => ({
    fontSize: '12px',
    fontWeight: 600,
    color: isPrimed ? '#ef4444' : '#ffffff',
    transition: 'color 0.2s',
  }),
};
