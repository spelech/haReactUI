import type { HassEntity } from 'home-assistant-js-websocket';

export interface ButtonProps {
  id: string;
  name: string;
  state: string;
  stateText: string;
}

export const convertButton = (entity: HassEntity): ButtonProps => {
  const attrs = entity.attributes || {};
  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state: entity.state,
    stateText: entity.state,
  };
};
