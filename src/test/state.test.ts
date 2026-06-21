import { describe, it, expect, beforeEach } from 'vitest';
import { useHAStore } from '../store/haStore';
import { useEntity, useEntities } from '../hooks/useEntity';
import { renderHook } from '@testing-library/react';

const mockEntities = {
  'light.living_room': {
    entity_id: 'light.living_room',
    state: 'on',
    attributes: { friendly_name: 'Living Room Light' },
  },
  'light.kitchen': {
    entity_id: 'light.kitchen',
    state: 'off',
    attributes: { friendly_name: 'Kitchen Light' },
  },
  'switch.tv': {
    entity_id: 'switch.tv',
    state: 'off',
    attributes: { friendly_name: 'TV Switch' },
  },
} as any;

describe('HA Store & Hooks', () => {
  beforeEach(() => {
    useHAStore.getState().setEntities(mockEntities);
  });

  it('should return a specific entity using useEntity', () => {
    const { result } = renderHook(() => useEntity('light.living_room'));
    expect(result.current).toBeDefined();
    expect(result.current?.state).toBe('on');
    expect(result.current?.attributes.friendly_name).toBe('Living Room Light');
  });

  it('should return undefined for non-existent entity', () => {
    const { result } = renderHook(() => useEntity('light.non_existent'));
    expect(result.current).toBeUndefined();
  });

  it('should return all entities of a domain using useEntities', () => {
    const { result } = renderHook(() => useEntities('light'));
    expect(result.current).toHaveLength(2);
    expect(result.current[0].entity_id).toBe('light.kitchen'); // sorted alphabetically
    expect(result.current[1].entity_id).toBe('light.living_room');
  });
});
