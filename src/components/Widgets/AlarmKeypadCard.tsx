import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiShieldLock, mdiShieldOff, mdiDelete } from '@mdi/js';
import type { AlarmProps } from '../../converters/alarmConverter';

interface AlarmKeypadCardProps {
  props: AlarmProps;
  onArmHome: (code: string) => void;
  onArmAway: (code: string) => void;
  onDisarm: (code: string) => void;
  nameOverride?: string;
}

export const AlarmKeypadCard: React.FC<AlarmKeypadCardProps> = ({
  props,
  onArmHome,
  onArmAway,
  onDisarm,
  nameOverride,
}) => {
  const { state, stateText, codeRequired } = props;
  const displayName = nameOverride || props.name;

  const [pin, setPin] = useState('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      setPin(pin + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleAction = (actionType: 'arm_home' | 'arm_away' | 'disarm') => {
    if (actionType === 'arm_home') {
      onArmHome(pin);
    } else if (actionType === 'arm_away') {
      onArmAway(pin);
    } else if (actionType === 'disarm') {
      onDisarm(pin);
    }
    setPin('');
  };

  const isTriggered = state === 'triggered';
  const isArmed = state.startsWith('armed');

  return (
    <div style={styles.card(isTriggered)} role="region" aria-label={`Alarm keypad for ${displayName}`}>
      <div style={styles.header}>
        <div style={styles.iconContainer(isTriggered || isArmed)}>
          <Icon
            path={isArmed ? mdiShieldLock : mdiShieldOff}
            size={1.2}
            color={isTriggered ? '#ef4444' : isArmed ? '#fbbf24' : '#10b981'}
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(isTriggered, isArmed)}>{stateText}</span>
        </div>
      </div>

      {codeRequired && (
        <div style={styles.pinDisplay}>
          {pin ? '•'.repeat(pin.length) : <span style={styles.placeholder}>Enter PIN</span>}
        </div>
      )}

      {codeRequired && (
        <div style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button key={num} onClick={() => handleKeyPress(num)} style={styles.keyBtn}>
              {num}
            </button>
          ))}
          <button onClick={handleClear} style={styles.keyBtn} title="Clear PIN" aria-label="Clear PIN">
            <Icon path={mdiDelete} size={0.7} color="#ef4444" />
          </button>
          <button onClick={() => handleKeyPress('0')} style={styles.keyBtn}>
            0
          </button>
          <div style={styles.emptySpacer} />
        </div>
      )}

      <div style={styles.actions}>
        {!isArmed && (
          <>
            <button onClick={() => handleAction('arm_home')} style={styles.actionBtn('#fbbf24')}>
              Arm Home
            </button>
            <button onClick={() => handleAction('arm_away')} style={styles.actionBtn('#f59e0b')}>
              Arm Away
            </button>
          </>
        )}
        {isArmed && (
          <button onClick={() => handleAction('disarm')} style={styles.actionBtn('#10b981')}>
            Disarm System
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: (isTriggered: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '16px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    background: isTriggered
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(10, 15, 30, 0.75) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    border: isTriggered ? '2px solid #ef4444' : '1px solid transparent',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    userSelect: 'none' as const,
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
  },
  iconContainer: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: active ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
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
  state: (isTriggered: boolean, isArmed: boolean) => ({
    fontSize: '12px',
    color: isTriggered ? '#ef4444' : isArmed ? '#fbbf24' : '#10b981',
    fontWeight: 500,
    marginTop: '2px',
  }),
  pinDisplay: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#0c0f17',
    border: '1px solid #1f2937',
    textAlign: 'center' as const,
    fontSize: '20px',
    height: '40px',
    lineHeight: '24px',
    letterSpacing: '4px',
    color: '#ffffff',
    margin: '12px 0',
    boxSizing: 'border-box' as const,
  },
  placeholder: {
    fontSize: '13px',
    color: '#4b5563',
    letterSpacing: 'normal',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    margin: '8px 0',
    width: '100%',
  },
  keyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.1s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    ':active': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  emptySpacer: {
    height: '36px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    marginTop: '12px',
  },
  actionBtn: (color: string) => ({
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: `${color}1A`,
    border: `1px solid ${color}4D`,
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
  }),
};
