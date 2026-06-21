# Feature: Base Components

## Objective
Build the actual interactive widgets that the user will see on the dashboard, utilizing modern CSS aesthetics (glassmorphism, vibrant colors, micro-animations).

## Requirements
1. **Dumb Components**: These components should be mostly "dumb". They receive their data via props (structured by the Domain Converters) rather than fetching it themselves. This makes them highly reusable and testable.
2. **Interaction**:
   - They need to accept callback functions for user actions (e.g., `onToggle`, `onChangeBrightness`).
3. **Aesthetics**:
   - Follow premium UI design principles. 
   - Smooth transitions when states change (e.g., a light card slowly pulsing or glowing when turned on).
   - Touch-friendly tap targets (minimum 44x44px).

## Implementation Details
- `src/components/Widgets/LightCard.tsx`
- `src/components/Widgets/SensorCard.tsx`
- **Smart Wrapper**: Create a higher-order component (HOC) or wrapper that ties a dumb component to the Zustand store and the HA connection.
  - *Example*: `<SmartLightCard entityId="light.living_room" />` reads the state via `useEntity`, passes it to `lightConverter`, passes the result to `<LightCard>`, and wires up the `onToggle` callback to `connection.sendMessagePromise({ type: 'call_service', domain: 'light', service: 'toggle', target: { entity_id: 'light.living_room' } })`.

## Expected Output
- A library of premium `*Card.tsx` components.
- Smart wrappers that connect the UI to the backend.
