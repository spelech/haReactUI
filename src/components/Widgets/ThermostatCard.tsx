import React from 'react';
import { Icon } from '@mdi/react';
import { mdiMinus, mdiPlus, mdiThermostat } from '@mdi/js';
import type { ClimateProps } from '../../converters/climateConverter';

interface ThermostatCardProps {
  props: ClimateProps;
  onChangeTargetTemp: (temp: number) => void;
  onChangeMode: (mode: string) => void;
  nameOverride?: string;
}

export const ThermostatCard: React.FC<ThermostatCardProps> = ({
  props,
  onChangeTargetTemp,
  onChangeMode,
  nameOverride,
}) => {
  const { state, currentTemperature, targetTemperature, minTemp, maxTemp, hvacModes, stateText } = props;
  const displayName = nameOverride || props.name;

  const handleIncrement = () => {
    if (targetTemperature < maxTemp) {
      onChangeTargetTemp(parseFloat((targetTemperature + 0.5).toFixed(1)));
    }
  };

  const handleDecrement = () => {
    if (targetTemperature > minTemp) {
      onChangeTargetTemp(parseFloat((targetTemperature - 0.5).toFixed(1)));
    }
  };

  const isOff = state === 'off';
  const isHeating = state === 'heat';
  const isCooling = state === 'cool';

  const getAccentColor = () => {
    if (isHeating) return '#ef4444'; // Red
    if (isCooling) return '#3b82f6'; // Blue
    return '#9ca3af'; // Gray
  };

  return (
    <div style={styles.card(state)} role="region" aria-label={`Thermostat for ${displayName}`}>
      <div style={styles.header}>
        <div style={styles.iconContainer(state)}>
          <Icon
            path={mdiThermostat}
            size={1.1}
            color={getAccentColor()}
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(state)}>{stateText}</span>
        </div>
      </div>

      <div style={styles.dialContainer}>
        <button
          onClick={handleDecrement}
          style={styles.dialBtn}
          disabled={isOff}
          aria-label="Decrease temperature"
        >
          <Icon path={mdiMinus} size={0.8} color={isOff ? '#4b5563' : '#ffffff'} />
        </button>

        <div style={styles.tempDisplay}>
          <span style={styles.targetTemp(state)}>
            {isOff ? '--' : `${targetTemperature}°`}
          </span>
          <span style={styles.currentTemp}>
            Current: {currentTemperature}°C
          </span>
        </div>

        <button
          onClick={handleIncrement}
          style={styles.dialBtn}
          disabled={isOff}
          aria-label="Increase temperature"
        >
          <Icon path={mdiPlus} size={0.8} color={isOff ? '#4b5563' : '#ffffff'} />
        </button>
      </div>

      <div style={styles.modesRow}>
        {hvacModes.map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeMode(mode)}
            style={styles.modeBtn(mode === state, mode)}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: (state: string) => {
    let background = 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)';
    let border = '1px solid transparent';
    
    if (state === 'heat') {
      background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(10, 15, 30, 0.75) 100%)';
      border = '1px solid rgba(239, 68, 68, 0.2)';
    } else if (state === 'cool') {
      background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(10, 15, 30, 0.75) 100%)';
      border = '1px solid rgba(59, 130, 246, 0.2)';
    }

    return {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      padding: '12px',
      boxSizing: 'border-box' as const,
      justifyContent: 'space-between',
      background,
      border,
      borderRadius: '16px',
      transition: 'all 0.25s ease',
      userSelect: 'none' as const,
    };
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '10px',
  },
  iconContainer: (state: string) => {
    let backgroundColor = 'rgba(255, 255, 255, 0.05)';
    if (state === 'heat') backgroundColor = 'rgba(239, 68, 68, 0.15)';
    else if (state === 'cool') backgroundColor = 'rgba(59, 130, 246, 0.15)';

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor,
      transition: 'background-color 0.2s',
    };
  },
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
  state: (state: string) => {
    let color = '#9ca3af';
    if (state === 'heat') color = '#ef4444';
    else if (state === 'cool') color = '#3b82f6';

    return {
      fontSize: '11px',
      color,
      fontWeight: 500,
      marginTop: '2px',
    };
  },
  dialContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    margin: '12px 0',
  },
  dialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  tempDisplay: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80px',
  },
  targetTemp: (state: string) => {
    let color = '#ffffff';
    if (state === 'heat') color = '#ef4444';
    else if (state === 'cool') color = '#3b82f6';
    else if (state === 'off') color = '#4b5563';

    return {
      fontSize: '32px',
      fontWeight: 700,
      color,
      lineHeight: 1,
    };
  },
  currentTemp: {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  modesRow: {
    display: 'flex',
    gap: '6px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '4px',
  },
  modeBtn: (isActive: boolean, mode: string) => {
    let activeBg = 'rgba(255, 255, 255, 0.1)';
    let activeBorder = '1px solid rgba(255, 255, 255, 0.2)';
    let activeColor = '#ffffff';

    if (isActive) {
      if (mode === 'heat') {
        activeBg = 'rgba(239, 68, 68, 0.2)';
        activeBorder = '1px solid #ef4444';
        activeColor = '#ef4444';
      } else if (mode === 'cool') {
        activeBg = 'rgba(59, 130, 246, 0.2)';
        activeBorder = '1px solid #3b82f6';
        activeColor = '#3b82f6';
      } else {
        activeBg = 'rgba(156, 163, 175, 0.2)';
        activeBorder = '1px solid #9ca3af';
        activeColor = '#9ca3af';
      }
    }

    return {
      flex: 1,
      padding: '6px 8px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: 700,
      border: isActive ? activeBorder : '1px solid transparent',
      backgroundColor: isActive ? activeBg : 'rgba(255, 255, 255, 0.02)',
      color: isActive ? activeColor : '#6b7280',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.2s',
    };
  },
};
