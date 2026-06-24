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
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = React.useState(false);

  React.useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.height < 360);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} style={styles.card(isCompact)} role="region" aria-label={`TV Remote Control for ${name}`}>
      <div style={styles.header}>
        <h3 style={styles.name}>{name}</h3>
        <button onClick={onPowerToggle} style={styles.powerBtn} aria-label="Toggle Power">
          <Icon path={mdiPower} size={0.8} color="#ef4444" />
        </button>
      </div>

      <div style={styles.dpadContainer(isCompact)}>
        <div style={styles.dpadSpacer} />
        <button onClick={() => onSendCommand('up')} style={styles.dpadBtn('up', isCompact)} aria-label="Up">
          <Icon path={mdiChevronUp} size={isCompact ? 0.75 : 0.9} color="#ffffff" />
        </button>
        <div style={styles.dpadSpacer} />

        <button onClick={() => onSendCommand('left')} style={styles.dpadBtn('left', isCompact)} aria-label="Left">
          <Icon path={mdiChevronLeft} size={isCompact ? 0.75 : 0.9} color="#ffffff" />
        </button>
        <button onClick={() => onSendCommand('select')} style={styles.dpadSelect(isCompact)} aria-label="Select">
          OK
        </button>
        <button onClick={() => onSendCommand('right')} style={styles.dpadBtn('right', isCompact)} aria-label="Right">
          <Icon path={mdiChevronRight} size={isCompact ? 0.75 : 0.9} color="#ffffff" />
        </button>

        <div style={styles.dpadSpacer} />
        <button onClick={() => onSendCommand('down')} style={styles.dpadBtn('down', isCompact)} aria-label="Down">
          <Icon path={mdiChevronDown} size={isCompact ? 0.75 : 0.9} color="#ffffff" />
        </button>
        <div style={styles.dpadSpacer} />
      </div>

      <div style={styles.navRow(isCompact)}>
        <button onClick={() => onSendCommand('back')} style={styles.navBtn(isCompact)} aria-label="Back">
          <Icon path={mdiArrowLeft} size={isCompact ? 0.65 : 0.8} color="#9ca3af" />
        </button>
        <button onClick={() => onSendCommand('home')} style={styles.navBtn(isCompact)} aria-label="Home">
          <Icon path={mdiHome} size={isCompact ? 0.65 : 0.8} color="#9ca3af" />
        </button>
      </div>

      <div style={styles.mediaRow(isCompact)}>
        <button onClick={() => onSendCommand('play')} style={styles.navBtn(isCompact)} aria-label="Play">
          <Icon path={mdiPlay} size={isCompact ? 0.65 : 0.8} color="#9ca3af" />
        </button>
        <button onClick={() => onSendCommand('pause')} style={styles.navBtn(isCompact)} aria-label="Pause">
          <Icon path={mdiPause} size={isCompact ? 0.65 : 0.8} color="#9ca3af" />
        </button>
      </div>

      <div style={styles.volumeControl(isCompact)}>
        <button onClick={onVolumeDown} style={styles.volBtn(isCompact)} aria-label="Volume Down">
          <Icon path={mdiVolumeMinus} size={isCompact ? 0.65 : 0.8} color="#ffffff" />
        </button>
        <button onClick={onMute} style={styles.muteBtn(isCompact)} aria-label="Mute Volume">
          <Icon path={mdiVolumeMute} size={isCompact ? 0.65 : 0.8} color="#9ca3af" />
        </button>
        <button onClick={onVolumeUp} style={styles.volBtn(isCompact)} aria-label="Volume Up">
          <Icon path={mdiVolumePlus} size={isCompact ? 0.65 : 0.8} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: (isCompact: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: isCompact ? '10px' : '16px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    userSelect: 'none' as const,
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '4px',
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
    flexShrink: 0,
  },
  dpadContainer: (isCompact: boolean) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: isCompact ? '2px' : '4px',
    width: isCompact ? '100px' : '136px',
    height: isCompact ? '100px' : '136px',
    margin: isCompact ? '4px auto' : '12px auto',
    alignItems: 'center',
    justifyItems: 'center',
  }),
  dpadSpacer: {
    width: '100%',
    height: '100%',
  },
  dpadBtn: (direction: string, isCompact: boolean) => {
    let borderRadius = '8px';
    if (direction === 'up') borderRadius = '24px 24px 8px 8px';
    else if (direction === 'down') borderRadius = '8px 8px 24px 24px';
    else if (direction === 'left') borderRadius = '24px 8px 8px 24px';
    else if (direction === 'right') borderRadius = '8px 24px 24px 8px';

    const btnSize = isCompact ? '30px' : '40px';

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
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
  dpadSelect: (isCompact: boolean) => {
    const btnSize = isCompact ? '30px' : '40px';
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      border: 'none',
      color: '#ffffff',
      fontSize: isCompact ? '9px' : '11px',
      fontWeight: 700,
      cursor: 'pointer',
      outline: 'none',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
      ':active': {
        backgroundColor: '#2563eb',
      },
    };
  },
  navRow: (isCompact: boolean) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: isCompact ? '12px' : '24px',
    width: '100%',
    margin: isCompact ? '2px 0' : '6px 0',
  }),
  mediaRow: (isCompact: boolean) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: isCompact ? '12px' : '24px',
    width: '100%',
    margin: isCompact ? '2px 0' : '6px 0',
  }),
  navBtn: (isCompact: boolean) => {
    const btnSize = isCompact ? '26px' : '32px';
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      transition: 'background-color 0.1s',
    };
  },
  volumeControl: (isCompact: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: isCompact ? '4px' : '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  }),
  volBtn: (isCompact: boolean) => {
    const btnSize = isCompact ? '26px' : '32px';
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
      borderRadius: '8px',
      backgroundColor: '#1f2937',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
    };
  },
  muteBtn: (isCompact: boolean) => {
    const btnSize = isCompact ? '26px' : '32px';
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: btnSize,
      height: btnSize,
      borderRadius: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
    };
  },
};
