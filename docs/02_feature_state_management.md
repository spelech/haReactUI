# Feature: State Management

## Objective
Maintain a highly performant local cache of Home Assistant entity states that reacts in real-time to WebSocket events.

## Requirements
1. **Initial Sync**: On connection, fetch all current states using `getStates(connection)`.
2. **Event Subscription**: Subscribe to the `state_changed` event stream via `subscribeEntities(connection, callback)`.
3. **Performant Updates**: 
   - Store the entities in a dictionary (key: `entity_id`, value: `HassEntity` object).
   - Ensure that updating one entity does not cause the entire dashboard to re-render.
4. **Hooks**:
   - `useEntity(entityId)`: Returns the current state of a specific entity, and re-renders the calling component *only* when that specific entity changes.
   - `useEntities(domain)`: Returns all entities matching a specific domain (e.g., `light.*`).

## Implementation Details
- Use Zustand for the store. It allows components to subscribe to specific slices of state (e.g., `useStore(state => state.entities['light.living_room'])`).
- The `HAProvider` (from Feature 01) will initialize the Zustand store subscriptions once the connection is established.

## Expected Output
- `src/store/haStore.ts`: Zustand store definition.
- `src/hooks/useEntity.ts`: Hook for components to access specific entities.
