import React, { useState, useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiChartLine } from '@mdi/js';
import { useEntity } from '../../hooks/useEntity';
import { getConnection } from '../../services/haConnection';

interface HistoryPoint {
  time: Date;
  value: number;
}

interface HistoryGraphCardProps {
  entityId: string;
  nameOverride?: string;
  color?: string;
  isDemo?: boolean;
}

export const HistoryGraphCard: React.FC<HistoryGraphCardProps> = ({
  entityId,
  nameOverride,
  color = '#10b981',
  isDemo = false,
}) => {
  const entity = useEntity(entityId);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = nameOverride || (entity?.attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const currentState = entity ? parseFloat(entity.state) : 21.5;
  const unit = entity?.attributes?.unit_of_measurement || '°C';

  // Fetch or generate history
  useEffect(() => {
    if (isDemo || !entity) {
      // Generate simulated history
      const points: HistoryPoint[] = [];
      const now = Date.now();
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000);
        // Generate a smooth temperature-like curve with some noise
        const base = 20 + Math.sin(i / 3) * 2;
        const noise = Math.random() * 0.5 - 0.25;
        points.push({ time, value: base + noise });
      }
      setHistory(points);
      setLoading(false);
      return;
    }

    const loadRealHistory = async () => {
      try {
        setLoading(true);
        const conn = getConnection();
        const startTime = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(); // 12 hours ago
        
        const response: any = await conn.sendMessagePromise({
          type: 'history/history_during_period',
          start_time: startTime,
          entity_ids: [entityId],
        });

        const entityHistory = response[entityId] || [];
        const parsedPoints: HistoryPoint[] = entityHistory
          .map((item: any) => {
            const val = parseFloat(item.state || item.s);
            return {
              time: new Date((item.last_changed || item.lc || item.lu) * 1000),
              value: isNaN(val) ? null : val,
            };
          })
          .filter((pt: any) => pt.value !== null);

        if (parsedPoints.length > 0) {
          setHistory(parsedPoints);
        } else {
          // If no history returned, prefill with current value
          setHistory([{ time: new Date(), value: currentState }]);
        }
      } catch (err) {
        console.error('Failed to fetch history for', entityId, err);
        // Fallback to a single point matching current state
        setHistory([{ time: new Date(), value: currentState }]);
      } finally {
        setLoading(false);
      }
    };

    loadRealHistory();
  }, [entityId, isDemo, entity, currentState]);

  // If a new state update comes in, append it to history if it's different from the last point
  useEffect(() => {
    if (isDemo || !entity || isNaN(currentState)) return;

    setHistory((prev) => {
      if (prev.length === 0) return [{ time: new Date(), value: currentState }];
      const lastPoint = prev[prev.length - 1];
      if (Math.abs(lastPoint.value - currentState) < 0.05) return prev; // Avoid duplicate points
      
      const updated = [...prev, { time: new Date(), value: currentState }];
      // Keep last 50 points
      if (updated.length > 50) {
        return updated.slice(updated.length - 50);
      }
      return updated;
    });
  }, [currentState, entity, isDemo]);

  // Render SVG Sparkline
  const renderSparkline = () => {
    if (history.length < 2) return null;

    const values = history.map((h) => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Expand bounds slightly for padding
    const boundsMin = min - range * 0.1;
    const boundsMax = max + range * 0.1;
    const boundsRange = boundsMax - boundsMin;

    const width = 300;
    const height = 80;
    const padding = 5;

    const points = history.map((pt, index) => {
      const x = padding + (index / (history.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((pt.value - boundsMin) / boundsRange) * (height - 2 * padding);
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;
    // Gradient fill path data
    const fillPathData = `${pathData} L ${width - padding},${height} L ${padding},${height} Z`;

    return (
      <div style={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
          <defs>
            <linearGradient id={`grad-${entityId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Gradient area */}
          <path d={fillPathData} fill={`url(#grad-${entityId})`} />
          {/* Sparkline path */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hotspot circle for the last point */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].split(',')[0]}
              cy={points[points.length - 1].split(',')[1]}
              r="4"
              fill={color}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer(color)}>
            <Icon path={mdiChartLine} size={1.0} color={color} />
          </div>
          <span style={styles.name}>{displayName}</span>
        </div>
        <div style={styles.stateContainer}>
          <span style={styles.value}>{loading ? '...' : currentState}</span>
          <span style={styles.unit}>{unit}</span>
        </div>
      </div>
      
      <div style={styles.chartContainer}>
        {loading ? (
          <div style={styles.loadingSpinner}>Loading History...</div>
        ) : (
          renderSparkline()
        )}
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
    marginBottom: '8px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden',
  },
  iconContainer: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: `${color}1A`,
  }),
  name: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stateContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  value: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
  },
  unit: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#6b7280',
  },
  chartContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: '60px',
    marginTop: '12px',
  },
  chartWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  svg: {
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  loadingSpinner: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: 500,
    alignSelf: 'center',
  },
};
