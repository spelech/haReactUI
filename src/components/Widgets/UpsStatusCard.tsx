import React from 'react';
import { Icon } from '@mdi/react';
import { mdiBattery, mdiBatteryCharging, mdiFlash, mdiClockOutline, mdiAlertCircle } from '@mdi/js';
import { useEntity } from '../../hooks/useEntity';

interface UpsStatusCardProps {
  prefix: 'office' | 'server';
  nameOverride?: string;
  isDemo?: boolean;
}

export const UpsStatusCard: React.FC<UpsStatusCardProps> = ({
  prefix,
  nameOverride,
  isDemo = false,
}) => {
  // Grab real entities depending on the prefix
  const statusEntity = useEntity(prefix === 'office' ? 'sensor.office_ups_status' : 'sensor.server_ups_status');
  const batteryEntity = useEntity(prefix === 'office' ? 'sensor.office_ups_battery_capacity_raw' : 'sensor.server_ups_battery_charge');
  const loadEntity = useEntity(prefix === 'office' ? 'sensor.office_ups_load' : 'sensor.server_ups_load');
  const runtimeEntity = useEntity(prefix === 'office' ? 'sensor.office_ups_run_time_remaining' : 'sensor.server_ups_battery_runtime');

  const displayName = nameOverride || (prefix === 'office' ? 'Office UPS' : 'Server UPS');

  // Compute status and properties with demo fallbacks
  const rawStatus = isDemo || !statusEntity ? 'OL' : statusEntity.state;
  const isOnline = rawStatus.toLowerCase().includes('ol') || rawStatus.toLowerCase().includes('online');
  
  const battery = isDemo || !batteryEntity ? 100 : Math.round(parseFloat(batteryEntity.state));
  const load = isDemo || !loadEntity ? 14 : Math.round(parseFloat(loadEntity.state));
  
  let runtimeStr = '42m';
  if (!isDemo && runtimeEntity) {
    const val = parseFloat(runtimeEntity.state);
    if (!isNaN(val)) {
      // If runtime is returned in seconds (common for NUT integration), convert to minutes
      // Nutt runtime can be in minutes too, we'll check if the number is large
      if (val > 120) {
        runtimeStr = `${Math.round(val / 60)}m`;
      } else {
        runtimeStr = `${Math.round(val)}m`;
      }
    } else {
      runtimeStr = runtimeEntity.state;
    }
  }

  const getStatusLabel = () => {
    if (isOnline) return 'ONLINE';
    if (rawStatus.toLowerCase().includes('ob') || rawStatus.toLowerCase().includes('battery')) return 'ON BATTERY';
    return rawStatus.toUpperCase();
  };

  const getStatusColor = () => {
    if (isOnline) return '#10b981'; // Green
    return '#f59e0b'; // Amber (warning)
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer(isOnline)}>
            <Icon
              path={isOnline ? mdiBatteryCharging : mdiBattery}
              size={1.1}
              color={getStatusColor()}
            />
          </div>
          <div style={styles.titleInfo}>
            <span style={styles.name}>{displayName}</span>
            <span style={styles.statusText(getStatusColor())}>{getStatusLabel()}</span>
          </div>
        </div>
        {!isOnline && (
          <div style={styles.alertIcon}>
            <Icon path={mdiAlertCircle} size={0.8} color="#ef4444" />
          </div>
        )}
      </div>

      {/* Battery and Load Bars */}
      <div style={styles.metricsContainer}>
        {/* Battery Capacity */}
        <div style={styles.metricItem}>
          <div style={styles.metricLabelRow}>
            <span style={styles.metricLabel}>Battery Charge</span>
            <span style={styles.metricValue}>{battery}%</span>
          </div>
          <div style={styles.barBackground}>
            <div style={styles.batteryBarFill(battery)} />
          </div>
        </div>

        {/* System Load */}
        <div style={styles.metricItem}>
          <div style={styles.metricLabelRow}>
            <div style={styles.loadLabel}>
              <Icon path={mdiFlash} size={0.5} color="#9ca3af" />
              <span style={styles.metricLabel}>Load</span>
            </div>
            <span style={styles.metricValue}>{load}%</span>
          </div>
          <div style={styles.barBackground}>
            <div style={styles.loadBarFill(load)} />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={styles.footer}>
        <div style={styles.runtimeItem}>
          <Icon path={mdiClockOutline} size={0.6} color="#9ca3af" />
          <span style={styles.runtimeLabel}>Runtime Remaining:</span>
          <span style={styles.runtimeValue}>{runtimeStr}</span>
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
  iconContainer: (isOnline: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
  }),
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  statusText: (color: string) => ({
    fontSize: '10px',
    fontWeight: 700,
    color,
    letterSpacing: '0.5px',
    marginTop: '2px',
  }),
  alertIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    margin: '14px 0',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  metricLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#9ca3af',
  },
  metricValue: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#f3f4f6',
  },
  barBackground: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  batteryBarFill: (battery: number) => {
    let color = '#10b981'; // Green
    if (battery <= 20) color = '#ef4444'; // Red
    else if (battery <= 50) color = '#f59e0b'; // Amber

    return {
      height: '100%',
      width: `${battery}%`,
      backgroundColor: color,
      borderRadius: '3px',
      transition: 'width 0.4s ease',
    };
  },
  loadBarFill: (load: number) => {
    let color = '#3b82f6'; // Blue
    if (load >= 85) color = '#ef4444'; // Red
    else if (load >= 70) color = '#f59e0b'; // Amber

    return {
      height: '100%',
      width: `${load}%`,
      backgroundColor: color,
      borderRadius: '3px',
      transition: 'width 0.4s ease',
    };
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '10px',
  },
  runtimeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  runtimeLabel: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: 500,
  },
  runtimeValue: {
    fontSize: '11px',
    color: '#e5e7eb',
    fontWeight: 600,
  },
};
