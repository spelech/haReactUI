import { useHAStore } from '../store/haStore';
import { useShallow } from 'zustand/react/shallow';
import { HassEntity } from 'home-assistant-js-websocket';

/**
 * Returns the current state of a specific Home Assistant entity.
 * Component will re-render ONLY when this specific entity changes.
 */
export const useEntity = (entityId: string): HassEntity | undefined => {
  return useHAStore((state) => state.entities[entityId]);
};

/**
 * Returns all Home Assistant entities matching a specific domain.
 * Uses shallow comparison to prevent extra renders.
 */
export const useEntities = (domain: string): HassEntity[] => {
  return useHAStore(
    useShallow((state) => {
      const filtered = Object.keys(state.entities)
        .filter((key) => key.startsWith(`${domain}.`))
        .map((key) => state.entities[key]);
      
      // Sort to ensure a stable ordering
      return filtered.sort((a, b) => a.entity_id.localeCompare(b.entity_id));
    })
  );
};
