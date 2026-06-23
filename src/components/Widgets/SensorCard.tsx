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

  return (
    <div style={styles.card}>
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
        <span style={styles.value}>{state}</span>
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
};
