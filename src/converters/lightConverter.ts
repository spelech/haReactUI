import { HassEntity } from 'home-assistant-js-websocket';

export interface LightProps {
  id: string;
  name: string;
  isOn: boolean;
  brightness: number; // 0-100
  colorTemp?: number;
  rgbColor?: [number, number, number];
  supportsBrightness: boolean;
  supportsColorTemp: boolean;
  supportsColor: boolean;
  stateText: string;
}

export const convertLight = (entity: HassEntity): LightProps => {
  const attrs = entity.attributes || {};
  const supportedFeatures = attrs.supported_features || 0;
  const supportedColorModes = attrs.supported_color_modes || [];

  const supportsBrightness =
    (supportedFeatures & 1) !== 0 ||
    supportedColorModes.length > 0 ||
    attrs.brightness !== undefined;
    
  const supportsColorTemp =
    (supportedFeatures & 2) !== 0 ||
    supportedColorModes.includes('color_temp') ||
    attrs.color_temp !== undefined;
    
  const supportsColor =
    (supportedFeatures & 16) !== 0 ||
    supportedColorModes.some((m: string) => ['hs', 'rgb', 'xy', 'rgbw', 'rgbww'].includes(m)) ||
    attrs.rgb_color !== undefined;

  const brightness = attrs.brightness ? Math.round((attrs.brightness / 255) * 100) : 0;

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    isOn: entity.state === 'on',
    brightness,
    colorTemp: attrs.color_temp,
    rgbColor: attrs.rgb_color,
    supportsBrightness,
    supportsColorTemp,
    supportsColor,
    stateText: entity.state === 'on' ? (brightness > 0 ? `${brightness}%` : 'On') : 'Off',
  };
};
