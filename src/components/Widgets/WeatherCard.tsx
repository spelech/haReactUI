import React from 'react';
import { Icon } from '@mdi/react';
import {
  mdiWeatherSunny,
  mdiWeatherCloudy,
  mdiWeatherRainy,
  mdiWeatherWindy,
  mdiWeatherSnowy,
  mdiWeatherLightning,
  mdiWeatherPouring,
  mdiWaterPercent,
  mdiGauge,
} from '@mdi/js';

interface ForecastDay {
  datetime: string;
  temperature: number;
  templow?: number;
  condition: string;
  precipitation?: number;
}

interface WeatherProps {
  id: string;
  name: string;
  state: string;
  temperature: number;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  forecast?: ForecastDay[];
  stateText: string;
}

interface WeatherCardProps {
  props: WeatherProps;
  nameOverride?: string;
}

const getConditionIcon = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
    case 'clear-night':
      return mdiWeatherSunny;
    case 'cloudy':
    case 'partlycloudy':
      return mdiWeatherCloudy;
    case 'rainy':
      return mdiWeatherRainy;
    case 'pouring':
    case 'heavy-rain':
      return mdiWeatherPouring;
    case 'windy':
    case 'windy-variant':
      return mdiWeatherWindy;
    case 'snowy':
    case 'snowy-rainy':
      return mdiWeatherSnowy;
    case 'lightning':
    case 'lightning-rainy':
      return mdiWeatherLightning;
    default:
      return mdiWeatherCloudy;
  }
};

const getConditionColor = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return '#fbbf24'; // Amber
    case 'cloudy':
    case 'partlycloudy':
      return '#9ca3af'; // Gray
    case 'rainy':
    case 'pouring':
      return '#60a5fa'; // Blue
    case 'lightning':
      return '#f59e0b'; // Dark amber
    default:
      return '#9ca3af';
  }
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ props, nameOverride }) => {
  const { state, temperature, humidity, windSpeed, pressure, forecast } = props;
  const displayName = nameOverride || props.name;

  const currentIcon = getConditionIcon(state);
  const currentColor = getConditionColor(state);

  const formatDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString([], { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.info}>
          <h3 style={styles.name}>{displayName}</h3>
          <span style={styles.conditionText}>{state.toUpperCase()}</span>
        </div>
        <div style={styles.tempSection}>
          <Icon path={currentIcon} size={1.8} color={currentColor} />
          <span style={styles.tempValue}>{Math.round(temperature)}°</span>
        </div>
      </div>

      <div style={styles.statsRow}>
        {humidity !== undefined && (
          <div style={styles.stat}>
            <Icon path={mdiWaterPercent} size={0.7} color="#60a5fa" />
            <span>{humidity}% Hum</span>
          </div>
        )}
        {windSpeed !== undefined && (
          <div style={styles.stat}>
            <Icon path={mdiWeatherWindy} size={0.7} color="#9ca3af" />
            <span>{Math.round(windSpeed)} mph</span>
          </div>
        )}
        {pressure !== undefined && (
          <div style={styles.stat}>
            <Icon path={mdiGauge} size={0.7} color="#34d399" />
            <span>{Math.round(pressure)} hPa</span>
          </div>
        )}
      </div>

      {forecast && forecast.length > 0 && (
        <div style={styles.forecastContainer}>
          {forecast.slice(0, 5).map((day, idx) => {
            const icon = getConditionIcon(day.condition);
            const color = getConditionColor(day.condition);
            return (
              <div key={idx} style={styles.forecastDay}>
                <span style={styles.forecastDayName}>{formatDay(day.datetime)}</span>
                <Icon path={icon} size={0.9} color={color} />
                <div style={styles.forecastTemps}>
                  <span style={styles.forecastHigh}>{Math.round(day.temperature)}°</span>
                  {day.templow !== undefined && (
                    <span style={styles.forecastLow}>{Math.round(day.templow)}°</span>
                  )}
                </div>
              </div>
            );
          })}
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
    padding: '12px',
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
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  name: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#9ca3af',
  },
  conditionText: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '1px',
    marginTop: '2px',
  },
  tempSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tempValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#ffffff',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    margin: '6px 0',
    padding: '4px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: 500,
  },
  forecastContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '4px',
  },
  forecastDay: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  },
  forecastDayName: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#6b7280',
  },
  forecastTemps: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1px',
  },
  forecastHigh: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#f3f4f6',
  },
  forecastLow: {
    fontSize: '9px',
    fontWeight: 500,
    color: '#6b7280',
  },
};
