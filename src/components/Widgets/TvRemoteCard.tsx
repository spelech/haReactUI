import React from 'react';
import { Icon } from '@mdi/react';
import {
  mdiPower,
  mdiVolumePlus,
  mdiVolumeMinus,
  mdiVolumeMute,
  mdiChevronUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiHome,
  mdiArrowLeft,
  mdiPlay,
  mdiPause
} from '@mdi/js';

interface TvRemoteCardProps {
  name: string;
  onSendCommand: (command: string) => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onPowerToggle: () => void;
}

export const TvRemoteCard: React.FC<TvRemoteCardProps> = ({
  name,
  onSendCommand,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onPowerToggle,
}) => {
  return (
    <div style={styles.card} role="region" aria-label={`TV Remote Control for ${name}`}>
      <div style={styles.header}>
        <h3 style={styles.name}>{name}</h3>
        <button onClick={onPowerToggle} style={styles.powerBtn} aria-label="Toggle Power">
          <Icon path={mdiPower} size={0.8} color="#ef4444" />
        </button>
      </div>

      <div style={styles.dpadContainer}>
        <div style={styles.dpadSpacer} />
        <button onClick={() => onSendCommand('up')} style={styles.dpadBtn('up')} aria-label="Up">
          <Icon path={mdiChevronUp} size={0.9} color="#ffffff" />
        </button>
        <div style={styles.dpadSpacer} />

        <button onClick={() => onSendCommand('left')} style={styles.dpadBtn('left')} aria-label="Left">
          <Icon path={mdiChevronLeft} size={0.9} color="#ffffff" />
        </button>
        <button onClick={() => onSendCommand('select')} style={styles.dpadSelect} aria-label="Select">
          OK
        </button>
        <button onClick={() => onSendCommand('right')} style={styles.dpadBtn('right')} aria-label="Right">
          <Icon path={mdiChevronRight} size={0.9} color="#ffffff" />
        </button>

        <div style={styles.dpadSpacer} />
        <button onClick={() => onSendCommand('down')} style={styles.dpadBtn('down')} aria-label="Down">
          <Icon path={mdiChevronDown} size={0.9} color="#ffffff" />
        </button>
        <div style={styles.dpadSpacer} />
      </div>

      <div style={styles.navRow}>
        <button onClick={() => onSendCommand('back')} style={styles.navBtn} aria-label="Back">
          <Icon path={mdiArrowLeft} size={0.8} color="#9ca3af" />
        </button>
        <button onClick={() => onSendCommand('home')} style={styles.navBtn} aria-label="Home">
          <Icon path={mdiHome} size={0.8} color="#9ca3af" />
        </button>
      </div>

      <div style={styles.mediaRow}>
        <button onClick={() => onSendCommand('play')} style={styles.navBtn} aria-label="Play">
          <Icon path={mdiPlay} size={0.8} color="#9ca3af" />
        </button>
        <button onClick={() => onSendCommand('pause')} style={styles.navBtn} aria-label="Pause">
          <Icon path={mdiPause} size={0.8} color="#9ca3af" />
        </button>
      </div>

      <div style={styles.volumeControl}>
        <button onClick={onVolumeDown} style={styles.volBtn} aria-label="Volume Down">
          <Icon path={mdiVolumeMinus} size={0.8} color="#ffffff" />
        </button>
        <button onClick={onMute} style={styles.muteBtn} aria-label="Mute Volume">
          <Icon path={mdiVolumeMute} size={0.8} color="#9ca3af" />
        </button>
        <button onClick={onVolumeUp} style={styles.volBtn} aria-label="Volume Up">
          <Icon path={mdiVolumePlus} size={0.8} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '16px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    userSelect: 'none' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '8px',
  },
  name: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  powerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    cursor: 'pointer',
    outline: 'none',
  },
  dpadContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '4px',
    width: '136px',
    height: '136px',
    margin: '12px auto',
    alignItems: 'center',
    justifyItems: 'center',
  },
  dpadSpacer: {
    width: '100%',
    height: '100%',
  },
  dpadBtn: (direction: string) => {
    let borderRadius = '8px';
    if (direction === 'up') borderRadius = '24px 24px 8px 8px';
    else if (direction === 'down') borderRadius = '8px 8px 24px 24px';
    else if (direction === 'left') borderRadius = '24px 8px 8px 24px';
    else if (direction === 'right') borderRadius = '8px 24px 24px 8px';

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius,
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      cursor: 'pointer',
      outline: 'none',
      transition: 'background-color 0.1s',
      ':active': {
        backgroundColor: '#374151',
      },
    };
  },
  dpadSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: 'none',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
    ':active': {
      backgroundColor: '#2563eb',
    },
  },
  navRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    width: '100%',
    margin: '6px 0',
  },
  mediaRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    width: '100%',
    margin: '6px 0',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.1s',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  volBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
  muteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
};
