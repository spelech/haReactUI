import type { HassEntity } from 'home-assistant-js-websocket';

export interface SwitchProps {
  id: string;
  name: string;
  isOn: boolean;
  stateText: string;
}

export const convertSwitch = (entity: HassEntity): SwitchProps => {
  const attrs = entity.attributes || {};
  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    isOn: entity.state === 'on',
    stateText: entity.state === 'on' ? 'On' : 'Off',
  };
};
