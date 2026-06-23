import type { HassEntity } from 'home-assistant-js-websocket';

export interface ClimateProps {
  id: string;
  name: string;
  state: string; // hvac mode: 'heat', 'cool', 'heat_cool', 'off', etc.
  currentTemperature: number;
  targetTemperature: number;
  minTemp: number;
  maxTemp: number;
  hvacModes: string[];
  presetMode?: string;
  presetModes?: string[];
  fanMode?: string;
  fanModes?: string[];
  stateText: string;
}

export const convertClimate = (entity: HassEntity): ClimateProps => {
  const attrs = entity.attributes || {};
  
  const currentTemperature = typeof attrs.current_temperature === 'number' ? attrs.current_temperature : 0;
  const targetTemperature = typeof attrs.temperature === 'number' ? attrs.temperature : currentTemperature || 21;
  const minTemp = typeof attrs.min_temp === 'number' ? attrs.min_temp : 15;
  const maxTemp = typeof attrs.max_temp === 'number' ? attrs.max_temp : 30;
  const hvacModes = Array.isArray(attrs.hvac_modes) ? attrs.hvac_modes : ['off', 'heat', 'cool'];
  
  const presetMode = attrs.preset_mode;
  const presetModes = attrs.preset_modes;
  const fanMode = attrs.fan_mode;
  const fanModes = attrs.fan_modes;

  let stateText = entity.state.toUpperCase();
  if (entity.state !== 'off') {
    stateText = `${stateText} (Target: ${targetTemperature}°C)`;
  }

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state: entity.state,
    currentTemperature,
    targetTemperature,
    minTemp,
    maxTemp,
    hvacModes,
    presetMode,
    presetModes,
    fanMode,
    fanModes,
    stateText,
  };
};
