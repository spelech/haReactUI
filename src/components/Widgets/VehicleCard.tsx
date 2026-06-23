import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiCar, mdiGasStation, mdiLock, mdiLockOpen, mdiEngine, mdiEngineOutline, mdiCounter } from '@mdi/js';
import { useEntity } from '../../hooks/useEntity';
import { callService } from '../../services/haConnection';

interface VehicleCardProps {
  nameOverride?: string;
  isDemo?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  nameOverride,
  isDemo = false,
}) => {
  // Grab real entities
  const fuelSensor = useEntity('sensor.fuel_level_es300h');
  const rangeSensor = useEntity('sensor.distance_to_empty_es300h');
  const odometerSensor = useEntity('sensor.odometer_es300h');
  const lockEntity = useEntity('lock.es300h');
  const remoteStartSensor = useEntity('binary_sensor.remote_start_es300h');

  const displayName = nameOverride || 'Lexus ES300h';

  // State calculations (demo fallbacks)
  const fuel = isDemo || !fuelSensor ? 68 : parseInt(fuelSensor.state, 10);
  const range = isDemo || !rangeSensor ? 342 : parseInt(rangeSensor.state, 10);
  const odometer = isDemo || !odometerSensor ? '48,251' : parseInt(odometerSensor.state, 10).toLocaleString();
  const isLocked = isDemo || !lockEntity ? true : lockEntity.state === 'locked';
  const isRunning = isDemo || !remoteStartSensor ? false : remoteStartSensor.state === 'on';

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number>(300);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCardHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const showActions = cardHeight > 190;

  const handleLockToggle = async () => {
    if (isDemo || !lockEntity) return;
    setLoadingAction('lock');
    try {
      const service = isLocked ? 'unlock' : 'lock';
      await callService('lock', service, undefined, { entity_id: 'lock.es300h' });
    } catch (e) {
      console.error('Lock service failed:', e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoteStart = async () => {
    if (isDemo) return;
    setLoadingAction('start');
    try {
      // Execute the custom Toyota remote start script
      await callService('script', '1751834559829');
    } catch (e) {
      console.error('Remote start script failed:', e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div ref={containerRef} style={styles.card}>
      {/* Title Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <Icon path={mdiCar} size={1.2} color="#60a5fa" />
          </div>
          <div style={styles.titleInfo}>
            <span style={styles.name}>{displayName}</span>
            {isDemo && <span style={styles.demoBadge}>Demo Mode</span>}
          </div>
        </div>
        <div style={styles.lockButtonContainer}>
          <button
            style={styles.lockBtn(isLocked)}
            onClick={handleLockToggle}
            disabled={loadingAction !== null}
          >
            <Icon path={isLocked ? mdiLock : mdiLockOpen} size={0.8} color="#ffffff" />
            <span style={styles.btnText}>{isLocked ? 'Locked' : 'Unlocked'}</span>
          </button>
        </div>
      </div>

      {/* Main stats layout */}
      <div style={styles.mainStats}>
        <div style={styles.fuelGaugeContainer}>
          <div style={styles.circularProgress(fuel)}>
            <div style={styles.circularInner}>
              <Icon path={mdiGasStation} size={0.9} color="#fbbf24" />
              <span style={styles.fuelPct}>{fuel}%</span>
              <span style={styles.fuelLabel}>Fuel</span>
            </div>
          </div>
        </div>
        <div style={styles.detailStats}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Range</span>
            <span style={styles.detailValue}>{range} mi</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Odometer</span>
            <div style={styles.odometerContainer}>
              <Icon path={mdiCounter} size={0.6} color="#9ca3af" />
              <span style={styles.detailValue}>{odometer} mi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      {showActions && (
        <div style={styles.actions}>
          <button
            style={styles.startBtn(isRunning)}
            onClick={handleRemoteStart}
            disabled={loadingAction !== null}
          >
            <Icon
              path={isRunning ? mdiEngine : mdiEngineOutline}
              size={0.9}
              color={isRunning ? '#ef4444' : '#60a5fa'}
            />
            <span>{isRunning ? 'Stop Engine' : 'Remote Start'}</span>
          </button>
        </div>
      )}
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
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    justifyContent: 'space-between',
    userSelect: 'none' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  demoBadge: {
    fontSize: '10px',
    color: '#3b82f6',
    fontWeight: 600,
  },
  lockButtonContainer: {},
  lockBtn: (isLocked: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '10px',
    backgroundColor: isLocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
    border: isLocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
    color: isLocked ? '#10b981' : '#f59e0b',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s',
  }),
  btnText: {
    fontSize: '12px',
    fontWeight: 600,
  },
  mainStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '16px 0',
    gap: '20px',
  },
  fuelGaugeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgress: (percentage: number) => {
    const angle = (percentage / 100) * 360;
    return {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      background: `conic-gradient(#fbbf24 0deg, #fbbf24 ${angle}deg, rgba(255, 255, 255, 0.05) ${angle}deg, rgba(255, 255, 255, 0.05) 360deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  circularInner: {
    width: '78px',
    height: '78px',
    borderRadius: '50%',
    backgroundColor: '#111827',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuelPct: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
    marginTop: '2px',
  },
  fuelLabel: {
    fontSize: '9px',
    color: '#6b7280',
    fontWeight: 600,
  },
  detailStats: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  detailLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
  },
  odometerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actions: {
    width: '100%',
  },
  startBtn: (isRunning: boolean) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: isRunning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(96, 165, 250, 0.08)',
    border: isRunning ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(96, 165, 250, 0.15)',
    color: isRunning ? '#ef4444' : '#60a5fa',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s',
  }),
};
