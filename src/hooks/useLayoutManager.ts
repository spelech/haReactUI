import { useState, useEffect, useCallback } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

export type Layouts = { [breakpoint: string]: LayoutItem[] };

export interface WidgetConfig {
  id: string; // Unique widget instance identifier
  type: 'light' | 'switch' | 'sensor' | 'media' | 'general';
  entityId: string;
  overrides?: {
    name?: string;
    icon?: string;
    [key: string]: any;
  };
}

const STORAGE_KEYS = {
  LAYOUTS: 'ha-dashboard-layouts',
  WIDGETS: 'ha-dashboard-widgets',
};

// Default initial widgets for dashboard demonstration
const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'widget-living-room-light',
    type: 'light',
    entityId: 'light.living_room',
    overrides: { name: 'Living Room' },
  },
  {
    id: 'widget-kitchen-light',
    type: 'light',
    entityId: 'light.kitchen',
  },
  {
    id: 'widget-tv-switch',
    type: 'switch',
    entityId: 'switch.tv',
  },
];

const DEFAULT_LAYOUTS: Layouts = {
  lg: [
    { i: 'widget-living-room-light', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-kitchen-light', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-tv-switch', x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  ],
  md: [
    { i: 'widget-living-room-light', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-kitchen-light', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-tv-switch', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
  ],
  sm: [
    { i: 'widget-living-room-light', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-kitchen-light', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'widget-tv-switch', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
  ],
  xs: [
    { i: 'widget-living-room-light', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'widget-kitchen-light', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'widget-tv-switch', x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2 },
  ],
};

export const useLayoutManager = () => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [layouts, setLayouts] = useState<Layouts>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedWidgets = localStorage.getItem(STORAGE_KEYS.WIDGETS);
      const storedLayouts = localStorage.getItem(STORAGE_KEYS.LAYOUTS);

      if (storedWidgets) {
        setWidgets(JSON.parse(storedWidgets));
      } else {
        setWidgets(DEFAULT_WIDGETS);
        localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(DEFAULT_WIDGETS));
      }

      if (storedLayouts) {
        setLayouts(JSON.parse(storedLayouts));
      } else {
        setLayouts(DEFAULT_LAYOUTS);
        localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(DEFAULT_LAYOUTS));
      }
    } catch (e) {
      console.error('Error loading layout configuration from localStorage:', e);
      setWidgets(DEFAULT_WIDGETS);
      setLayouts(DEFAULT_LAYOUTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLayouts = useCallback((newLayouts: Layouts) => {
    setLayouts(newLayouts);
    localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(newLayouts));
  }, []);

  const saveWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(newWidgets));
  }, []);

  // Handler for react-grid-layout changes
  const handleLayoutChange = useCallback(
    (_currentLayout: Layout, allLayouts: Layouts) => {
      // Only commit if we are actually editing or if it's an initial calculation
      saveLayouts(allLayouts);
    },
    [saveLayouts]
  );

  const addWidget = useCallback(
    (widget: Omit<WidgetConfig, 'id'>, w = 2, h = 2) => {
      const newId = `widget-${widget.type}-${widget.entityId}-${Date.now()}`;
      const newWidget: WidgetConfig = { ...widget, id: newId };

      const updatedWidgets = [...widgets, newWidget];
      saveWidgets(updatedWidgets);

      // Place the widget at the top-left of all layouts, let react-grid-layout resolve collisions
      const updatedLayouts = { ...layouts };
      Object.keys(updatedLayouts).forEach((breakpoint) => {
        updatedLayouts[breakpoint] = [
          ...updatedLayouts[breakpoint],
          { i: newId, x: 0, y: 0, w, h, minW: 2, minH: 2 },
        ];
      });
      saveLayouts(updatedLayouts);
    },
    [widgets, layouts, saveWidgets, saveLayouts]
  );

  const removeWidget = useCallback(
    (id: string) => {
      const updatedWidgets = widgets.filter((w) => w.id !== id);
      saveWidgets(updatedWidgets);

      const updatedLayouts = { ...layouts };
      Object.keys(updatedLayouts).forEach((breakpoint) => {
        updatedLayouts[breakpoint] = updatedLayouts[breakpoint].filter((l) => l.i !== id);
      });
      saveLayouts(updatedLayouts);
    },
    [widgets, layouts, saveWidgets, saveLayouts]
  );

  const updateWidgetOverrides = useCallback(
    (id: string, overrides: Record<string, any>) => {
      const updatedWidgets = widgets.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            overrides: {
              ...(w.overrides || {}),
              ...overrides,
            },
          };
        }
        return w;
      });
      saveWidgets(updatedWidgets);
    },
    [widgets, saveWidgets]
  );

  return {
    widgets,
    layouts,
    isEditing,
    setIsEditing,
    loading,
    handleLayoutChange,
    addWidget,
    removeWidget,
    updateWidgetOverrides,
  };
};
