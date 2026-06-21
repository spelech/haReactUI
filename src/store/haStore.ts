import { create } from 'zustand';
import type { HassEntities } from 'home-assistant-js-websocket';

interface HAStore {
  entities: HassEntities;
  setEntities: (entities: HassEntities) => void;
  updateEntity: (entityId: string, state: any) => void;
}

export const useHAStore = create<HAStore>((set) => ({
  entities: {},
  setEntities: (entities) => set({ entities }),
  updateEntity: (entityId, entityState) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [entityId]: entityState,
      },
    })),
}));
