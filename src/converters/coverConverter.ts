import type { HassEntity } from 'home-assistant-js-websocket';

export interface CoverProps {
  id: string;
  name: string;
  state: string; // 'open' | 'closed' | 'opening' | 'closing'
  position: number; // 0-100
  stateText: string;
  supportsPosition: boolean;
  supportsOpen: boolean;
  supportsClose: boolean;
  supportsStop: boolean;
}

export const convertCover = (entity: HassEntity): CoverProps => {
  const attrs = entity.attributes || {};
  const state = entity.state;
  
  // HA cover features: 1 = open, 2 = close, 4 = set_position, 8 = stop
  const features = attrs.supported_features || 0;
  const supportsOpen = (features & 1) !== 0;
  const supportsClose = (features & 2) !== 0;
  const supportsPosition = (features & 4) !== 0;
  const supportsStop = (features & 8) !== 0;

  const position = typeof attrs.current_position === 'number' ? attrs.current_position : 0;

  let stateText = 'Unknown';
  if (state === 'open') stateText = supportsPosition ? `${position}% Open` : 'Open';
  else if (state === 'closed') stateText = 'Closed';
  else if (state === 'opening') stateText = 'Opening...';
  else if (state === 'closing') stateText = 'Closing...';

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state,
    position,
    stateText,
    supportsPosition,
    supportsOpen,
    supportsClose,
    supportsStop,
  };
};
