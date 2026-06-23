import React from 'react';
import { Icon } from '@mdi/react';
import { mdiPrinter3d, mdiClockOutline, mdiThermometer, mdiPower, mdiFileDocumentOutline } from '@mdi/js';
import { useEntity } from '../../hooks/useEntity';
import { callService } from '../../services/haConnection';

interface OctoPrinterCardProps {
  nameOverride?: string;
  isDemo?: boolean;
}

export const OctoPrinterCard: React.FC<OctoPrinterCardProps> = ({
  nameOverride,
  isDemo = false,
}) => {
  // Grab real entities
  const progressSensor = useEntity('sensor.octoprint_print_progress');
  const timeLeftSensor = useEntity('sensor.octoprint_print_time_left');
  const printFileSensor = useEntity('sensor.octoprint_print_file');
  const hotendTempSensor = useEntity('sensor.octoprint_tool_0_temperature');
  const bedTempSensor = useEntity('sensor.octoprint_bed_temperature');
  const powerSwitch = useEntity('switch.3d_printer');

  const displayName = nameOverride || 'Prusa MK3s';

  // State calculations with demo fallbacks
  const powerOn = isDemo || !powerSwitch ? true : powerSwitch.state === 'on';
  const progress = isDemo || !progressSensor ? 42 : Math.round(parseFloat(progressSensor.state));
  const file = isDemo || !printFileSensor ? '3dbenchy_0.2mm.gcode' : printFileSensor.state;
  const hotendTemp = isDemo || !hotendTempSensor ? 215 : Math.round(parseFloat(hotendTempSensor.state));
  const bedTemp = isDemo || !bedTempSensor ? 60 : Math.round(parseFloat(bedTempSensor.state));
  
  // Format remaining time
  let timeStr = '1h 12m';
  if (!isDemo && timeLeftSensor) {
    const totalSecs = parseInt(timeLeftSensor.state, 10);
    if (!isNaN(totalSecs)) {
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    } else {
      timeStr = timeLeftSensor.state;
    }
  }

  const handlePowerToggle = () => {
    if (isDemo || !powerSwitch) return;
    callService('switch', 'toggle', undefined, { entity_id: 'switch.3d_printer' });
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer(powerOn)}>
            <Icon path={mdiPrinter3d} size={1.1} color={powerOn ? '#a78bfa' : '#6b7280'} />
          </div>
          <div style={styles.titleInfo}>
            <span style={styles.name}>{displayName}</span>
            <span style={styles.statusText(powerOn)}>
              {powerOn ? 'PRINTING' : 'POWER OFF'}
            </span>
          </div>
        </div>
        <button
          style={styles.powerBtn(powerOn)}
          onClick={handlePowerToggle}
        >
          <Icon path={mdiPower} size={0.7} color={powerOn ? '#ef4444' : '#10b981'} />
        </button>
      </div>

      {powerOn && (
        <>
          {/* File details */}
          <div style={styles.fileContainer}>
            <Icon path={mdiFileDocumentOutline} size={0.6} color="#9ca3af" />
            <span style={styles.fileName} title={file}>{file}</span>
          </div>

          {/* Temperature sensors */}
          <div style={styles.tempRow}>
            <div style={styles.tempItem}>
              <Icon path={mdiThermometer} size={0.6} color="#f87171" />
              <span style={styles.tempLabel}>Hotend:</span>
              <span style={styles.tempValue}>{hotendTemp}°C</span>
            </div>
            <div style={styles.tempItem}>
              <Icon path={mdiThermometer} size={0.6} color="#ffb03a" />
              <span style={styles.tempLabel}>Bed:</span>
              <span style={styles.tempValue}>{bedTemp}°C</span>
            </div>
          </div>

          {/* Progress bar and time left */}
          <div style={styles.progressSection}>
            <div style={styles.progressInfo}>
              <span style={styles.progressText}>Progress: {progress}%</span>
              <div style={styles.timeLeft}>
                <Icon path={mdiClockOutline} size={0.6} color="#60a5fa" />
                <span>{timeStr} left</span>
              </div>
            </div>
            <div style={styles.progressBarBackground}>
              <div style={styles.progressBarFill(progress)} />
            </div>
          </div>
        </>
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
    overflow: 'hidden',
  },
  iconContainer: (powerOn: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: powerOn ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255, 255, 255, 0.02)',
    border: powerOn ? '1px solid rgba(167, 139, 250, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
  }),
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e5e7eb',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusText: (powerOn: boolean) => ({
    fontSize: '10px',
    fontWeight: 700,
    color: powerOn ? '#a78bfa' : '#6b7280',
    letterSpacing: '0.5px',
    marginTop: '2px',
  }),
  powerBtn: (powerOn: boolean) => ({
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: powerOn ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    border: powerOn ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
  }),
  fileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  fileName: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  tempRow: {
    display: 'flex',
    gap: '12px',
    margin: '10px 0',
  },
  tempItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    padding: '6px 8px',
    borderRadius: '8px',
  },
  tempLabel: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#6b7280',
  },
  tempValue: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#f3f4f6',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#9ca3af',
  },
  timeLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#60a5fa',
    fontWeight: 600,
  },
  progressBarBackground: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: (percentage: number) => ({
    height: '100%',
    width: `${Math.min(100, Math.max(0, percentage))}%`,
    backgroundColor: '#a78bfa',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  }),
};
