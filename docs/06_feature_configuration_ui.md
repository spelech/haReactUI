# Feature: Configuration UI

## Objective
Allow the user to build and modify their dashboard directly from the browser without editing code.

## Requirements
1. **Edit Mode Toggle**: A button (perhaps hidden behind a long-press or a specific admin route) that switches the dashboard into "Edit Mode".
2. **Widget Sandbox**:
   - While in edit mode, tapping an empty space or an "Add" button opens a modal.
   - The modal lists all available Home Assistant entities.
   - Selecting an entity determines which Widget Component to spawn based on the domain (e.g., `light.*` spawns a `SmartLightCard`).
3. **Widget Configuration**:
   - Once spawned, widgets can be resized and dragged using the Grid Layout Engine.
   - Clicking a widget in Edit Mode should open a configuration drawer to override default settings (e.g., overriding the `friendly_name`, choosing a custom icon).
4. **Save/Discard**: Options to commit the layout changes to storage or revert to the previous layout.

## Implementation Details
- `src/components/Configuration/EditToolbar.tsx`
- `src/components/Configuration/EntitySelectorModal.tsx`
- Extend the Layout Config schema to store overrides (e.g., `{ i: 'light.living_room', x: 0, y: 0, w: 2, h: 2, overrides: { name: 'Couch Light' } }`).
