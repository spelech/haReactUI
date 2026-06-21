# Architecture Overview: haReactUI

## Goal
Build a mobile-first, free-form, drag-and-drop React dashboard for Home Assistant. The UI will mimic an Android home screen with resizable widgets, bypassing the constraints of Lovelace while retaining powerful real-time capabilities.

## Core Technology Stack
1. **Frontend Framework**: React 18+ with Vite (for fast builds) and TypeScript.
2. **HA Communication**: `home-assistant-js-websocket` (official client). *Reference: `ha-component-kit` will be used as a structural reference for complex entity handling.*
3. **Layout Engine**: `react-grid-layout` (drag-and-drop, resizable, grid-snapping widgets).
4. **State Management**: Zustand (lightweight global state for caching HA entities) + React Context.
5. **Performance Tooling**: 
   - **Tanstack Virtualization**: Used for rendering massive lists of entities in the Configuration UI/Sandbox without dropping frames.
   - **Web Workers**: Utilized where appropriate for heavy background processing (e.g., parsing massive initial websocket payloads or complex history graph calculations) to keep the main UI thread buttery smooth.
6. **Styling**: Vanilla CSS / CSS Modules or lightweight CSS-in-JS (focused on custom rich aesthetics).
7. **Icons**: `@mdi/js` and `@mdi/react`.

## System Components
1. **Connection Manager**: Initializes and maintains the WebSocket connection to Home Assistant using long-lived access tokens or OAuth.
2. **State Store (Zustand)**: Subscribes to HA event streams. When an entity state changes, the store updates locally, triggering re-renders only for components subscribed to that specific entity.
3. **Domain Converters**: Pure TypeScript functions that take raw HA entity objects (with their arbitrary `attributes`) and normalize them into predictable props for our UI components (e.g., standardizing color temperatures, brightness percentages, or media player states).
4. **Widget Components**: The visual cards (Light, Switch, Sensor, Media). These use the normalized data from converters.
5. **Grid Engine**: The wrapper around `react-grid-layout` that handles widget placement, collision detection, resizing, and persisting the layout configuration (e.g., saving the layout JSON to browser LocalStorage or a Home Assistant input text helper).

## Data Flow
`HA Instance` <--(WebSocket)--> `Connection Manager` --> `Zustand Store` --> `Custom Hook (useEntity)` --> `Domain Converter` --> `Widget Component` --> `Grid Engine` --> `DOM`
