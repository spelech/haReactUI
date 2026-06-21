import React, { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import type { NumberProps } from '../../converters/numberConverter';

interface SliderCardProps {
  props: NumberProps;
  onChange: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
  nameOverride?: string;
  iconOverride?: string;
}

export const SliderCard: React.FC<SliderCardProps> = ({
  props,
  onChange,
  orientation = 'horizontal',
  nameOverride,
  iconOverride,
}) => {
  const { value, min, max, step, stateText } = props;
  const displayName = nameOverride || props.name;

  // Local state to allow smooth slider dragging before firing HA events
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
  };

  const handleSliderRelease = () => {
    onChange(localValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, localValue + step);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, localValue - step);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const isVertical = orientation === 'vertical';

  return (
    <div style={isVertical ? styles.verticalCard : styles.horizontalCard}>
      <div style={styles.header(isVertical)}>
        {iconOverride && (
          <div style={styles.iconContainer}>
            <Icon path={iconOverride} size={1.0} color="#a1a1aa" />
          </div>
        )}
        <div style={isVertical ? styles.verticalInfo : styles.horizontalInfo}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.state}>{stateText}</span>
        </div>
      </div>

      <div style={isVertical ? styles.verticalSliderContainer : styles.horizontalSliderContainer}>
        {!isVertical && (
          <button 
            style={styles.stepButton} 
            onClick={handleDecrement}
            aria-label="Decrease value"
          >
            <Icon path={mdiMinus} size={0.7} color="#9ca3af" />
          </button>
        )}

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          style={isVertical ? styles.verticalSlider : styles.horizontalSlider}
          aria-label={`${displayName} slider`}
        />

        {!isVertical && (
          <button 
            style={styles.stepButton} 
            onClick={handleIncrement}
            aria-label="Increase value"
          >
            <Icon path={mdiPlus} size={0.7} color="#9ca3af" />
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  horizontalCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    userSelect: 'none' as const,
  },
  verticalCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '12px',
    boxSizing: 'border-box' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(10, 15, 30, 0.75) 100%)',
    userSelect: 'none' as const,
  },
  header: (isVertical: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '8px',
    flexDirection: isVertical ? ('column' as const) : ('row' as const),
    textAlign: isVertical ? ('center' as const) : ('left' as const),
  }),
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  horizontalInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  verticalInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '100%',
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
    width: '100%',
  },
  state: {
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: 500,
    marginTop: '2px',
  },
  horizontalSliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  verticalSliderContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: '12px',
    marginBottom: '8px',
  },
  stepButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  horizontalSlider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#374151',
    outline: 'none',
    cursor: 'pointer',
    accentColor: '#3b82f6',
  },
  // To render vertical range properly in vanilla CSS
  verticalSlider: {
    writingMode: 'bt-lr' as any, // fallback
    WebkitAppearance: 'slider-vertical' as any,
    width: '8px',
    height: '100%',
    minHeight: '100px',
    borderRadius: '4px',
    backgroundColor: '#374151',
    outline: 'none',
    cursor: 'pointer',
    accentColor: '#3b82f6',
    margin: '0 auto',
  },
};
