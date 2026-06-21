import React, { useState, useEffect } from 'react';
import type { WidgetConfig } from '../../hooks/useLayoutManager';

interface WidgetConfigModalProps {
  widget: WidgetConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, overrides: { name?: string; icon?: string }) => void;
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({
  widget,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (widget) {
      setName(widget.overrides?.name || '');
      setIcon(widget.overrides?.icon || '');
    }
  }, [widget]);

  if (!isOpen || !widget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(widget.id, {
      name: name.trim() || undefined,
      icon: icon.trim() || undefined,
    });
    onClose();
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Configure Widget</h2>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Custom Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Living Room Lamp"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Custom Icon Override</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. MDI path or custom identifier"
              style={styles.input}
            />
            <span style={styles.helpText}>
              Paste a custom SVG path to override the default widget icon.
            </span>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn}>
              Save Overrides
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  modal: {
    width: '90%',
    maxWidth: '420px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#f3f4f6',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '24px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#9ca3af',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    color: '#f3f4f6',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  helpText: {
    fontSize: '11px',
    color: '#6b7280',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
