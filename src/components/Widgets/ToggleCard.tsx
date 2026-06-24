import React from 'react';
import { Icon } from '@mdi/react';
import { mdiLightbulbOutline } from '@mdi/js';
import type { SwitchProps } from '../../converters/switchConverter';

interface ToggleCardProps {
  props: SwitchProps;
  onToggle: () => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  props,
  onToggle,
  nameOverride,
  iconOverride,
}) => {
  const { isOn, stateText } = props;
  const displayName = nameOverride || props.name;

  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = React.useState(false);

  React.useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.height < 110);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  if (isCompact) {
    return (
      <div ref={cardRef} style={styles.compactCard(isOn)} onClick={onToggle} role="button" aria-label={`Toggle ${displayName}`}>
        <div style={styles.compactLeft}>
          <div style={styles.iconContainer(isOn)}>
            <Icon
              path={iconOverride || mdiLightbulbOutline}
              size={0.9}
              color={isOn ? '#10b981' : '#9ca3af'}
            />
          </div>
          <div style={styles.compactInfo}>
            <span style={styles.compactName}>{displayName}</span>
            <span style={styles.compactState(isOn)}>{stateText}</span>
          </div>
        </div>
        <div style={styles.toggleTrack(isOn)}>
          <div style={styles.toggleThumb(isOn)} />
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} style={styles.card(isOn)} onClick={onToggle} role="button" aria-label={`Toggle ${displayName}`}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.iconContainer(isOn)}>
            <Icon
              path={iconOverride || mdiLightbulbOutline}
              size={1.1}
              color={isOn ? '#10b981' : '#9ca3af'}
            />
          </div>
          <div style={styles.toggleTrack(isOn)}>
            <div style={styles.toggleThumb(isOn)} />
          </div>
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(isOn)}>{stateText}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: (isOn: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    justifyContent: 'center',
    background: isOn
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(10, 15, 30, 0.75) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    border: isOn ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
    borderRadius: '12px',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    userSelect: 'none' as const,
  }),
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: (isOn: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: isOn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s',
    flexShrink: 0,
  }),
  toggleTrack: (isOn: boolean) => ({
    width: '32px',
    height: '18px',
    borderRadius: '9px',
    backgroundColor: isOn ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
    flexShrink: 0,
  }),
  toggleThumb: (isOn: boolean) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    position: 'absolute' as const,
    top: '3px',
    left: isOn ? '17px' : '3px',
    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
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
  state: (isOn: boolean) => ({
    fontSize: '11px',
    color: isOn ? '#10b981' : '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  }),
  compactCard: (isOn: boolean) => ({
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    background: isOn
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(10, 15, 30, 0.75) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    border: isOn ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
    borderRadius: '12px',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    userSelect: 'none' as const,
  }),
  compactLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden',
    flex: 1,
  },
  compactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  compactName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  compactState: (isOn: boolean) => ({
    fontSize: '11px',
    color: isOn ? '#10b981' : '#9ca3af',
    fontWeight: 500,
    marginTop: '1px',
  }),
};
