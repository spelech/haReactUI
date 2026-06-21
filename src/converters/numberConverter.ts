import type { HassEntity } from 'home-assistant-js-websocket';

export interface NumberProps {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  stateText: string;
}

export const convertNumber = (entity: HassEntity): NumberProps => {
  const attrs = entity.attributes || {};
  const value = parseFloat(entity.state) || 0;
  const min = typeof attrs.min === 'number' ? attrs.min : 0;
  const max = typeof attrs.max === 'number' ? attrs.max : 100;
  const step = typeof attrs.step === 'number' ? attrs.step : 1;
  const unit = attrs.unit_of_measurement || '';

  return {
    id: entity.entity_id,
    name: attrs.friendly_name || entity.entity_id,
    value,
    min,
    max,
    step,
    unit,
    stateText: `${value}${unit ? ' ' + unit : ''}`,
  };
};
