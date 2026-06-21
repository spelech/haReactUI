# Feature: Authentication and Connection

## Objective
Establish and maintain a robust, real-time WebSocket connection to Home Assistant using the official `home-assistant-js-websocket` library.

## Requirements
1. **Authentication Flow**: 
   - Primary: Support Long-Lived Access Tokens for local/internal dashboards.
   - Secondary: Support the standard OAuth2 flow provided by the HA websocket library for external or generic access.
2. **Connection Lifecycle**:
   - Handle connection loss gracefully (auto-reconnect).
   - Display a global "Reconnecting..." or "Offline" indicator when the socket drops.
3. **Service Layer**:
   - Create a singleton or context provider that exposes the authenticated `Connection` object to the rest of the app.
   - Expose methods to call HA services (`connection.sendMessagePromise`).

## Implementation Details
- Use `createConnection` and `getAuth` from `home-assistant-js-websocket`.
- Create a `HAProvider` React component that wraps the app. While connecting, it displays a loading screen. Once connected, it renders the children and provides the connection object via Context.

## Expected Output
- `src/services/haConnection.ts`: Auth logic and connection initialization.
- `src/contexts/HAContext.tsx`: React Context provider for the connection state.
