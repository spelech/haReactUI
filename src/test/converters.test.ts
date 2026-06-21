import { describe, it, expect } from 'vitest';
import { convertLight } from '../converters/lightConverter';
import { convertSwitch } from '../converters/switchConverter';
import { convertMediaPlayer } from '../converters/mediaPlayerConverter';
import { convertSensor } from '../converters/sensorConverter';
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
});
