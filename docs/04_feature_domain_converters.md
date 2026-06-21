# Feature: Domain Converters

## Objective
Decouple the React UI components from Home Assistant's specific JSON structure. Converters act as an anti-corruption layer.

## Requirements
1. **Purity**: Converters should be pure TypeScript functions that take a `HassEntity` object and return a strongly-typed Props object for a specific component type.
2. **Standardization**:
   - HA represents colors and brightness in various ways depending on the integration (RGB, XY, color temp). The light converter should normalize this.
   - HA uses strings for states (`"on"`, `"off"`, `"playing"`, `"paused"`). Converters should map these to booleans (`isOn: boolean`) or standardized enums.
3. **Capabilities (Features)**:
   - Extract `supported_features` bitmasks to boolean flags (e.g., `supportsBrightness: boolean`, `supportsColor: boolean`).

## Implementation Details
- Create a `src/converters/` directory.
- `lightConverter.ts`: `(entity: HassEntity) => LightProps`
- `switchConverter.ts`: `(entity: HassEntity) => SwitchProps`
- `mediaPlayerConverter.ts`: `(entity: HassEntity) => MediaProps`

## Example
```typescript
export const convertLight = (entity: HassEntity): LightProps => {
    return {
        id: entity.entity_id,
        name: entity.attributes.friendly_name || entity.entity_id,
        isOn: entity.state === 'on',
        brightness: entity.attributes.brightness ? Math.round((entity.attributes.brightness / 255) * 100) : 0,
        // ... color parsing logic ...
    };
}
```
