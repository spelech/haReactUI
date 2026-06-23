import type { HassEntity } from 'home-assistant-js-websocket';

export interface AlarmProps {
  id: string;
  name: string;
  state: string; // 'disarmed' | 'armed_home' | 'armed_away' | 'pending' | 'triggered' | 'unknown'
  codeFormat?: 'number' | 'text' | null;
  codeRequired: boolean;
  stateText: string;
}

export const convertAlarm = (entity: HassEntity): AlarmProps => {
  const attrs = entity.attributes || {};
  const state = entity.state || 'unknown';
  
  const codeFormat = attrs.code_format;
  const codeRequired = codeFormat !== null && codeFormat !== undefined;

  let stateText = 'Unknown';
  if (state === 'disarmed') stateText = 'Disarmed';
  else if (state === 'armed_home') stateText = 'Armed (Home)';
  else if (state === 'armed_away') stateText = 'Armed (Away)';
  else if (state === 'pending') stateText = 'Arming / Pending...';
  else if (state === 'triggered') stateText = 'ALARM TRIGGERED';

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    state,
    codeFormat,
    codeRequired,
    stateText,
  };
};
