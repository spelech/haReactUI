import React from 'react';
import { useEntity } from '../../hooks/useEntity';
import { callService } from '../../services/haConnection';
import { convertLight } from '../../converters/lightConverter';
import { convertSwitch } from '../../converters/switchConverter';
import { convertSensor } from '../../converters/sensorConverter';
import { convertMediaPlayer } from '../../converters/mediaPlayerConverter';
import { convertButton } from '../../converters/buttonConverter';
import { convertNumber } from '../../converters/numberConverter';
import { convertCover } from '../../converters/coverConverter';
import { LightCard } from './LightCard';
import { SwitchCard } from './SwitchCard';
import { SensorCard } from './SensorCard';
import { MediaPlayerCard } from './MediaPlayerCard';
import { ButtonCard } from './ButtonCard';
import { ToggleCard } from './ToggleCard';
import { SliderCard } from './SliderCard';
import { CoverCard } from './CoverCard';

interface SmartWidgetProps {
  entityId: string;
  nameOverride?: string;
  iconOverride?: string;
}

interface SmartSliderWidgetProps extends SmartWidgetProps {
  orientation?: 'horizontal' | 'vertical';
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

export const SmartButtonCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Button" />;
  }

  const props = convertButton(entity);

  const handlePress = () => {
    const domain = entityId.split('.')[0];
    const service = domain === 'button' ? 'press' : 'turn_on';
    callService(domain, service, undefined, { entity_id: entityId });
  };

  return (
    <ButtonCard
      props={props}
      onPress={handlePress}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartToggleCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Toggle" />;
  }

  const props = convertSwitch(entity);

  const handleToggle = () => {
    const domain = entityId.split('.')[0];
    callService(domain, 'toggle', undefined, { entity_id: entityId });
  };

  return (
    <ToggleCard
      props={props}
      onToggle={handleToggle}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartSliderCard: React.FC<SmartSliderWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
  orientation = 'horizontal',
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Slider" />;
  }

  const props = convertNumber(entity);

  const handleChange = (val: number) => {
    const domain = entityId.split('.')[0];
    callService(domain, 'set_value', { value: val }, { entity_id: entityId });
  };

  return (
    <SliderCard
      props={props}
      onChange={handleChange}
      orientation={orientation}
      nameOverride={nameOverride}
      iconOverride={iconOverride}
    />
  );
};

export const SmartCoverCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Cover" />;
  }

  const props = convertCover(entity);

  const handleOpen = () => {
    callService('cover', 'open_cover', undefined, { entity_id: entityId });
  };

  const handleClose = () => {
    callService('cover', 'close_cover', undefined, { entity_id: entityId });
  };

  const handleStop = () => {
    callService('cover', 'stop_cover', undefined, { entity_id: entityId });
  };

  const handleSetPosition = (pos: number) => {
    callService('cover', 'set_cover_position', { position: pos }, { entity_id: entityId });
  };

  return (
    <CoverCard
      props={props}
      onOpen={handleOpen}
      onClose={handleClose}
      onStop={handleStop}
      onSetPosition={handleSetPosition}
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
