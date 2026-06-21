import React from 'react';

interface EditToolbarProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onAddWidget: () => void;
  onLogout?: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({
  isEditing,
  onToggleEdit,
  onAddWidget,
  onLogout,
}) => {
  if (!isEditing) {
    return (
      <div style={styles.floatingContainer}>
        {onLogout && (
          <button style={styles.floatingBtn('#ef4444')} onClick={onLogout} title="Disconnect/Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button style={styles.floatingBtn('#3b82f6')} onClick={onToggleEdit} title="Edit Dashboard">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div style={styles.toolbar}>
      <div style={styles.titleSection}>
        <span style={styles.dot} />
        <span style={styles.title}>Edit Mode</span>
      </div>
      <div style={styles.actions}>
        <button style={styles.btn('#10b981')} onClick={onAddWidget}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Widget
        </button>
        <button style={styles.btn('#3b82f6')} onClick={onToggleEdit}>
          Done
        </button>
      </div>
    </div>
  );
};

const styles = {
  floatingContainer: {
    position: 'fixed' as const,
    top: '16px',
    right: '16px',
    display: 'flex',
    gap: '8px',
    zIndex: 9000,
  },
  floatingBtn: (color: string) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s, background-color 0.2s',
    ':hover': {
      backgroundColor: '#1f2937',
    },
  }),
  toolbar: {
    width: '100%',
    height: '60px',
    backgroundColor: '#111827',
    borderBottom: '1px solid #1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxSizing: 'border-box' as const,
    position: 'sticky' as const,
    top: 0,
    zIndex: 9000,
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#fbbf24',
    animation: 'pulse 1.5s infinite',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fbbf24',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  btn: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: color,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }),
};
