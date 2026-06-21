# Feature: Grid Layout Engine

## Objective
Provide the "Android Homescreen" experience. A free-form grid where widgets can be dragged, dropped, and resized.

## Requirements
1. **Layout Engine**: Integrate `react-grid-layout` (`Responsive` and `WidthProvider` HOCs).
2. **Grid Properties**:
   - Mobile-first breakpoints (e.g., standard phone = 4 columns, tablet = 8 columns).
   - Draggable by a specific handle or the whole card (if not in 'interactive' mode).
   - Resizable with constraints (min width/height for certain widget types).
3. **Persistence**:
   - The layout configuration (array of objects containing `i` (id), `x`, `y`, `w`, `h`) must be saved.
   - Initial MVP: Save to browser `localStorage`.
   - Future: Save to a Home Assistant helper (e.g., `input_text.dashboard_layout`) so the layout syncs across devices.
4. **Edit Mode**:
   - A toggle state (`isEditing`) that enables/disables dragging and resizing. When not editing, widgets act as normal UI elements (clicking toggles a light).

## Implementation Details
- Create a `DashboardGrid` component.
- Map over a configured array of widgets and render them inside `div`s with `key`s that match the layout config.
- Pass `isDraggable={isEditing}` and `isResizable={isEditing}` to the grid.

## Expected Output
- `src/components/Grid/DashboardGrid.tsx`: Main grid wrapper.
- `src/hooks/useLayoutManager.ts`: Logic for loading/saving layout coordinates.
