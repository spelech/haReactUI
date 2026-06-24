import React from 'react';
import { Icon } from '@mdi/react';
import { mdiLightbulb, mdiLightbulbOutline } from '@mdi/js';
import type { LightProps } from '../../converters/lightConverter';

interface LightCardProps {
  props: LightProps;
  onToggle: () => void;
  onChangeBrightness?: (brightness: number) => void;
  nameOverride?: string;
  iconOverride?: string;
}

export const LightCard: React.FC<LightCardProps> = ({
  props,
  onToggle,
  onChangeBrightness,
  nameOverride,
  iconOverride,
}) => {
  const { isOn, brightness, stateText, supportsBrightness } = props;
  const displayName = nameOverride || props.name;

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeBrightness) {
      onChangeBrightness(parseInt(e.target.value, 10));
    }
  };

  return (
    <div ref={cardRef} style={styles.card(isOn, isCompact)}>
      <div style={styles.header}>
        <div style={styles.iconContainer(isOn)} onClick={onToggle}>
          <Icon
            path={iconOverride || (isOn ? mdiLightbulb : mdiLightbulbOutline)}
            size={1.2}
            color={isOn ? '#fbbf24' : '#9ca3af'}
          />
        </div>
        <div style={styles.info} onClick={onToggle}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state(isOn)}>{stateText}</span>
        </div>
        <button style={styles.toggleBtn(isOn)} onClick={onToggle}>
          {isOn ? 'On' : 'Off'}
        </button>
      </div>

      {!isCompact && isOn && supportsBrightness && onChangeBrightness && (
        <div style={styles.sliderContainer}>
          <input
            type="range"
            min="1"
            max="100"
            value={brightness || 100}
            onChange={handleSliderChange}
            style={styles.slider}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  card: (isOn: boolean, isCompact: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: isCompact ? '12px' : '16px',
    boxSizing: 'border-box' as const,
    justifyContent: isCompact ? 'center' : 'space-between',
    background: isOn
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    boxShadow: isOn
      ? '0 8px 32px rgba(251, 191, 36, 0.08), inset 0 0 12px rgba(251, 191, 36, 0.05)'
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
    backgroundColor: isOn ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)',
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
    fontSize: '15px',
    fontWeight: 600,
    color: '#f3f4f6',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  state: (isOn: boolean) => ({
    fontSize: '12px',
    color: isOn ? '#fbbf24' : '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  }),
  toggleBtn: (isOn: boolean) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: isOn ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
    color: isOn ? '#0f172a' : '#e5e7eb',
    transition: 'all 0.2s',
    flexShrink: 0,
  }),
  sliderContainer: {
    marginTop: '12px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#374151',
    outline: 'none',
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
    accentColor: '#fbbf24',
  },
};
