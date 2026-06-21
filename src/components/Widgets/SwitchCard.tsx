import React from 'react';
import Icon from '@mdi/react';
import { mdiPower } from '@mdi/js';
import { SwitchProps } from '../../converters/switchConverter';

interface SwitchCardProps {
  props: SwitchProps;
  onToggle: () => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const SwitchCard: React.FC<SwitchCardProps> = ({
  props,
  onToggle,
  nameOverride,
  iconOverride,
}) => {
  const { isOn, stateText } = props;
  const displayName = nameOverride || props.name;

  return (
    <div style={styles.card(isOn)} onClick={onToggle}>
      <div style={styles.header}>
        <div style={styles.iconContainer(isOn)}>
          <Icon
            path={iconOverride || mdiPower}
            size={1.2}
            color={isOn ? '#3b82f6' : '#9ca3af'}
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(isOn)}>{stateText}</span>
        </div>
        <div style={styles.switchWrapper(isOn)}>
          <div style={styles.switchDot(isOn)} />
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
    padding: '16px',
    boxSizing: 'border-box' as const,
    justifyContent: 'center',
    background: isOn
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    boxShadow: isOn
      ? '0 8px 32px rgba(59, 130, 246, 0.08), inset 0 0 12px rgba(59, 130, 246, 0.05)'
      : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    userSelect: 'none' as const,
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
  },
  iconContainer: (isOn: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: isOn ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
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
    fontSize: '15px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  state: (isOn: boolean) => ({
    fontSize: '12px',
    color: isOn ? '#3b82f6' : '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  }),
  switchWrapper: (isOn: boolean) => ({
    width: '36px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: isOn ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
    position: 'relative' as const,
    transition: 'background-color 0.2s',
  }),
  switchDot: (isOn: boolean) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    position: 'absolute' as const,
    top: '3px',
    left: isOn ? '19px' : '3px',
    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
};
