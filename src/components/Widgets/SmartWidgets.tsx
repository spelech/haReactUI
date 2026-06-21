import React from 'react';
import { useEntity } from '../../hooks/useEntity';
import { callService } from '../../services/haConnection';
import { convertLight } from '../../converters/lightConverter';
import { convertSwitch } from '../../converters/switchConverter';
import { convertSensor } from '../../converters/sensorConverter';
import { convertMediaPlayer } from '../../converters/mediaPlayerConverter';
import { LightCard } from './LightCard';
import { SwitchCard } from './SwitchCard';
import { SensorCard } from './SensorCard';
import { MediaPlayerCard } from './MediaPlayerCard';

interface SmartWidgetProps {
  entityId: string;
  nameOverride?: string;
  iconOverride?: string;
}

const WidgetError: React.FC<{ entityId: string; type: string }> = ({ entityId, type }) => (
  <div style={styles.errorContainer}>
    <span style={styles.errorTitle}>Entity Error</span>
    <span style={styles.errorSub}>{entityId}</span>
    <span style={styles.errorSub}>({type} not found)</span>
  </div>
);

export const SmartLightCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Light" />;
  }

  const props = convertLight(entity);

  const handleToggle = () => {
    callService('light', 'toggle', undefined, { entity_id: entityId });
  };

  const handleChangeBrightness = (brightness: number) => {
    callService(
      'light',
      'turn_on',
      { brightness: Math.round((brightness / 100) * 255) },
      { entity_id: entityId }
    );
  };

  return (
    <LightCard
      props={props}
      onToggle={handleToggle}
      onChangeBrightness={handleChangeBrightness}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartSwitchCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Switch" />;
  }

  const props = convertSwitch(entity);

  const handleToggle = () => {
    callService('switch', 'toggle', undefined, { entity_id: entityId });
  };

  return (
    <SwitchCard
      props={props}
      onToggle={handleToggle}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartSensorCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Sensor" />;
  }

  const props = convertSensor(entity);

  return (
    <SensorCard
      props={props}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartMediaPlayerCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Media Player" />;
  }

  const props = convertMediaPlayer(entity);

  const handleToggle = () => {
    callService('media_player', 'toggle', undefined, { entity_id: entityId });
  };

  const handlePlay = () => {
    callService('media_player', 'media_play', undefined, { entity_id: entityId });
  };

  const handlePause = () => {
    callService('media_player', 'media_pause', undefined, { entity_id: entityId });
  };

  const handleNext = () => {
    callService('media_player', 'media_next_track', undefined, { entity_id: entityId });
  };

  const handlePrev = () => {
    callService('media_player', 'media_previous_track', undefined, { entity_id: entityId });
  };

  const handleChangeVolume = (volume: number) => {
    callService(
      'media_player',
      'volume_set',
      { volume_level: volume / 100 },
      { entity_id: entityId }
    );
  };

  return (
    <MediaPlayerCard
      props={props}
      onToggle={handleToggle}
      onPlay={handlePlay}
      onPause={handlePause}
      onNext={handleNext}
      onPrev={handlePrev}
      onChangeVolume={handleChangeVolume}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

const styles = {
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
    textAlign: 'center' as const,
    boxSizing: 'border-box' as const,
  },
  errorTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ef4444',
    marginBottom: '4px',
  },
  errorSub: {
    fontSize: '11px',
    color: '#9ca3af',
    wordBreak: 'break-all' as const,
  },
};
