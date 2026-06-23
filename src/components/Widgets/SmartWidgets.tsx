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
import { convertClimate } from '../../converters/climateConverter';
import { convertAlarm } from '../../converters/alarmConverter';
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

interface SmartWidgetProps {
  entityId: string;
  nameOverride?: string;
  iconOverride?: string;
}

interface SmartSliderWidgetProps extends SmartWidgetProps {
  orientation?: 'horizontal' | 'vertical';
}

export const SmartLightCard: React.FC<SmartWidgetProps> = ({
  entityId,
  nameOverride,
  iconOverride,
}) => {
  const entity = useEntity(entityId);

  if (!entity) {
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Light',
      isOn: true,
      brightness: 75,
      supportsBrightness: true,
      supportsColorTemp: true,
      supportsColor: true,
      stateText: '75% (Demo)',
    };
    return (
      <LightCard
        props={mockProps}
        onToggle={() => {}}
        onChangeBrightness={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Switch',
      isOn: false,
      stateText: 'Off (Demo)',
    };
    return (
      <SwitchCard
        props={mockProps}
        onToggle={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Sensor',
      state: '21.8',
      unit: '°C',
      deviceClass: 'temperature',
      stateText: '21.8 °C (Demo)',
    };
    return (
      <SensorCard
        props={mockProps}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Media Player',
      isOn: true,
      state: 'playing',
      isPlaying: true,
      volume: 45,
      isMuted: false,
      mediaTitle: 'Home Assistant Theme',
      mediaArtist: 'React Dashboard',
      supportsPlay: true,
      supportsPause: true,
      supportsVolume: true,
      supportsMute: true,
      supportsNext: true,
      supportsPrev: true,
    };
    return (
      <MediaPlayerCard
        props={mockProps}
        onToggle={() => {}}
        onPlay={() => {}}
        onPause={() => {}}
        onNext={() => {}}
        onPrev={() => {}}
        onChangeVolume={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Button',
      state: 'unknown',
      stateText: 'unknown',
    };
    return (
      <ButtonCard
        props={mockProps}
        onPress={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Toggle',
      isOn: true,
      stateText: 'On (Demo)',
    };
    return (
      <ToggleCard
        props={mockProps}
        onToggle={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Slider',
      value: 65,
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      stateText: '65 % (Demo)',
    };
    return (
      <SliderCard
        props={mockProps}
        onChange={() => {}}
        orientation={orientation}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Cover',
      state: 'open',
      position: 80,
      stateText: '80% Open (Demo)',
      supportsPosition: true,
      supportsOpen: true,
      supportsClose: true,
      supportsStop: true,
    };
    return (
      <CoverCard
        props={mockProps}
        onOpen={() => {}}
        onClose={() => {}}
        onStop={() => {}}
        onSetPosition={() => {}}
        nameOverride={nameOverride}
        iconOverride={iconOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Thermostat',
      state: 'heat',
      currentTemperature: 20,
      targetTemperature: 21.5,
      minTemp: 15,
      maxTemp: 30,
      hvacModes: ['off', 'heat', 'cool'],
      stateText: 'HEAT (Target: 21.5°C) (Demo)',
    };
    return (
      <ThermostatCard
        props={mockProps}
        onChangeTargetTemp={() => {}}
        onChangeMode={() => {}}
        nameOverride={nameOverride}
      />
    );
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
    const mockProps = {
      id: entityId,
      name: nameOverride || 'Demo Alarm Panel',
      state: 'disarmed',
      codeRequired: true,
      stateText: 'Disarmed (Demo)',
    };
    return (
      <AlarmKeypadCard
        props={mockProps}
        onArmHome={() => {}}
        onArmAway={() => {}}
        onDisarm={() => {}}
        nameOverride={nameOverride}
      />
    );
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

  const name = nameOverride || (entity ? (entity.attributes?.friendly_name || entityId) : 'Demo TV Remote');
  const domain = entityId.split('.')[0];

  const handleSendCommand = (cmd: string) => {
    if (!entity) return; // Demo action
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
    if (!entity) return; // Demo action
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_up'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_up', undefined, { entity_id: entityId });
    }
  };

  const handleVolumeDown = () => {
    if (!entity) return; // Demo action
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_down'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_down', undefined, { entity_id: entityId });
    }
  };

  const handleMute = () => {
    if (!entity) return; // Demo action
    if (domain === 'remote') {
      callService('remote', 'send_command', { command: ['volume_mute'] }, { entity_id: entityId });
    } else {
      callService('media_player', 'volume_mute', { is_volume_muted: !entity.attributes?.is_volume_muted }, { entity_id: entityId });
    }
  };

  const handlePowerToggle = () => {
    if (!entity) return; // Demo action
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
