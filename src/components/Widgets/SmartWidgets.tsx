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
import { ThermostatCard } from './ThermostatCard';
import { AlarmKeypadCard } from './AlarmKeypadCard';
import { TvRemoteCard } from './TvRemoteCard';
import { convertClimate } from '../../converters/climateConverter';
import { convertAlarm } from '../../converters/alarmConverter';

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

export const SmartThermostatCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Thermostat" />;
  }

  const props = convertClimate(entity);

  const handleChangeTargetTemp = (temp: number) => {
    callService('climate', 'set_temperature', { temperature: temp }, { entity_id: entityId });
  };

  const handleChangeMode = (mode: string) => {
    callService('climate', 'set_hvac_mode', { hvac_mode: mode }, { entity_id: entityId });
  };

  return (
    <ThermostatCard
      props={props}
      onChangeTargetTemp={handleChangeTargetTemp}
      onChangeMode={handleChangeMode}
      nameOverride={nameOverride}
    />
  );
};

export const SmartAlarmKeypadCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="Alarm Panel" />;
  }

  const props = convertAlarm(entity);

  const handleArmHome = (code: string) => {
    callService('alarm_control_panel', 'alarm_arm_home', { code }, { entity_id: entityId });
  };

  const handleArmAway = (code: string) => {
    callService('alarm_control_panel', 'alarm_arm_away', { code }, { entity_id: entityId });
  };

  const handleDisarm = (code: string) => {
    callService('alarm_control_panel', 'alarm_disarm', { code }, { entity_id: entityId });
  };

  return (
    <AlarmKeypadCard
      props={props}
      onArmHome={handleArmHome}
      onArmAway={handleArmAway}
      onDisarm={handleDisarm}
      nameOverride={nameOverride}
    />
  );
};

export const SmartTvRemoteCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    return <WidgetError entityId={entityId} type="TV Remote" />;
  }

  const name = nameOverride || entity.attributes?.friendly_name || entityId;
  const domain = entityId.split('.')[0];

  const handleSendCommand = (cmd: string) => {
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: [cmd] }, { entity_id: entityId });
    } else if (domain === 'media_player') {
      if (cmd === 'play') {
        callService('media_player', 'media_play', undefined, { entity_id: entityId });
      } else if (cmd === 'pause') {
        callService('media_player', 'media_pause', undefined, { entity_id: entityId });
      } else if (cmd === 'back') {
        callService('media_player', 'media_previous_track', undefined, { entity_id: entityId });
      } else if (cmd === 'home') {
        callService('media_player', 'turn_on', undefined, { entity_id: entityId });
      }
    }
  };

  const handleVolumeUp = () => {
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_up'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_up', undefined, { entity_id: entityId });
    }
  };

  const handleVolumeDown = () => {
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_down'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_down', undefined, { entity_id: entityId });
    }
  };

  const handleMute = () => {
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_mute'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_mute', { is_volume_muted: !entity.attributes?.is_volume_muted }, { entity_id: entityId });
    }
  };

  const handlePowerToggle = () => {
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['power'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'toggle', undefined, { entity_id: entityId });
    }
  };

  return (
    <TvRemoteCard
      name={name}
      onSendCommand={handleSendCommand}
      onVolumeUp={handleVolumeUp}
      onVolumeDown={handleVolumeDown}
      onMute={handleMute}
      onPowerToggle={handlePowerToggle}
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
