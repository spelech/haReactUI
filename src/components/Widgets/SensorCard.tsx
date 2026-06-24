import React from 'react';
import { Icon } from '@mdi/react';
import {
  mdiEyeOutline,
  mdiThermometer,
  mdiWaterPercent,
  mdiBattery,
  mdiFlash,
  mdiMotionSensor,
  mdiLock,
  mdiLockOpen,
} from '@mdi/js';
import type { SensorProps } from '../../converters/sensorConverter';

interface SensorCardProps {
  props: SensorProps;
  nameOverride?: string;
  iconOverride?: string;
}

const getIconForDeviceClass = (deviceClass?: string, state?: string) => {
  switch (deviceClass) {
    case 'temperature':
      return mdiThermometer;
    case 'humidity':
      return mdiWaterPercent;
    case 'battery':
      return mdiBattery;
    case 'power':
    case 'energy':
      return mdiFlash;
    case 'motion':
      return mdiMotionSensor;
    case 'lock':
      return state === 'locked' ? mdiLock : mdiLockOpen;
    default:
      return mdiEyeOutline;
  }
};

const getColorForDeviceClass = (deviceClass?: string, state?: string) => {
  if (deviceClass === 'motion' && state === 'on') {
    return '#ef4444'; // Red alert for motion
  }
  if (deviceClass === 'lock') {
    return state === 'locked' ? '#10b981' : '#f59e0b'; // Green for locked, Amber for unlocked
  }
  return '#10b981'; // Standard vibrant green
};

export const SensorCard: React.FC<SensorCardProps> = ({
  props,
  nameOverride,
  iconOverride,
}) => {
  const { state, unit, deviceClass } = props;
  const displayName = nameOverride || props.name;

  const defaultIcon = getIconForDeviceClass(deviceClass, state);
  const iconColor = getColorForDeviceClass(deviceClass, state);

  // Format binary sensor state if applicable
  const isBinarySensor = props.id.startsWith('binary_sensor.');
  let displayState = state;
  if (isBinarySensor) {
    if (state === 'on') {
      if (deviceClass === 'motion') displayState = 'Detected';
      else if (deviceClass === 'door' || deviceClass === 'window' || deviceClass === 'opening') displayState = 'Open';
      else if (deviceClass === 'smoke') displayState = 'Smoke';
      else if (deviceClass === 'co' || deviceClass === 'gas') displayState = 'Gas';
      else if (deviceClass === 'lock') displayState = 'Unlocked';
      else if (deviceClass === 'moisture') displayState = 'Wet';
      else if (deviceClass === 'battery') displayState = 'Low';
      else if (deviceClass === 'problem') displayState = 'Problem';
      else displayState = 'On';
    } else if (state === 'off') {
      if (deviceClass === 'motion') displayState = 'Clear';
      else if (deviceClass === 'door' || deviceClass === 'window' || deviceClass === 'opening') displayState = 'Closed';
      else if (deviceClass === 'smoke' || deviceClass === 'co' || deviceClass === 'gas') displayState = 'Clear';
      else if (deviceClass === 'lock') displayState = 'Locked';
      else if (deviceClass === 'moisture') displayState = 'Dry';
      else if (deviceClass === 'battery') displayState = 'Normal';
      else if (deviceClass === 'problem') displayState = 'OK';
      else displayState = 'Off';
    }
  }

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
      <div ref={cardRef} style={styles.compactCard}>
        <div style={styles.compactLeft}>
          <div style={styles.iconContainer(iconColor)}>
            <Icon
              path={iconOverride || defaultIcon}
              size={0.9}
              color={iconColor}
            />
          </div>
          <span style={styles.compactName}>{displayName}</span>
        </div>
        <div style={styles.compactRight}>
          <span style={styles.compactValue(isBinarySensor, state === 'on')}>{displayState}</span>
          {unit && <span style={styles.compactUnit}>{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} style={styles.card}>
      <div style={styles.header}>
        <div style={styles.iconContainer(iconColor)}>
          <Icon
            path={iconOverride || defaultIcon}
            size={1.1}
            color={iconColor}
          />
        </div>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
        </div>
      </div>
      <div style={styles.body}>
        <span style={styles.value}>{displayState}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
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
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
  },
  iconContainer: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: `${color}1A`, // 10% opacity
    transition: 'background-color 0.2s',
    flexShrink: 0,
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
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  body: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginTop: '12px',
  },
  value: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#f3f4f6',
    letterSpacing: '-0.5px',
  },
  unit: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
  },
  compactCard: {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none' as const,
  },
  compactLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden',
    flex: 1,
  },
  compactName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  compactRight: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
    marginLeft: '8px',
    flexShrink: 0,
  },
  compactValue: (isBinary: boolean, isOn: boolean) => ({
    fontSize: '15px',
    fontWeight: 700,
    color: isBinary ? (isOn ? '#ef4444' : '#10b981') : '#f3f4f6',
  }),
  compactUnit: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#6b7280',
  },
};
