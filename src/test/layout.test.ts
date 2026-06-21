import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutManager } from '../hooks/useLayoutManager';
import { renderHook, act } from '@testing-library/react';

// Simple mock for localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLayoutManager hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with default widgets and layouts if storage is empty', () => {
    const { result } = renderHook(() => useLayoutManager());
    
    // We expect loading to initially resolve defaults
    expect(result.current.widgets).toBeDefined();
    expect(result.current.layouts).toBeDefined();
    expect(result.current.isEditing).toBe(false);
  });

  it('should support toggling edit mode', () => {
    const { result } = renderHook(() => useLayoutManager());
    
    expect(result.current.isEditing).toBe(false);
    
    act(() => {
      result.current.setIsEditing(true);
    });
    
    expect(result.current.isEditing).toBe(true);
  });

  it('should add a widget and place it in all layouts', () => {
    const { result } = renderHook(() => useLayoutManager());
    
    const initialWidgetCount = result.current.widgets.length;
    
    act(() => {
      result.current.addWidget({
        type: 'sensor',
        entityId: 'sensor.temperature',
      }, 2, 2);
    });
    
    expect(result.current.widgets).toHaveLength(initialWidgetCount + 1);
    
    const newWidget = result.current.widgets[initialWidgetCount];
    expect(newWidget.type).toBe('sensor');
    expect(newWidget.entityId).toBe('sensor.temperature');
    expect(newWidget.id).toContain('widget-sensor-sensor.temperature-');

    // Confirm it was added to the layout coordinates
    Object.keys(result.current.layouts).forEach((breakpoint) => {
      const items = result.current.layouts[breakpoint];
      const match = items.find((item) => item.i === newWidget.id);
      expect(match).toBeDefined();
      expect(match?.w).toBe(2);
      expect(match?.h).toBe(2);
    });
  });

  it('should remove a widget from list and layout coordinates', () => {
    const { result } = renderHook(() => useLayoutManager());
    
    const widgetIdToRemove = result.current.widgets[0].id;
    const initialWidgetCount = result.current.widgets.length;
    
    act(() => {
      result.current.removeWidget(widgetIdToRemove);
    });
    
    expect(result.current.widgets).toHaveLength(initialWidgetCount - 1);
    expect(result.current.widgets.find((w) => w.id === widgetIdToRemove)).toBeUndefined();
    
    // Confirm it is gone from layouts
    Object.keys(result.current.layouts).forEach((breakpoint) => {
      const items = result.current.layouts[breakpoint];
      expect(items.find((item) => item.i === widgetIdToRemove)).toBeUndefined();
    });
  });

  it('should update widget overrides', () => {
    const { result } = renderHook(() => useLayoutManager());
    
    const targetWidget = result.current.widgets[0];
    
    act(() => {
      result.current.updateWidgetOverrides(targetWidget.id, { name: 'New Custom Name', icon: 'mdi:new-icon' });
    });
    
    const updated = result.current.widgets.find((w) => w.id === targetWidget.id);
    expect(updated?.overrides?.name).toBe('New Custom Name');
    expect(updated?.overrides?.icon).toBe('mdi:new-icon');
  });
});
