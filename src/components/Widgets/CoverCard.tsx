import React from 'react';
import Icon from '@mdi/react';
import { mdiArrowUp, mdiStop, mdiArrowDown, mdiWindowShutter } from '@mdi/js';
import type { CoverProps } from '../../converters/coverConverter';

interface CoverCardProps {
  props: CoverProps;
  onOpen: () => void;
  onClose: () => void;
  onStop: () => void;
  onSetPosition: (position: number) => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const CoverCard: React.FC<CoverCardProps> = ({
  props,
  onOpen,
  onClose,
  onStop,
  onSetPosition,
  nameOverride,
  iconOverride,
}) => {
  const { state, position, stateText, supportsPosition, supportsOpen, supportsClose, supportsStop } = props;
  const displayName = nameOverride || props.name;

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetPosition(parseInt(e.target.value, 10));
  };

  const isOpen = state === 'open';

  return (
    <div style={styles.card(isOpen)} role="region" aria-label={`Cover controls for ${displayName}`}>
      <div style={styles.header}>
        <div style={styles.iconContainer(isOpen)}>
          <Icon
            path={iconOverride || mdiWindowShutter}
            size={1.1}
            color={isOpen ? '#f59e0b' : '#9ca3af'}
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(isOpen)}>{stateText}</span>
        </div>
      </div>

      <div style={styles.controls}>
        <button
          style={styles.actionBtn(!supportsOpen)}
          disabled={!supportsOpen}
          onClick={onOpen}
          aria-label="Open cover"
          title="Open"
        >
          <Icon path={mdiArrowUp} size={0.9} color={supportsOpen ? '#f3f4f6' : '#4b5563'} />
        </button>

        <button
          style={styles.actionBtn(!supportsStop)}
          disabled={!supportsStop}
          onClick={onStop}
          aria-label="Stop cover movement"
          title="Stop"
        >
          <Icon path={mdiStop} size={0.9} color={supportsStop ? '#f3f4f6' : '#4b5563'} />
        </button>

        <button
          style={styles.actionBtn(!supportsClose)}
          disabled={!supportsClose}
          onClick={onClose}
          aria-label="Close cover"
          title="Close"
        >
          <Icon path={mdiArrowDown} size={0.9} color={supportsClose ? '#f3f4f6' : '#4b5563'} />
        </button>
      </div>

      {supportsPosition && (
        <div style={styles.sliderContainer}>
          <span style={styles.sliderLabel}>Position</span>
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={handlePositionChange}
            style={styles.slider}
            aria-label="Cover position slider"
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  card: (isOpen: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    background: isOpen
      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(10, 15, 30, 0.75) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    border: isOpen ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid transparent',
    borderRadius: '12px',
    transition: 'all 0.25s ease',
    userSelect: 'none' as const,
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '10px',
  },
  iconContainer: (isOpen: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: isOpen ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s',
  }),
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
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
  state: (isOpen: boolean) => ({
    fontSize: '11px',
    color: isOpen ? '#f59e0b' : '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  }),
  controls: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  actionBtn: (disabled: boolean) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: disabled ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    cursor: disabled ? ('default' as const) : ('pointer' as const),
    outline: 'none',
    transition: 'background-color 0.2s',
  }),
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  sliderLabel: {
    fontSize: '10px',
    color: '#9ca3af',
    fontWeight: 500,
  },
  slider: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#374151',
    outline: 'none',
    cursor: 'pointer',
    accentColor: '#f59e0b',
  },
};
