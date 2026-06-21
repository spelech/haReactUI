import { HassEntity } from 'home-assistant-js-websocket';

export interface SensorProps {
  id: string;
  name: string;
  state: string;
  unit?: string;
  deviceClass?: string;
  stateText: string;
}

export const convertSensor = (entity: HassEntity): SensorProps => {
  const attrs = entity.attributes || {};
  const unit = attrs.unit_of_measurement;
  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state: entity.state,
    unit,
    deviceClass: attrs.device_class,
    stateText: entity.state + (unit ? ` ${unit}` : ''),
  };
};
