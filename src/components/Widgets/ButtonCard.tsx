import React from 'react';
import Icon from '@mdi/react';
import { mdiGestureTap } from '@mdi/js';
import type { ButtonProps } from '../../converters/buttonConverter';

interface ButtonCardProps {
  props: ButtonProps;
  onPress: () => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const ButtonCard: React.FC<ButtonCardProps> = ({
  props,
  onPress,
  nameOverride,
  iconOverride,
}) => {
  const displayName = nameOverride || props.name;

  return (
    <div style={styles.card} onClick={onPress} role="button" aria-label={`Press ${displayName}`}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <Icon
            path={iconOverride || mdiGestureTap}
            size={1.2}
            color="#a1a1aa"
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.subtext}>Tap to execute</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    gap: '8px',
    width: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s',
  },
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
  subtext: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '2px',
  },
};
