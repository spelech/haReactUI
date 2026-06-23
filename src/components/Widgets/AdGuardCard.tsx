import React from 'react';
import { Icon } from '@mdi/react';
import { mdiShieldCheck, mdiShieldOff, mdiEarth, mdiBlockHelper, mdiPercent } from '@mdi/js';
import { useEntity } from '../../hooks/useEntity';
import { callService } from '../../services/haConnection';

interface AdGuardCardProps {
  entityId?: string; // Optional main protection switch entity ID
  nameOverride?: string;
  isDemo?: boolean;
}

export const AdGuardCard: React.FC<AdGuardCardProps> = ({
  entityId = 'switch.adguard_protection',
  nameOverride,
  isDemo = false,
}) => {
  // Try to load entities
  const protectionSwitch = useEntity(entityId);
  const dnsQueries = useEntity('sensor.adguard_dns_queries');
  const dnsBlocked = useEntity('sensor.adguard_dns_queries_blocked');
  const dnsBlockedPct = useEntity('sensor.adguard_dns_queries_blocked_percentage');

  const displayName = nameOverride || 'AdGuard Home';

  // Live vs Demo States
  const isEnabled = isDemo || !protectionSwitch ? true : protectionSwitch.state === 'on';
  const totalQueries = isDemo || !dnsQueries ? '12,854' : dnsQueries.state;
  const blockedQueries = isDemo || !dnsBlocked ? '1,921' : dnsBlocked.state;
  const blockedPercentage = isDemo || !dnsBlockedPct ? '14.9' : dnsBlockedPct.state;

  const handleToggle = () => {
    if (isDemo || !protectionSwitch) return; // Demo click
    callService('switch', 'toggle', undefined, { entity_id: entityId });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer(isEnabled)}>
            <Icon
              path={isEnabled ? mdiShieldCheck : mdiShieldOff}
              size={1.1}
              color={isEnabled ? '#10b981' : '#f59e0b'}
            />
          </div>
          <div style={styles.info}>
            <h3 style={styles.name}>{displayName}</h3>
            <span style={styles.statusText(isEnabled)}>
              {isEnabled ? 'PROTECTED' : 'PAUSED'}
            </span>
          </div>
        </div>
        <button
          style={styles.toggleBtn(isEnabled)}
          onClick={handleToggle}
        >
          {isEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <div style={styles.statHeader}>
            <Icon path={mdiEarth} size={0.7} color="#60a5fa" />
            <span style={styles.statLabel}>DNS Queries</span>
          </div>
          <span style={styles.statValue}>{totalQueries}</span>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statHeader}>
            <Icon path={mdiBlockHelper} size={0.7} color="#ef4444" />
            <span style={styles.statLabel}>Blocked</span>
          </div>
          <span style={styles.statValue}>{blockedQueries}</span>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statHeader}>
            <Icon path={mdiPercent} size={0.7} color="#f59e0b" />
            <span style={styles.statLabel}>Blocked %</span>
          </div>
          <span style={styles.statValue}>{blockedPercentage}%</span>
        </div>
      </div>

      <div style={styles.progressBarWrapper}>
        <div style={styles.progressBarBackground}>
          <div
            style={styles.progressBarFill(parseFloat(blockedPercentage) || 0)}
          />
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
  iconContainer: (enabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
  }),
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  name: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  statusText: (enabled: boolean) => ({
    fontSize: '10px',
    fontWeight: 700,
    color: enabled ? '#10b981' : '#f59e0b',
    letterSpacing: '0.5px',
    marginTop: '2px',
  }),
  toggleBtn: (enabled: boolean) => ({
    padding: '6px 12px',
    borderRadius: '8px',
    backgroundColor: enabled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    border: enabled ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
    color: enabled ? '#ef4444' : '#10b981',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s',
  }),
  statsContainer: {
    display: 'flex',
    gap: '8px',
    margin: '14px 0',
  },
  statBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#6b7280',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#ffffff',
  },
  progressBarWrapper: {
    width: '100%',
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
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  }),
};
