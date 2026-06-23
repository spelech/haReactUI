import { useState, useEffect, useCallback } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

export type Layouts = { [breakpoint: string]: LayoutItem[] };
export type ViewLayouts = { [viewId: string]: Layouts };

export interface WidgetConfig {
  id: string; // Unique widget instance identifier
  type: 'light' | 'switch' | 'sensor' | 'media' | 'button' | 'toggle' | 'slider' | 'cover' | 'thermostat' | 'alarm' | 'remote' | 'camera' | 'weather' | 'graph' | 'adguard' | 'car' | 'printer' | 'ups' | 'general';
  entityId: string;
  view?: string; // Scoped view tab ID
  overrides?: {
    name?: string;
    icon?: string;
    [key: string]: any;
  };
}

const STORAGE_KEYS = {
  LAYOUTS: 'ha-dashboard-layouts-v5',
  WIDGETS: 'ha-dashboard-widgets-v5',
  CURRENT_VIEW: 'ha-dashboard-current-view',
};

// Default initial widgets for each view
const DEFAULT_WIDGETS: WidgetConfig[] = [
  // Home View
  { id: 'h-weather', type: 'weather', entityId: 'weather.homehourly', view: 'home', overrides: { name: 'Wiley Weather' } },
  { id: 'h-thermostat', type: 'thermostat', entityId: 'climate.thermostat', view: 'home', overrides: { name: 'House Climate' } },
  { id: 'h-car', type: 'car', entityId: 'sensor.fuel_level_es300h', view: 'home', overrides: { name: 'Lexus ES300h' } },
  { id: 'h-printer', type: 'printer', entityId: 'switch.3d_printer', view: 'home', overrides: { name: 'Prusa MK3s' } },

  // Security View
  { id: 's-alarm', type: 'alarm', entityId: 'alarm_control_panel.823scd_alarm', view: 'security', overrides: { name: 'Ring Security' } },
  { id: 's-doorbell', type: 'camera', entityId: 'camera.front_doorbell', view: 'security', overrides: { name: 'Front Doorbell' } },
  { id: 's-driveway-cam', type: 'camera', entityId: 'camera.driveway_spotlight_camera', view: 'security', overrides: { name: 'Driveway Camera' } },
  { id: 's-garage', type: 'cover', entityId: 'cover.garage_door', view: 'security', overrides: { name: 'Garage Door' } },

  // Climate View
  { id: 'c-thermostat', type: 'thermostat', entityId: 'climate.thermostat', view: 'climate', overrides: { name: 'House climate' } },
  { id: 'c-temp-graph', type: 'graph', entityId: 'sensor.thermostat_current_temperature', view: 'climate', overrides: { name: 'Living Room Temp History', color: '#60a5fa' } },
  { id: 'c-humidity-graph', type: 'graph', entityId: 'sensor.home_humidity', view: 'climate', overrides: { name: 'House Humidity History', color: '#fbbf24' } },

  // Media View
  { id: 'm-remote', type: 'remote', entityId: 'media_player.family_room_roku', view: 'media', overrides: { name: 'Family Room Roku' } },
  { id: 'm-player', type: 'media', entityId: 'media_player.family_room_shield_adb', view: 'media', overrides: { name: 'Shield TV' } },

  // Cameras View
  { id: 'cam-nursery', type: 'camera', entityId: 'camera.nursery_mainstream', view: 'cameras', overrides: { name: "Margot's Nursery" } },
  { id: 'cam-dining', type: 'camera', entityId: 'camera.dining_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Dining Room' } },
  { id: 'cam-living', type: 'camera', entityId: 'camera.living_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Living Room' } },
  { id: 'cam-family', type: 'camera', entityId: 'camera.family_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Family Room' } },
  { id: 'cam-play', type: 'camera', entityId: 'camera.basement_play_area_camera_mainstream', view: 'cameras', overrides: { name: 'Basement Play' } },
  { id: 'cam-theater', type: 'camera', entityId: 'camera.basement_theater_camera_mainstream', view: 'cameras', overrides: { name: 'Basement Theater' } },
  { id: 'cam-garage', type: 'camera', entityId: 'camera.garage_camera_mainstream', view: 'cameras', overrides: { name: 'Garage Camera' } },
  { id: 'cam-maker', type: 'camera', entityId: 'camera.maker_camera_mainstream', view: 'cameras', overrides: { name: '3D Printer Camera' } },

  // Car View
  { id: 'car-vehicle', type: 'car', entityId: 'sensor.fuel_level_es300h', view: 'car', overrides: { name: 'ES300h Hybrid' } },

  // Server View
  { id: 'srv-ups-office', type: 'ups', entityId: 'sensor.office_ups_status', view: 'server', overrides: { name: 'Office UPS', prefix: 'office' } },
  { id: 'srv-ups-server', type: 'ups', entityId: 'sensor.server_ups_status', view: 'server', overrides: { name: 'Server UPS', prefix: 'server' } },
  { id: 'srv-printer', type: 'printer', entityId: 'switch.3d_printer', view: 'server', overrides: { name: 'OctoPrint Prusa' } },

  // Network View
  { id: 'net-adguard', type: 'adguard', entityId: 'switch.adguard_protection', view: 'network', overrides: { name: 'AdGuard Shield' } },
];

const DEFAULT_LAYOUTS: ViewLayouts = {
  home: {
    lg: [
      { i: 'h-weather', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'h-thermostat', x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'h-car', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'h-printer', x: 2, y: 3, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
  security: {
    lg: [
      { i: 's-alarm', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
      { i: 's-garage', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 's-doorbell', x: 0, y: 4, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 's-driveway-cam', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
  climate: {
    lg: [
      { i: 'c-thermostat', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'c-temp-graph', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'c-humidity-graph', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
  media: {
    lg: [
      { i: 'm-remote', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
      { i: 'm-player', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
  cameras: {
    lg: [
      { i: 'cam-nursery', x: 0, y: 0, w: 2, h: 2 },
      { i: 'cam-dining', x: 2, y: 0, w: 2, h: 2 },
      { i: 'cam-living', x: 0, y: 2, w: 2, h: 2 },
      { i: 'cam-family', x: 2, y: 2, w: 2, h: 2 },
      { i: 'cam-play', x: 0, y: 4, w: 2, h: 2 },
      { i: 'cam-theater', x: 2, y: 4, w: 2, h: 2 },
      { i: 'cam-garage', x: 0, y: 6, w: 2, h: 2 },
      { i: 'cam-maker', x: 2, y: 6, w: 2, h: 2 },
    ],
  },
  car: {
    lg: [
      { i: 'car-vehicle', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
    ],
  },
  server: {
    lg: [
      { i: 'srv-ups-office', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'srv-ups-server', x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'srv-printer', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
  network: {
    lg: [
      { i: 'net-adguard', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    ],
  },
};

export const useLayoutManager = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [allWidgets, setAllWidgets] = useState<WidgetConfig[]>([]);
  const [allLayouts, setAllLayouts] = useState<ViewLayouts>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedWidgets = localStorage.getItem(STORAGE_KEYS.WIDGETS);
      const storedLayouts = localStorage.getItem(STORAGE_KEYS.LAYOUTS);
      const storedView = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);

      if (storedWidgets) {
        setAllWidgets(JSON.parse(storedWidgets));
      } else {
        setAllWidgets(DEFAULT_WIDGETS);
        localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(DEFAULT_WIDGETS));
      }

      if (storedLayouts) {
        setAllLayouts(JSON.parse(storedLayouts));
      } else {
        setAllLayouts(DEFAULT_LAYOUTS);
        localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(DEFAULT_LAYOUTS));
      }

      if (storedView) {
        setCurrentView(storedView);
      }
    } catch (e) {
      console.error('Error loading configuration from localStorage:', e);
      setAllWidgets(DEFAULT_WIDGETS);
      setAllLayouts(DEFAULT_LAYOUTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeView = useCallback((view: string) => {
    setCurrentView(view);
    localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, view);
  }, []);

  const saveAllLayouts = useCallback((newLayouts: ViewLayouts) => {
    setAllLayouts(newLayouts);
    localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(newLayouts));
  }, []);

  const saveAllWidgets = useCallback((newWidgets: WidgetConfig[]) => {
    setAllWidgets(newWidgets);
    localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(newWidgets));
  }, []);

  // Filter widgets for the current view
  const widgets = allWidgets.filter((w) => (w.view || 'home') === currentView);

  // Filter layouts for the current view, providing empty lg/md/sm structures if undefined
  const layouts = allLayouts[currentView] || { lg: [], md: [], sm: [], xs: [] };

  // Handler for react-grid-layout changes
  const handleLayoutChange = useCallback(
    (_currentLayout: Layout, rglLayouts: Layouts) => {
      const updated = {
        ...allLayouts,
        [currentView]: rglLayouts,
      };
      saveAllLayouts(updated);
    },
    [allLayouts, currentView, saveAllLayouts]
  );

  const addWidget = useCallback(
    (widget: Omit<WidgetConfig, 'id' | 'view'>, customW?: number, customH?: number) => {
      let w = customW ?? 2;
      let h = customH ?? 2;

      // Assign type-specific default heights to prevent content cut-off
      if (customW === undefined && customH === undefined) {
        if (widget.type === 'remote') {
          h = 4;
        } else if (widget.type === 'alarm') {
          h = 4;
        } else if (widget.type === 'car') {
          h = 3;
        } else if (widget.type === 'thermostat') {
          h = 3;
        }
      }

      const newId = `widget-${widget.type}-${widget.entityId}-${Date.now()}`;
      const newWidget: WidgetConfig = { ...widget, id: newId, view: currentView };

      const updatedWidgets = [...allWidgets, newWidget];
      saveAllWidgets(updatedWidgets);

      const updatedLayouts = { ...allLayouts };
      const currentViewLayouts = updatedLayouts[currentView] || { lg: [], md: [], sm: [], xs: [] };
      
      const newLayouts = { ...currentViewLayouts };
      Object.keys(newLayouts).forEach((breakpoint) => {
        newLayouts[breakpoint] = [
          ...newLayouts[breakpoint],
          { i: newId, x: 0, y: 0, w, h, minW: 2, minH: 2 },
        ];
      });

      // Handle if view didn't have layouts initialized at all
      if (Object.keys(newLayouts).length === 0) {
        newLayouts['lg'] = [{ i: newId, x: 0, y: 0, w, h, minW: 2, minH: 2 }];
      }

      updatedLayouts[currentView] = newLayouts;
      saveAllLayouts(updatedLayouts);
    },
    [allWidgets, allLayouts, currentView, saveAllWidgets, saveAllLayouts]
  );

  const removeWidget = useCallback(
    (id: string) => {
      const updatedWidgets = allWidgets.filter((w) => w.id !== id);
      saveAllWidgets(updatedWidgets);

      const updatedLayouts = { ...allLayouts };
      if (updatedLayouts[currentView]) {
        const viewLayouts = updatedLayouts[currentView];
        const newLayouts = { ...viewLayouts };
        Object.keys(newLayouts).forEach((breakpoint) => {
          newLayouts[breakpoint] = newLayouts[breakpoint].filter((l) => l.i !== id);
        });
        updatedLayouts[currentView] = newLayouts;
      }
      saveAllLayouts(updatedLayouts);
    },
    [allWidgets, allLayouts, currentView, saveAllWidgets, saveAllLayouts]
  );

  const updateWidgetOverrides = useCallback(
    (id: string, overrides: Record<string, any>) => {
      const updatedWidgets = allWidgets.map((w) => {
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
      saveAllWidgets(updatedWidgets);
    },
    [allWidgets, saveAllWidgets]
  );

  const resetLayout = useCallback(() => {
    setAllWidgets(DEFAULT_WIDGETS);
    setAllLayouts(DEFAULT_LAYOUTS);
    localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(DEFAULT_WIDGETS));
    localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(DEFAULT_LAYOUTS));
  }, []);

  return {
    currentView,
    setCurrentView: changeView,
    widgets,
    layouts,
    isEditing,
    setIsEditing,
    loading,
    handleLayoutChange,
    addWidget,
    removeWidget,
    updateWidgetOverrides,
    resetLayout,
  };
};
