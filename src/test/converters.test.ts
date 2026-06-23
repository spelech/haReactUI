import { describe, it, expect } from 'vitest';
import { convertLight } from '../converters/lightConverter';
import { convertSwitch } from '../converters/switchConverter';
import { convertMediaPlayer } from '../converters/mediaPlayerConverter';
import { convertSensor } from '../converters/sensorConverter';
import { convertCover } from '../converters/coverConverter';
import { convertNumber } from '../converters/numberConverter';
import { convertButton } from '../converters/buttonConverter';
import { convertClimate } from '../converters/climateConverter';
import { convertAlarm } from '../converters/alarmConverter';
import type { HassEntity } from 'home-assistant-js-websocket';

describe('Domain Converters', () => {
  describe('convertLight', () => {
    it('should convert a simple light that is off', () => {
      const entity: HassEntity = {
        entity_id: 'light.test',
        state: 'off',
        attributes: {
          friendly_name: 'Test Light',
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertLight(entity);
      expect(result.id).toBe('light.test');
      expect(result.name).toBe('Test Light');
      expect(result.isOn).toBe(false);
      expect(result.brightness).toBe(0);
      expect(result.stateText).toBe('Off');
    });

    it('should convert an active light with brightness and color mode attributes', () => {
      const entity: HassEntity = {
        entity_id: 'light.test_active',
        state: 'on',
        attributes: {
          friendly_name: 'Active Light',
          brightness: 128, // 50%
          color_temp: 370,
          rgb_color: [255, 128, 0],
          supported_color_modes: ['color_temp', 'rgb'],
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertLight(entity);
      expect(result.isOn).toBe(true);
      expect(result.brightness).toBe(50);
      expect(result.supportsBrightness).toBe(true);
      expect(result.supportsColorTemp).toBe(true);
      expect(result.supportsColor).toBe(true);
      expect(result.colorTemp).toBe(370);
      expect(result.rgbColor).toEqual([255, 128, 0]);
      expect(result.stateText).toBe('50%');
    });

    it('should support legacy bitmask supported_features', () => {
      const entity: HassEntity = {
        entity_id: 'light.legacy',
        state: 'on',
        attributes: {
          brightness: 255,
          supported_features: 19, // 1 (brightness) + 2 (color_temp) + 16 (color)
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertLight(entity);
      expect(result.supportsBrightness).toBe(true);
      expect(result.supportsColorTemp).toBe(true);
      expect(result.supportsColor).toBe(true);
      expect(result.brightness).toBe(100);
    });
  });

  describe('convertSwitch', () => {
    it('should convert switch states', () => {
      const onSwitch: HassEntity = {
        entity_id: 'switch.test',
        state: 'on',
        attributes: { friendly_name: 'Test Switch' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const offSwitch: HassEntity = {
        entity_id: 'switch.test',
        state: 'off',
        attributes: { friendly_name: 'Test Switch' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };

      const resOn = convertSwitch(onSwitch);
      expect(resOn.isOn).toBe(true);
      expect(resOn.stateText).toBe('On');

      const resOff = convertSwitch(offSwitch);
      expect(resOff.isOn).toBe(false);
      expect(resOff.stateText).toBe('Off');
    });
  });

  describe('convertMediaPlayer', () => {
    it('should convert media player attributes and decode capabilities', () => {
      const entity: HassEntity = {
        entity_id: 'media_player.living_room_tv',
        state: 'playing',
        attributes: {
          friendly_name: 'Living Room TV',
          volume_level: 0.45,
          is_volume_muted: false,
          media_title: 'Unchained Melody',
          media_artist: 'The Righteous Brothers',
          entity_picture: '/api/media_player_proxy/1234',
          supported_features: 16445, // 1 (pause) + 4 (volume_set) + 8 (volume_mute) + 32 (next) + 16384 (play)
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertMediaPlayer(entity);
      expect(result.isOn).toBe(true);
      expect(result.isPlaying).toBe(true);
      expect(result.volume).toBe(45);
      expect(result.isMuted).toBe(false);
      expect(result.mediaTitle).toBe('Unchained Melody');
      expect(result.mediaArtist).toBe('The Righteous Brothers');
      expect(result.mediaImage).toBe('/api/media_player_proxy/1234');
      expect(result.supportsPlay).toBe(true);
      expect(result.supportsPause).toBe(true);
      expect(result.supportsVolume).toBe(true);
      expect(result.supportsMute).toBe(true);
      expect(result.supportsNext).toBe(true);
      expect(result.supportsPrev).toBe(true);
    });
  });

  describe('convertSensor', () => {
    it('should format sensor state with unit', () => {
      const entity: HassEntity = {
        entity_id: 'sensor.living_room_temperature',
        state: '21.5',
        attributes: {
          friendly_name: 'Temperature',
          unit_of_measurement: '°C',
          device_class: 'temperature',
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertSensor(entity);
      expect(result.id).toBe('sensor.living_room_temperature');
      expect(result.name).toBe('Temperature');
      expect(result.state).toBe('21.5');
      expect(result.unit).toBe('°C');
      expect(result.deviceClass).toBe('temperature');
      expect(result.stateText).toBe('21.5 °C');
    });

    it('should handle sensor state without unit', () => {
      const entity: HassEntity = {
        entity_id: 'sensor.status',
        state: 'online',
        attributes: {},
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertSensor(entity);
      expect(result.stateText).toBe('online');
    });
  });

  describe('convertCover', () => {
    it('should convert cover attributes and capability flags', () => {
      const entity: HassEntity = {
        entity_id: 'cover.living_room_shades',
        state: 'open',
        attributes: {
          friendly_name: 'Living Room Shades',
          current_position: 70,
          supported_features: 15, // 1 + 2 + 4 + 8 (open, close, set_position, stop)
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertCover(entity);
      expect(result.id).toBe('cover.living_room_shades');
      expect(result.name).toBe('Living Room Shades');
      expect(result.state).toBe('open');
      expect(result.position).toBe(70);
      expect(result.stateText).toBe('70% Open');
      expect(result.supportsOpen).toBe(true);
      expect(result.supportsClose).toBe(true);
      expect(result.supportsPosition).toBe(true);
      expect(result.supportsStop).toBe(true);
    });

    it('should handle closed covers and legacy feature flags', () => {
      const entity: HassEntity = {
        entity_id: 'cover.garage',
        state: 'closed',
        attributes: {
          friendly_name: 'Garage Door',
          supported_features: 3, // 1 + 2 (open, close)
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertCover(entity);
      expect(result.state).toBe('closed');
      expect(result.stateText).toBe('Closed');
      expect(result.supportsOpen).toBe(true);
      expect(result.supportsClose).toBe(true);
      expect(result.supportsPosition).toBe(false);
      expect(result.supportsStop).toBe(false);
    });
  });

  describe('convertNumber', () => {
    it('should extract numeric attributes', () => {
      const entity: HassEntity = {
        entity_id: 'input_number.volume_limit',
        state: '45.5',
        attributes: {
          friendly_name: 'Volume Limit',
          min: 10,
          max: 90,
          step: 0.5,
          unit_of_measurement: '%',
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertNumber(entity);
      expect(result.id).toBe('input_number.volume_limit');
      expect(result.name).toBe('Volume Limit');
      expect(result.value).toBe(45.5);
      expect(result.min).toBe(10);
      expect(result.max).toBe(90);
      expect(result.step).toBe(0.5);
      expect(result.unit).toBe('%');
      expect(result.stateText).toBe('45.5 %');
    });
  });

  describe('convertButton', () => {
    it('should convert button/script helper state', () => {
      const entity: HassEntity = {
        entity_id: 'button.restart_router',
        state: '2026-06-21T00:00:00Z',
        attributes: { friendly_name: 'Restart Router' },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertButton(entity);
      expect(result.id).toBe('button.restart_router');
      expect(result.name).toBe('Restart Router');
      expect(result.state).toBe('2026-06-21T00:00:00Z');
      expect(result.stateText).toBe('2026-06-21T00:00:00Z');
    });
  });

  describe('convertClimate', () => {
    it('should convert climate attributes correctly', () => {
      const entity: HassEntity = {
        entity_id: 'climate.nest',
        state: 'heat',
        attributes: {
          friendly_name: 'Nest Thermostat',
          current_temperature: 20.5,
          temperature: 22,
          min_temp: 16,
          max_temp: 28,
          hvac_modes: ['off', 'heat', 'cool'],
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertClimate(entity);
      expect(result.id).toBe('climate.nest');
      expect(result.name).toBe('Nest Thermostat');
      expect(result.state).toBe('heat');
      expect(result.currentTemperature).toBe(20.5);
      expect(result.targetTemperature).toBe(22);
      expect(result.minTemp).toBe(16);
      expect(result.maxTemp).toBe(28);
      expect(result.stateText).toBe('HEAT (Target: 22°C)');
    });
  });

  describe('convertAlarm', () => {
    it('should convert alarm panel states', () => {
      const entity: HassEntity = {
        entity_id: 'alarm_control_panel.home_alarm',
        state: 'armed_home',
        attributes: {
          friendly_name: 'Home Alarm',
          code_format: 'number',
        },
        last_changed: '',
        last_updated: '',
        context: { id: '', parent_id: null, user_id: null },
      };
      const result = convertAlarm(entity);
      expect(result.id).toBe('alarm_control_panel.home_alarm');
      expect(result.name).toBe('Home Alarm');
      expect(result.state).toBe('armed_home');
      expect(result.codeFormat).toBe('number');
      expect(result.codeRequired).toBe(true);
      expect(result.stateText).toBe('Armed (Home)');
    });
  });
});
