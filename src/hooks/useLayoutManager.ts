import { useState, useEffect, useCallback } from 'react';
import type { Layout, LayoutItem } from 'react-grid-layout';

export type Layouts = { [breakpoint: string]: LayoutItem[] };
export type ViewLayouts = { [viewId: string]: Layouts };

export interface WidgetConfig {
  id: string; // Unique widget instance identifier
  type: 'light' | 'switch' | 'sensor' | 'media' | 'button' | 'toggle' | 'slider' | 'cover' | 'thermostat' | 'alarm' | 'remote' | 'camera' | 'weather' | 'graph' | 'adguard' | 'car' | 'printer' | 'ups' | 'general' | 'navigate';
  entityId: string;
  view?: string; // Scoped view tab ID
  overrides?: {
    name?: string;
    icon?: string;
    [key: string]: any;
  };
}

const STORAGE_KEYS = {
  LAYOUTS: 'ha-dashboard-layouts-v6',
  WIDGETS: 'ha-dashboard-widgets-v6',
  CURRENT_VIEW: 'ha-dashboard-current-view-v6',
};

// Default initial widgets for each view
const DEFAULT_WIDGETS: WidgetConfig[] = [
  // Home View
  { id: 'h-weather', type: 'weather', entityId: 'weather.homehourly', view: 'home', overrides: { name: 'Wiley Weather' } },
  { id: 'h-thermostat', type: 'thermostat', entityId: 'climate.thermostat', view: 'home', overrides: { name: 'House Climate' } },
  { id: 'h-car', type: 'car', entityId: 'sensor.fuel_level_es300h', view: 'home', overrides: { name: 'Lexus ES300h' } },
  { id: 'h-printer', type: 'printer', entityId: 'switch.3d_printer', view: 'home', overrides: { name: 'Prusa MK3s' } },

  // Rooms Navigation
  { id: 'nav-familyroom', type: 'navigate', entityId: 'navigate.familyroom', view: 'home', overrides: { name: 'Family Room', targetView: 'familyroom', icon: 'mdiSofa' } },
  { id: 'nav-livingroom', type: 'navigate', entityId: 'navigate.livingroom', view: 'home', overrides: { name: 'Living Room', targetView: 'livingroom', icon: 'mdiSofa' } },
  { id: 'nav-kitchen', type: 'navigate', entityId: 'navigate.kitchen', view: 'home', overrides: { name: 'Kitchen', targetView: 'kitchen', icon: 'mdiSilverwareForkKnife' } },
  { id: 'nav-masterbedroom', type: 'navigate', entityId: 'navigate.masterbedroom', view: 'home', overrides: { name: 'Master Bedroom', targetView: 'masterbedroom', icon: 'mdiBedKing' } },
  { id: 'nav-nursery', type: 'navigate', entityId: 'navigate.nursery', view: 'home', overrides: { name: "Margot's Room", targetView: 'nursery', icon: 'mdiBaby' } },
  { id: 'nav-office', type: 'navigate', entityId: 'navigate.office', view: 'home', overrides: { name: 'Office', targetView: 'office', icon: 'mdiLaptop' } },
  { id: 'nav-guest', type: 'navigate', entityId: 'navigate.guest', view: 'home', overrides: { name: 'Guest Room', targetView: 'guest', icon: 'mdiBedOutline' } },
  { id: 'nav-basement', type: 'navigate', entityId: 'navigate.basement', view: 'home', overrides: { name: 'Basement', targetView: 'basement', icon: 'mdiTheater' } },
  { id: 'nav-outdoor', type: 'navigate', entityId: 'navigate.outdoor', view: 'home', overrides: { name: 'Outdoor', targetView: 'outdoor', icon: 'mdiTree' } },
  { id: 'nav-masterbathroom', type: 'navigate', entityId: 'navigate.masterbathroom', view: 'home', overrides: { name: 'Master Bath', targetView: 'masterbathroom', icon: 'mdiShower' } },
  { id: 'nav-laundryroom', type: 'navigate', entityId: 'navigate.laundryroom', view: 'home', overrides: { name: 'Laundry Room', targetView: 'laundryroom', icon: 'mdiWashingMachine' } },
  { id: 'nav-others', type: 'navigate', entityId: 'navigate.notinrooms', view: 'home', overrides: { name: 'Others', targetView: 'notinrooms', icon: 'mdiLightbulbOutline' } },

  // Controls Navigation
  { id: 'nav-remote-menu', type: 'navigate', entityId: 'navigate.remote_menu', view: 'home', overrides: { name: 'Remotes', targetView: 'remote-menu', icon: 'mdiRemote' } },
  { id: 'nav-hvac-controls', type: 'navigate', entityId: 'navigate.hvac_controls', view: 'home', overrides: { name: 'Heat/Cool', targetView: 'hvac-controls', icon: 'mdiThermostat' } },
  { id: 'nav-3dprinter', type: 'navigate', entityId: 'navigate.3dprinter', view: 'home', overrides: { name: '3D Printer', targetView: '3dprinter', icon: 'mdiPrinter3d' } },
  { id: 'nav-security', type: 'navigate', entityId: 'navigate.security', view: 'home', overrides: { name: 'Security', targetView: 'security', icon: 'mdiShieldLock' } },
  { id: 'nav-cast-controls', type: 'navigate', entityId: 'navigate.cast_controls', view: 'home', overrides: { name: 'Media Players', targetView: 'cast-controls', icon: 'mdiCast' } },
  { id: 'nav-cameras', type: 'navigate', entityId: 'navigate.cameras', view: 'home', overrides: { name: 'Cameras', targetView: 'cameras', icon: 'mdiVideo' } },
  { id: 'nav-weather', type: 'navigate', entityId: 'navigate.weather', view: 'home', overrides: { name: 'Weather Details', targetView: 'weather', icon: 'mdiWeatherPartlyCloudy' } },
  { id: 'nav-temp-monitor', type: 'navigate', entityId: 'navigate.temp_monitor', view: 'home', overrides: { name: 'Temp Sensors', targetView: 'temp-monitor-view', icon: 'mdiChartLine' } },
  { id: 'nav-network', type: 'navigate', entityId: 'navigate.network', view: 'home', overrides: { name: 'Network', targetView: 'network', icon: 'mdiLan' } },
  { id: 'nav-server', type: 'navigate', entityId: 'navigate.server_monitor', view: 'home', overrides: { name: 'Server Monitor', targetView: 'server', icon: 'mdiServer' } },
  { id: 'nav-cooking', type: 'navigate', entityId: 'navigate.cooking', view: 'home', overrides: { name: 'Cooking', targetView: 'cooking', icon: 'mdiGrill' } },
  { id: 'nav-map', type: 'navigate', entityId: 'navigate.map', view: 'home', overrides: { name: 'Locations', targetView: 'map', icon: 'mdiCrosshairsGps' } },

  // Family Room View
  { id: 'fr-temp', type: 'sensor', entityId: 'sensor.main_floor_temperature', view: 'familyroom', overrides: { name: 'Office Temp' } },
  { id: 'fr-motion', type: 'sensor', entityId: 'binary_sensor.family_room_motion', view: 'familyroom', overrides: { name: 'Motion' } },
  { id: 'fr-battery', type: 'sensor', entityId: 'sensor.main_floor_battery', view: 'familyroom', overrides: { name: 'Ecobee Battery' } },
  { id: 'fr-lights-all', type: 'light', entityId: 'light.family_room_lights', view: 'familyroom', overrides: { name: 'Overhead Lights' } },
  { id: 'fr-lights-couch', type: 'light', entityId: 'light.family_room_couch_lights', view: 'familyroom', overrides: { name: 'Couch Lights' } },
  { id: 'fr-lights-fireplace', type: 'light', entityId: 'light.fireplace_lights', view: 'familyroom', overrides: { name: 'Fireplace Light' } },
  { id: 'fr-lights-accent', type: 'light', entityId: 'light.family_room_accent_lights', view: 'familyroom', overrides: { name: 'Accent Lights' } },
  { id: 'fr-lights-lamps', type: 'light', entityId: 'light.family_room_lamps', view: 'familyroom', overrides: { name: 'Side Lamps' } },
  { id: 'fr-lights-tv', type: 'light', entityId: 'light.family_room_tv_lights', view: 'familyroom', overrides: { name: 'TV Backlight' } },
  { id: 'fr-shades', type: 'cover', entityId: 'cover.family_room_shades', view: 'familyroom', overrides: { name: 'Family Room Shades' } },
  { id: 'fr-remote-roku', type: 'remote', entityId: 'media_player.family_room_roku', view: 'familyroom', overrides: { name: 'Family Room Roku' } },
  { id: 'fr-remote-shield', type: 'remote', entityId: 'media_player.family_room_shield_adb', view: 'familyroom', overrides: { name: 'Family Room Shield' } },

  // Living Room View
  { id: 'lr-temp', type: 'sensor', entityId: 'sensor.thermostat_current_temperature', view: 'livingroom', overrides: { name: 'Living Room Temp' } },
  { id: 'lr-motion', type: 'sensor', entityId: 'binary_sensor.living_room_camera_tapo_motion_alarm', view: 'livingroom', overrides: { name: 'Motion' } },
  { id: 'lr-lights-front', type: 'light', entityId: 'light.living_room_front_row', view: 'livingroom', overrides: { name: 'Front Row Lights' } },
  { id: 'lr-lights-middle', type: 'light', entityId: 'light.living_room_middle_row', view: 'livingroom', overrides: { name: 'Middle Row Lights' } },
  { id: 'lr-lights-back', type: 'light', entityId: 'light.living_room_back_row', view: 'livingroom', overrides: { name: 'Back Row Lights' } },
  { id: 'lr-lights-lamp', type: 'light', entityId: 'light.living_room_lamp', view: 'livingroom', overrides: { name: 'Lamp' } },
  { id: 'lr-lights-accent', type: 'light', entityId: 'light.living_room_accent_lighting', view: 'livingroom', overrides: { name: 'All Accent Lights' } },
  { id: 'lr-lights-tv', type: 'light', entityId: 'light.living_room_tv_lights', view: 'livingroom', overrides: { name: 'TV Backlights' } },
  { id: 'lr-shades', type: 'cover', entityId: 'cover.bay_window_shades', view: 'livingroom', overrides: { name: 'Bay Window Shades' } },
  { id: 'lr-remote-lg', type: 'remote', entityId: 'media_player.living_room_display_webos', view: 'livingroom', overrides: { name: 'Living Room TV' } },

  // Kitchen View
  { id: 'kt-smoke', type: 'sensor', entityId: 'binary_sensor.kitchen_smoke_alarm', view: 'kitchen', overrides: { name: 'Smoke Alarm' } },
  { id: 'kt-smoke-battery', type: 'sensor', entityId: 'sensor.kitchen_smoke_alarm_battery', view: 'kitchen', overrides: { name: 'Smoke Alarm Battery' } },
  { id: 'kt-lights-all', type: 'light', entityId: 'light.kitchen_lights', view: 'kitchen', overrides: { name: 'All Lights' } },
  { id: 'kt-lights-fan', type: 'light', entityId: 'light.kitchen_fan_light', view: 'kitchen', overrides: { name: 'Fan Lights' } },
  { id: 'kt-lights-ceiling', type: 'light', entityId: 'light.kitchen_ceiling_lights', view: 'kitchen', overrides: { name: 'Overhead Lights' } },
  { id: 'kt-lights-island', type: 'light', entityId: 'light.kitchen_island_lights', view: 'kitchen', overrides: { name: 'Island Lights' } },
  { id: 'kt-lights-cabinet', type: 'light', entityId: 'light.kitchen_cabinet_lights', view: 'kitchen', overrides: { name: 'Cabinet Lights' } },
  { id: 'kt-fan', type: 'switch', entityId: 'fan.kitchen_ceiling', view: 'kitchen', overrides: { name: 'Ceiling Fan' } },

  // Master Bedroom View
  { id: 'mb-temp', type: 'sensor', entityId: 'sensor.master_bedroom_temperature', view: 'masterbedroom', overrides: { name: 'Temperature' } },
  { id: 'mb-motion', type: 'sensor', entityId: 'binary_sensor.master_bedroom_motion', view: 'masterbedroom', overrides: { name: 'Motion' } },
  { id: 'mb-smoke', type: 'sensor', entityId: 'binary_sensor.master_bedroom_smoke_alarm', view: 'masterbedroom', overrides: { name: 'Smoke Alarm' } },
  { id: 'mb-battery', type: 'sensor', entityId: 'sensor.master_bedroom_battery', view: 'masterbedroom', overrides: { name: 'Ecobee Battery' } },
  { id: 'mb-smoke-battery', type: 'sensor', entityId: 'sensor.master_bedroom_smoke_alarm_battery', view: 'masterbedroom', overrides: { name: 'Smoke Alarm Battery' } },
  { id: 'mb-lights-all', type: 'light', entityId: 'light.master_bedroom_lights', view: 'masterbedroom', overrides: { name: 'All Lights' } },
  { id: 'mb-lights-fan', type: 'light', entityId: 'light.master_bedroom_fan_lights', view: 'masterbedroom', overrides: { name: 'Overhead Light' } },
  { id: 'mb-lights-nightstands', type: 'light', entityId: 'light.master_bedroom_nightstands', view: 'masterbedroom', overrides: { name: 'Nightstands' } },
  { id: 'mb-lights-steve', type: 'light', entityId: 'light.steves_nightstand', view: 'masterbedroom', overrides: { name: "Steve's Nightstand" } },
  { id: 'mb-lights-laura', type: 'light', entityId: 'light.lauras_nightstand', view: 'masterbedroom', overrides: { name: "Laura's Nightstand" } },
  { id: 'mb-shades-vanity', type: 'cover', entityId: 'cover.vanity_side_shade', view: 'masterbedroom', overrides: { name: 'Vanity Shade' } },
  { id: 'mb-shades-bedside', type: 'cover', entityId: 'cover.bedside_shade', view: 'masterbedroom', overrides: { name: 'Bedside Shade' } },
  { id: 'mb-fan', type: 'switch', entityId: 'fan.master_bedroom_ceiling_fan', view: 'masterbedroom', overrides: { name: 'Ceiling Fan' } },
  { id: 'mb-remote-roku', type: 'remote', entityId: 'media_player.master_bedroom_roku', view: 'masterbedroom', overrides: { name: 'Master Bed Roku' } },

  // Nursery View
  { id: 'ns-temp', type: 'sensor', entityId: 'sensor.nursery_temperature', view: 'nursery', overrides: { name: 'Temperature' } },
  { id: 'ns-motion', type: 'sensor', entityId: 'binary_sensor.nursery_motion', view: 'nursery', overrides: { name: 'Motion' } },
  { id: 'ns-smoke', type: 'sensor', entityId: 'binary_sensor.nursery_smoke_alarm', view: 'nursery', overrides: { name: 'Smoke Alarm' } },
  { id: 'ns-battery', type: 'sensor', entityId: 'sensor.nursery_battery', view: 'nursery', overrides: { name: 'Ecobee Battery' } },
  { id: 'ns-smoke-battery', type: 'sensor', entityId: 'sensor.nursery_smoke_alarm_battery', view: 'nursery', overrides: { name: 'Smoke Alarm Battery' } },
  { id: 'ns-camera', type: 'camera', entityId: 'camera.nursery_mainstream', view: 'nursery', overrides: { name: 'Nursery Camera' } },
  { id: 'ns-lights-all', type: 'light', entityId: 'light.nursery_lights', view: 'nursery', overrides: { name: 'All Lights' } },
  { id: 'ns-lights-fan', type: 'light', entityId: 'light.nursery_ceiling_fan_light', view: 'nursery', overrides: { name: 'Overhead Light' } },
  { id: 'ns-lights-night', type: 'light', entityId: 'light.nursery_night_light', view: 'nursery', overrides: { name: 'Night Light' } },
  { id: 'ns-lights-rocker', type: 'light', entityId: 'light.nursery_rocker_light', view: 'nursery', overrides: { name: 'Rocker Light' } },
  { id: 'ns-shades', type: 'cover', entityId: 'cover.margot_s_window_shade', view: 'nursery', overrides: { name: 'Window Shade' } },
  { id: 'ns-fan', type: 'switch', entityId: 'fan.nursery_ceiling_fan', view: 'nursery', overrides: { name: 'Ceiling Fan' } },

  // Office View
  { id: 'of-temp', type: 'sensor', entityId: 'sensor.office_temperature', view: 'office', overrides: { name: 'Temperature' } },
  { id: 'of-motion', type: 'sensor', entityId: 'binary_sensor.office_motion', view: 'office', overrides: { name: 'Motion' } },
  { id: 'of-smoke', type: 'sensor', entityId: 'binary_sensor.office_smoke_alarm', view: 'office', overrides: { name: 'Smoke Alarm' } },
  { id: 'of-battery', type: 'sensor', entityId: 'sensor.office_ecobee_battery', view: 'office', overrides: { name: 'Ecobee Battery' } },
  { id: 'of-smoke-battery', type: 'sensor', entityId: 'sensor.office_smoke_alarm_battery', view: 'office', overrides: { name: 'Smoke Alarm Battery' } },
  { id: 'of-lights-all', type: 'light', entityId: 'light.office_lights', view: 'office', overrides: { name: 'All Lights' } },
  { id: 'of-lights-fan', type: 'light', entityId: 'light.office_fan_light', view: 'office', overrides: { name: 'Overhead Light' } },
  { id: 'of-lights-floor', type: 'light', entityId: 'light.office_floor_lamp', view: 'office', overrides: { name: 'Floor Lamp' } },
  { id: 'of-lights-torch', type: 'light', entityId: 'light.torch_lamp', view: 'office', overrides: { name: 'Torch Lights' } },
  { id: 'of-fan', type: 'switch', entityId: 'fan.office_ceiling_fan', view: 'office', overrides: { name: 'Ceiling Fan' } },

  // Guest Room View
  { id: 'gs-temp', type: 'sensor', entityId: 'sensor.guest_room_temperature', view: 'guest', overrides: { name: 'Temperature' } },
  { id: 'gs-motion', type: 'sensor', entityId: 'binary_sensor.guest_room_motion', view: 'guest', overrides: { name: 'Motion' } },
  { id: 'gs-smoke', type: 'sensor', entityId: 'binary_sensor.guest_room_smoke_alarm', view: 'guest', overrides: { name: 'Smoke Alarm' } },
  { id: 'gs-battery', type: 'sensor', entityId: 'sensor.guest_room_battery', view: 'guest', overrides: { name: 'Ecobee Battery' } },
  { id: 'gs-smoke-battery', type: 'sensor', entityId: 'sensor.guest_room_smoke_alarm_battery', view: 'guest', overrides: { name: 'Smoke Alarm Battery' } },
  { id: 'gs-lights-fan', type: 'light', entityId: 'light.guest_room_fan_light', view: 'guest', overrides: { name: 'Overhead Light' } },
  { id: 'gs-fan', type: 'switch', entityId: 'fan.guest_ceiling_fan', view: 'guest', overrides: { name: 'Ceiling Fan' } },

  // Basement View
  { id: 'bs-temp', type: 'sensor', entityId: 'sensor.basement_temperature', view: 'basement', overrides: { name: 'Temperature' } },
  { id: 'bs-motion', type: 'sensor', entityId: 'binary_sensor.basement_motion', view: 'basement', overrides: { name: 'Motion' } },
  { id: 'bs-smoke', type: 'sensor', entityId: 'binary_sensor.ring_smoke_co_listener_30877', view: 'basement', overrides: { name: 'Smoke Alarm' } },
  { id: 'bs-battery', type: 'sensor', entityId: 'sensor.basement_battery', view: 'basement', overrides: { name: 'Ecobee Battery' } },
  { id: 'bs-smoke-battery', type: 'sensor', entityId: 'sensor.basement_smoke_co_listener_battery', view: 'basement', overrides: { name: 'Smoke Battery' } },
  { id: 'bs-lights-overhead', type: 'light', entityId: 'light.overhead_basement_lights', view: 'basement', overrides: { name: 'Overhead Lights' } },
  { id: 'bs-lights-perimeter', type: 'light', entityId: 'light.basement_perimeter_lights', view: 'basement', overrides: { name: 'Perimeter' } },
  { id: 'bs-lights-couch', type: 'light', entityId: 'light.basement_couch_lights', view: 'basement', overrides: { name: 'Couch' } },
  { id: 'bs-lights-billiard', type: 'light', entityId: 'light.billiard_lights', view: 'basement', overrides: { name: 'Rear/Billiard' } },
  { id: 'bs-lights-lamp', type: 'light', entityId: 'light.basement_table_lamp', view: 'basement', overrides: { name: 'Table Lamp' } },
  { id: 'bs-lights-bar', type: 'light', entityId: 'light.basement_bar_lights', view: 'basement', overrides: { name: 'Bar' } },
  { id: 'bs-lights-stair', type: 'light', entityId: 'light.basement_stairwell_lights', view: 'basement', overrides: { name: 'Stairwell' } },
  { id: 'bs-lights-dino', type: 'light', entityId: 'light.dinosaur_lamp', view: 'basement', overrides: { name: 'Dino Lamp' } },
  { id: 'bs-lights-soft', type: 'light', entityId: 'light.basement_soft_lighting', view: 'basement', overrides: { name: 'Soft Lighting' } },
  { id: 'bs-theater-tv', type: 'light', entityId: 'light.theater_tv_backlights', view: 'basement', overrides: { name: 'Theater TV Lights' } },
  { id: 'bs-theater-wall', type: 'light', entityId: 'light.theater_accent_wall', view: 'basement', overrides: { name: 'Theater Accent Wall' } },
  { id: 'bs-remote-shield', type: 'remote', entityId: 'media_player.basement_shield_adb', view: 'basement', overrides: { name: 'Theater Shield' } },
  { id: 'bs-remote-lg', type: 'remote', entityId: 'media_player.basement_display_webos', view: 'basement', overrides: { name: 'Theater TV' } },

  // Outdoor View
  { id: 'out-driveway-motion', type: 'sensor', entityId: 'binary_sensor.driveway_camera_motion', view: 'outdoor', overrides: { name: 'Driveway Motion' } },
  { id: 'out-front-motion', type: 'sensor', entityId: 'binary_sensor.front_door_motion', view: 'outdoor', overrides: { name: 'Front Door Motion' } },
  { id: 'out-lights-front', type: 'light', entityId: 'light.outside_front_lights', view: 'outdoor', overrides: { name: 'Front Lights' } },
  { id: 'out-lights-garage', type: 'light', entityId: 'light.garage_ceiling_lights', view: 'outdoor', overrides: { name: 'Garage Lights' } },
  { id: 'out-garage-door', type: 'cover', entityId: 'cover.garage_door', view: 'outdoor', overrides: { name: 'Garage Door' } },

  // Master Bathroom View
  { id: 'mbt-temp', type: 'sensor', entityId: 'sensor.master_bathroom_temperature_temperature', view: 'masterbathroom', overrides: { name: 'Shower Temp' } },
  { id: 'mbt-humidity', type: 'sensor', entityId: 'sensor.master_bathroom_temperature_humidity', view: 'masterbathroom', overrides: { name: 'Shower Humidity' } },
  { id: 'mbt-battery', type: 'sensor', entityId: 'sensor.master_bathroom_temperature_battery', view: 'masterbathroom', overrides: { name: 'Battery State' } },
  { id: 'mbt-lights-shower', type: 'light', entityId: 'light.master_bath_shower_light', view: 'masterbathroom', overrides: { name: 'Shower Light' } },
  { id: 'mbt-lights-vanity', type: 'light', entityId: 'light.master_bath_vanity_lights', view: 'masterbathroom', overrides: { name: 'Vanity' } },
  { id: 'mbt-switch-closet', type: 'switch', entityId: 'switch.master_bath_closet_light', view: 'masterbathroom', overrides: { name: 'Closet Light' } },
  { id: 'mbt-fan', type: 'switch', entityId: 'fan.master_bath_shower_fan', view: 'masterbathroom', overrides: { name: 'Shower Fan' } },

  // Laundry Room View
  { id: 'lr-washer', type: 'sensor', entityId: 'sensor.washer_state', view: 'laundryroom', overrides: { name: 'Washer State' } },
  { id: 'lr-dryer', type: 'sensor', entityId: 'sensor.dryer_state', view: 'laundryroom', overrides: { name: 'Dryer State' } },
  { id: 'lr-lights-utility', type: 'switch', entityId: 'light.utility_room_light', view: 'laundryroom', overrides: { name: 'Ceiling Light' } },

  // Others View
  { id: 'oth-protect', type: 'adguard', entityId: 'switch.adguard_protection', view: 'notinrooms', overrides: { name: 'AdGuard Protection' } },

  // Remotes View
  { id: 'rem-fr-roku', type: 'remote', entityId: 'media_player.family_room_roku', view: 'remote-menu', overrides: { name: 'Family Room Roku' } },
  { id: 'rem-mb-roku', type: 'remote', entityId: 'media_player.master_bedroom_roku', view: 'remote-menu', overrides: { name: 'Master Bed Roku' } },
  { id: 'rem-fr-shield', type: 'remote', entityId: 'media_player.family_room_shield_adb', view: 'remote-menu', overrides: { name: 'Family Room Shield' } },
  { id: 'rem-bs-shield', type: 'remote', entityId: 'media_player.basement_shield_adb', view: 'remote-menu', overrides: { name: 'Theater Shield' } },
  { id: 'rem-lr-lg', type: 'remote', entityId: 'media_player.living_room_display_webos', view: 'remote-menu', overrides: { name: 'Living Room TV' } },
  { id: 'rem-bs-lg', type: 'remote', entityId: 'media_player.basement_display_webos', view: 'remote-menu', overrides: { name: 'Theater TV' } },

  // Heat/Cool View
  { id: 'hvac-thermostat', type: 'thermostat', entityId: 'climate.thermostat', view: 'hvac-controls', overrides: { name: 'House Thermostat' } },
  { id: 'hvac-nursery-humidifier', type: 'thermostat', entityId: 'humidifier.nursery_humidifier', view: 'hvac-controls', overrides: { name: 'Nursery Humidifier' } },
  { id: 'hvac-basement-purifier', type: 'switch', entityId: 'fan.basement_air_purifier', view: 'hvac-controls', overrides: { name: 'Basement Air Purifier' } },
  { id: 'hvac-family-purifier', type: 'switch', entityId: 'fan.family_room_air_purifier', view: 'hvac-controls', overrides: { name: 'Family Room Air Purifier' } },

  // 3D Printer View
  { id: 'prt-printer', type: 'printer', entityId: 'switch.3d_printer', view: '3dprinter', overrides: { name: 'OctoPrint Prusa' } },
  { id: 'prt-camera', type: 'camera', entityId: 'camera.maker_camera_mainstream', view: '3dprinter', overrides: { name: 'Prusa Camera' } },

  // Security View
  { id: 'sec-alarm', type: 'alarm', entityId: 'alarm_control_panel.823scd_alarm', view: 'security', overrides: { name: 'Ring Alarm System' } },
  { id: 'sec-siren', type: 'switch', entityId: 'switch.823scd_siren', view: 'security', overrides: { name: 'Siren' } },
  { id: 'sec-cam-active', type: 'switch', entityId: 'input_boolean.security_cameras_active', view: 'security', overrides: { name: 'Security Cameras Active' } },
  { id: 'sec-frig-det', type: 'switch', entityId: 'input_boolean.frigate_detection_active', view: 'security', overrides: { name: 'Frigate Detection Active' } },
  { id: 'sec-frig-rec', type: 'switch', entityId: 'input_boolean.frigate_recordings_active', view: 'security', overrides: { name: 'Frigate Recordings Active' } },
  { id: 'sec-doorbell', type: 'camera', entityId: 'camera.front_doorbell', view: 'security', overrides: { name: 'Front Doorbell' } },
  { id: 'sec-doorbell-act', type: 'sensor', entityId: 'sensor.front_doorbell_last_activity', view: 'security', overrides: { name: 'Doorbell Last Activity' } },
  { id: 'sec-lock', type: 'cover', entityId: 'lock.front_door_lock', view: 'security', overrides: { name: 'Front Door Lock' } },
  { id: 'sec-driveway', type: 'camera', entityId: 'camera.driveway_spotlight_camera', view: 'security', overrides: { name: 'Driveway Camera' } },
  { id: 'sec-driveway-act', type: 'sensor', entityId: 'sensor.driveway_spotlight_camera_last_activity', view: 'security', overrides: { name: 'Driveway Last Activity' } },
  { id: 'sec-driveway-siren', type: 'switch', entityId: 'switch.driveway_spotlight_camera_siren', view: 'security', overrides: { name: 'Driveway Siren' } },
  { id: 'sec-driveway-light', type: 'light', entityId: 'light.driveway_spotlight_camera_light', view: 'security', overrides: { name: 'Driveway Spotlight' } },
  { id: 'sec-garage', type: 'cover', entityId: 'cover.garage_door', view: 'security', overrides: { name: 'Garage Door' } },
  { id: 'sec-sensor-backdoor', type: 'sensor', entityId: 'binary_sensor.back_door', view: 'security', overrides: { name: 'Back Door' } },
  { id: 'sec-sensor-garage-side', type: 'sensor', entityId: 'binary_sensor.garage_side_door', view: 'security', overrides: { name: 'Garage Side Door' } },
  { id: 'sec-sensor-utility', type: 'sensor', entityId: 'binary_sensor.utility_room_door', view: 'security', overrides: { name: 'Utility Room Door' } },
  { id: 'sec-sensor-front', type: 'sensor', entityId: 'binary_sensor.front_door', view: 'security', overrides: { name: 'Front Door' } },
  { id: 'sec-sensor-ring-1', type: 'sensor', entityId: 'binary_sensor.ring_contact_sensor_55643', view: 'security', overrides: { name: 'Window Sensor 55643' } },
  { id: 'sec-sensor-ring-2', type: 'sensor', entityId: 'binary_sensor.ring_contact_sensor_47235', view: 'security', overrides: { name: 'Window Sensor 47235' } },

  // Media Players View
  { id: 'cst-active', type: 'media', entityId: 'media_player.family_room_roku', view: 'cast-controls', overrides: { name: 'Family Room Roku' } },
  { id: 'cst-shield', type: 'media', entityId: 'media_player.family_room_shield_adb', view: 'cast-controls', overrides: { name: 'Family Room Shield' } },
  { id: 'cst-bedroom', type: 'media', entityId: 'media_player.master_bedroom_roku', view: 'cast-controls', overrides: { name: 'Master Bedroom Roku' } },
  { id: 'cst-basement', type: 'media', entityId: 'media_player.basement_shield_adb', view: 'cast-controls', overrides: { name: 'Theater Shield' } },

  // Cameras View
  { id: 'cam-nursery', type: 'camera', entityId: 'camera.nursery_mainstream', view: 'cameras', overrides: { name: "Margot's Nursery" } },
  { id: 'cam-dining', type: 'camera', entityId: 'camera.dining_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Dining Room' } },
  { id: 'cam-living', type: 'camera', entityId: 'camera.living_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Living Room' } },
  { id: 'cam-family', type: 'camera', entityId: 'camera.family_room_camera_mainstream_2', view: 'cameras', overrides: { name: 'Family Room' } },
  { id: 'cam-play', type: 'camera', entityId: 'camera.basement_play_area_camera_mainstream', view: 'cameras', overrides: { name: 'Basement Play' } },
  { id: 'cam-theater', type: 'camera', entityId: 'camera.basement_theater_camera_mainstream', view: 'cameras', overrides: { name: 'Basement Theater' } },
  { id: 'cam-garage', type: 'camera', entityId: 'camera.garage_camera_mainstream', view: 'cameras', overrides: { name: 'Garage Camera' } },
  { id: 'cam-maker', type: 'camera', entityId: 'camera.maker_camera_mainstream', view: 'cameras', overrides: { name: '3D Printer Camera' } },

  // Weather View
  { id: 'wth-hourly', type: 'weather', entityId: 'weather.homehourly', view: 'weather', overrides: { name: 'Hourly Forecast' } },

  // Temperature Sensors View
  { id: 'tmp-chart', type: 'graph', entityId: 'sensor.thermostat_current_temperature', view: 'temp-monitor-view', overrides: { name: 'Living Room Temp History', color: '#60a5fa' } },
  { id: 'tmp-mbt-shower', type: 'graph', entityId: 'sensor.master_bathroom_shower_temperature_temperature', view: 'temp-monitor-view', overrides: { name: 'Master Bathroom Shower History', color: '#fbbf24' } },
  { id: 'tmp-freezer', type: 'graph', entityId: 'sensor.kitchen_freezer_sensor_temperature', view: 'temp-monitor-view', overrides: { name: 'Kitchen Freezer History', color: '#f87171' } },
  { id: 'tmp-filament', type: 'graph', entityId: 'sensor.filament_storage_sensor_temperature', view: 'temp-monitor-view', overrides: { name: 'Filament Storage Box History', color: '#34d399' } },
  { id: 'tmp-deep-freeze', type: 'graph', entityId: 'sensor.deep_freeze_sensor_temperature', view: 'temp-monitor-view', overrides: { name: 'Deep Freeze History', color: '#a78bfa' } },
  { id: 'tmp-bar-fridge', type: 'graph', entityId: 'sensor.bar_fridge_temperature', view: 'temp-monitor-view', overrides: { name: 'Bar Fridge History', color: '#fb7185' } },

  // Network View
  { id: 'net-adguard', type: 'adguard', entityId: 'switch.adguard_protection', view: 'network', overrides: { name: 'AdGuard Protection' } },

  // Server View
  { id: 'srv-ups-office', type: 'ups', entityId: 'sensor.office_ups_status', view: 'server', overrides: { name: 'Office UPS', prefix: 'office' } },
  { id: 'srv-ups-server', type: 'ups', entityId: 'sensor.server_ups_status', view: 'server', overrides: { name: 'Server UPS', prefix: 'server' } },
  { id: 'srv-printer', type: 'printer', entityId: 'switch.3d_printer', view: 'server', overrides: { name: 'OctoPrint Prusa' } },

  // Cooking View
  { id: 'ck-smoker', type: 'graph', entityId: 'sensor.meater_internal_temperature', view: 'cooking', overrides: { name: 'Smoker Temperature History', color: '#fbbf24' } },

  // Locations View
  { id: 'map-time1', type: 'sensor', entityId: 'sensor.steve_to_home', view: 'map', overrides: { name: 'Steve Drive Time to Home' } },
  { id: 'map-time2', type: 'sensor', entityId: 'sensor.laura_to_home', view: 'map', overrides: { name: 'Laura Drive Time to Home' } },

  // Car View
  { id: 'car-vehicle', type: 'car', entityId: 'sensor.fuel_level_es300h', view: 'car', overrides: { name: 'ES300h Hybrid' } },
];

const DEFAULT_LAYOUTS: ViewLayouts = {
  home: {
    lg: [
      { i: 'h-weather', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'h-thermostat', x: 2, y: 0, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'h-car', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
      { i: 'h-printer', x: 2, y: 3, w: 2, h: 2, minW: 2, minH: 2 },
      // Rooms Navigation (2 columns side-by-side)
      { i: 'nav-familyroom', x: 0, y: 5, w: 2, h: 1 },
      { i: 'nav-livingroom', x: 2, y: 5, w: 2, h: 1 },
      { i: 'nav-kitchen', x: 0, y: 6, w: 2, h: 1 },
      { i: 'nav-masterbedroom', x: 2, y: 6, w: 2, h: 1 },
      { i: 'nav-nursery', x: 0, y: 7, w: 2, h: 1 },
      { i: 'nav-office', x: 2, y: 7, w: 2, h: 1 },
      { i: 'nav-guest', x: 0, y: 8, w: 2, h: 1 },
      { i: 'nav-basement', x: 2, y: 8, w: 2, h: 1 },
      { i: 'nav-outdoor', x: 0, y: 9, w: 2, h: 1 },
      { i: 'nav-masterbathroom', x: 2, y: 9, w: 2, h: 1 },
      { i: 'nav-laundryroom', x: 0, y: 10, w: 2, h: 1 },
      { i: 'nav-others', x: 2, y: 10, w: 2, h: 1 },
      // Controls/Monitoring Navigation
      { i: 'nav-remote-menu', x: 0, y: 11, w: 2, h: 1 },
      { i: 'nav-hvac-controls', x: 2, y: 11, w: 2, h: 1 },
      { i: 'nav-3dprinter', x: 0, y: 12, w: 2, h: 1 },
      { i: 'nav-security', x: 2, y: 12, w: 2, h: 1 },
      { i: 'nav-cast-controls', x: 0, y: 13, w: 2, h: 1 },
      { i: 'nav-cameras', x: 2, y: 13, w: 2, h: 1 },
      { i: 'nav-weather', x: 0, y: 14, w: 2, h: 1 },
      { i: 'nav-temp-monitor', x: 2, y: 14, w: 2, h: 1 },
      { i: 'nav-network', x: 0, y: 15, w: 2, h: 1 },
      { i: 'nav-server', x: 2, y: 15, w: 2, h: 1 },
      { i: 'nav-cooking', x: 0, y: 16, w: 2, h: 1 },
      { i: 'nav-map', x: 2, y: 16, w: 2, h: 1 },
    ],
  },
  familyroom: {
    lg: [
      { i: 'fr-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'fr-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'fr-battery', x: 0, y: 2, w: 2, h: 2 },
      { i: 'fr-lights-all', x: 2, y: 2, w: 2, h: 2 },
      { i: 'fr-lights-couch', x: 0, y: 4, w: 2, h: 2 },
      { i: 'fr-lights-fireplace', x: 2, y: 4, w: 2, h: 2 },
      { i: 'fr-lights-accent', x: 0, y: 6, w: 2, h: 2 },
      { i: 'fr-lights-lamps', x: 2, y: 6, w: 2, h: 2 },
      { i: 'fr-lights-tv', x: 0, y: 8, w: 2, h: 2 },
      { i: 'fr-shades', x: 2, y: 8, w: 2, h: 2 },
      { i: 'fr-remote-roku', x: 0, y: 10, w: 2, h: 4 },
      { i: 'fr-remote-shield', x: 2, y: 10, w: 2, h: 4 },
    ],
  },
  livingroom: {
    lg: [
      { i: 'lr-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'lr-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'lr-lights-front', x: 0, y: 2, w: 2, h: 2 },
      { i: 'lr-lights-middle', x: 2, y: 2, w: 2, h: 2 },
      { i: 'lr-lights-back', x: 0, y: 4, w: 2, h: 2 },
      { i: 'lr-lights-lamp', x: 2, y: 4, w: 2, h: 2 },
      { i: 'lr-lights-accent', x: 0, y: 6, w: 2, h: 2 },
      { i: 'lr-lights-tv', x: 2, y: 6, w: 2, h: 2 },
      { i: 'lr-shades', x: 0, y: 8, w: 2, h: 2 },
      { i: 'lr-remote-lg', x: 2, y: 8, w: 2, h: 4 },
    ],
  },
  kitchen: {
    lg: [
      { i: 'kt-smoke', x: 0, y: 0, w: 2, h: 2 },
      { i: 'kt-smoke-battery', x: 2, y: 0, w: 2, h: 2 },
      { i: 'kt-lights-all', x: 0, y: 2, w: 2, h: 2 },
      { i: 'kt-lights-fan', x: 2, y: 2, w: 2, h: 2 },
      { i: 'kt-lights-ceiling', x: 0, y: 4, w: 2, h: 2 },
      { i: 'kt-lights-island', x: 2, y: 4, w: 2, h: 2 },
      { i: 'kt-lights-cabinet', x: 0, y: 6, w: 2, h: 2 },
      { i: 'kt-fan', x: 2, y: 6, w: 2, h: 2 },
    ],
  },
  masterbedroom: {
    lg: [
      { i: 'mb-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'mb-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'mb-smoke', x: 0, y: 2, w: 2, h: 2 },
      { i: 'mb-battery', x: 2, y: 2, w: 2, h: 2 },
      { i: 'mb-smoke-battery', x: 0, y: 4, w: 2, h: 2 },
      { i: 'mb-lights-all', x: 2, y: 4, w: 2, h: 2 },
      { i: 'mb-lights-fan', x: 0, y: 6, w: 2, h: 2 },
      { i: 'mb-lights-nightstands', x: 2, y: 6, w: 2, h: 2 },
      { i: 'mb-lights-steve', x: 0, y: 8, w: 2, h: 2 },
      { i: 'mb-lights-laura', x: 2, y: 8, w: 2, h: 2 },
      { i: 'mb-shades-vanity', x: 0, y: 10, w: 2, h: 2 },
      { i: 'mb-shades-bedside', x: 2, y: 10, w: 2, h: 2 },
      { i: 'mb-fan', x: 0, y: 12, w: 2, h: 2 },
      { i: 'mb-remote-roku', x: 2, y: 12, w: 2, h: 4 },
    ],
  },
  nursery: {
    lg: [
      { i: 'ns-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'ns-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'ns-smoke', x: 0, y: 2, w: 2, h: 2 },
      { i: 'ns-battery', x: 2, y: 2, w: 2, h: 2 },
      { i: 'ns-smoke-battery', x: 0, y: 4, w: 2, h: 2 },
      { i: 'ns-camera', x: 2, y: 4, w: 2, h: 2 },
      { i: 'ns-lights-all', x: 0, y: 6, w: 2, h: 2 },
      { i: 'ns-lights-fan', x: 2, y: 6, w: 2, h: 2 },
      { i: 'ns-lights-night', x: 0, y: 8, w: 2, h: 2 },
      { i: 'ns-lights-rocker', x: 2, y: 8, w: 2, h: 2 },
      { i: 'ns-shades', x: 0, y: 10, w: 2, h: 2 },
      { i: 'ns-fan', x: 2, y: 10, w: 2, h: 2 },
    ],
  },
  office: {
    lg: [
      { i: 'of-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'of-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'of-smoke', x: 0, y: 2, w: 2, h: 2 },
      { i: 'of-battery', x: 2, y: 2, w: 2, h: 2 },
      { i: 'of-smoke-battery', x: 0, y: 4, w: 2, h: 2 },
      { i: 'of-lights-all', x: 2, y: 4, w: 2, h: 2 },
      { i: 'of-lights-fan', x: 0, y: 6, w: 2, h: 2 },
      { i: 'of-lights-floor', x: 2, y: 6, w: 2, h: 2 },
      { i: 'of-lights-torch', x: 0, y: 8, w: 2, h: 2 },
      { i: 'of-fan', x: 2, y: 8, w: 2, h: 2 },
    ],
  },
  guest: {
    lg: [
      { i: 'gs-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'gs-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'gs-smoke', x: 0, y: 2, w: 2, h: 2 },
      { i: 'gs-battery', x: 2, y: 2, w: 2, h: 2 },
      { i: 'gs-smoke-battery', x: 0, y: 4, w: 2, h: 2 },
      { i: 'gs-lights-fan', x: 2, y: 4, w: 2, h: 2 },
      { i: 'gs-fan', x: 0, y: 6, w: 2, h: 2 },
    ],
  },
  basement: {
    lg: [
      { i: 'bs-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'bs-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'bs-smoke', x: 0, y: 2, w: 2, h: 2 },
      { i: 'bs-battery', x: 2, y: 2, w: 2, h: 2 },
      { i: 'bs-smoke-battery', x: 0, y: 4, w: 2, h: 2 },
      { i: 'bs-lights-overhead', x: 2, y: 4, w: 2, h: 2 },
      { i: 'bs-lights-perimeter', x: 0, y: 6, w: 2, h: 2 },
      { i: 'bs-lights-couch', x: 2, y: 6, w: 2, h: 2 },
      { i: 'bs-lights-billiard', x: 0, y: 8, w: 2, h: 2 },
      { i: 'bs-lights-lamp', x: 2, y: 8, w: 2, h: 2 },
      { i: 'bs-lights-bar', x: 0, y: 10, w: 2, h: 2 },
      { i: 'bs-lights-stair', x: 2, y: 10, w: 2, h: 2 },
      { i: 'bs-lights-dino', x: 0, y: 12, w: 2, h: 2 },
      { i: 'bs-lights-soft', x: 2, y: 12, w: 2, h: 2 },
      { i: 'bs-theater-tv', x: 0, y: 14, w: 2, h: 2 },
      { i: 'bs-theater-wall', x: 2, y: 14, w: 2, h: 2 },
      { i: 'bs-remote-shield', x: 0, y: 16, w: 2, h: 4 },
      { i: 'bs-remote-lg', x: 2, y: 16, w: 2, h: 4 },
    ],
  },
  outdoor: {
    lg: [
      { i: 'out-driveway-motion', x: 0, y: 0, w: 2, h: 2 },
      { i: 'out-front-motion', x: 2, y: 0, w: 2, h: 2 },
      { i: 'out-lights-front', x: 0, y: 2, w: 2, h: 2 },
      { i: 'out-lights-garage', x: 2, y: 2, w: 2, h: 2 },
      { i: 'out-garage-door', x: 0, y: 4, w: 2, h: 2 },
    ],
  },
  masterbathroom: {
    lg: [
      { i: 'mbt-temp', x: 0, y: 0, w: 2, h: 2 },
      { i: 'mbt-humidity', x: 2, y: 0, w: 2, h: 2 },
      { i: 'mbt-battery', x: 0, y: 2, w: 2, h: 2 },
      { i: 'mbt-lights-shower', x: 2, y: 2, w: 2, h: 2 },
      { i: 'mbt-lights-vanity', x: 0, y: 4, w: 2, h: 2 },
      { i: 'mbt-switch-closet', x: 2, y: 4, w: 2, h: 2 },
      { i: 'mbt-fan', x: 0, y: 6, w: 2, h: 2 },
    ],
  },
  laundryroom: {
    lg: [
      { i: 'lr-washer', x: 0, y: 0, w: 2, h: 2 },
      { i: 'lr-dryer', x: 2, y: 0, w: 2, h: 2 },
      { i: 'lr-lights-utility', x: 0, y: 2, w: 2, h: 2 },
    ],
  },
  notinrooms: {
    lg: [
      { i: 'oth-protect', x: 0, y: 0, w: 2, h: 2 },
    ],
  },
  'remote-menu': {
    lg: [
      { i: 'rem-fr-roku', x: 0, y: 0, w: 2, h: 4 },
      { i: 'rem-mb-roku', x: 2, y: 0, w: 2, h: 4 },
      { i: 'rem-fr-shield', x: 0, y: 4, w: 2, h: 4 },
      { i: 'rem-bs-shield', x: 2, y: 4, w: 2, h: 4 },
      { i: 'rem-lr-lg', x: 0, y: 8, w: 2, h: 4 },
      { i: 'rem-bs-lg', x: 2, y: 8, w: 2, h: 4 },
    ],
  },
  'hvac-controls': {
    lg: [
      { i: 'hvac-thermostat', x: 0, y: 0, w: 2, h: 3 },
      { i: 'hvac-nursery-humidifier', x: 2, y: 0, w: 2, h: 3 },
      { i: 'hvac-basement-purifier', x: 0, y: 3, w: 2, h: 2 },
      { i: 'hvac-family-purifier', x: 2, y: 3, w: 2, h: 2 },
    ],
  },
  '3dprinter': {
    lg: [
      { i: 'prt-printer', x: 0, y: 0, w: 2, h: 2 },
      { i: 'prt-camera', x: 2, y: 0, w: 2, h: 2 },
    ],
  },
  security: {
    lg: [
      { i: 'sec-alarm', x: 0, y: 0, w: 2, h: 4 },
      { i: 'sec-siren', x: 2, y: 0, w: 2, h: 2 },
      { i: 'sec-cam-active', x: 2, y: 2, w: 2, h: 2 },
      { i: 'sec-frig-det', x: 0, y: 4, w: 2, h: 2 },
      { i: 'sec-frig-rec', x: 2, y: 4, w: 2, h: 2 },
      { i: 'sec-doorbell', x: 0, y: 6, w: 2, h: 2 },
      { i: 'sec-doorbell-act', x: 2, y: 6, w: 2, h: 2 },
      { i: 'sec-lock', x: 0, y: 8, w: 2, h: 2 },
      { i: 'sec-driveway', x: 2, y: 8, w: 2, h: 2 },
      { i: 'sec-driveway-act', x: 0, y: 10, w: 2, h: 2 },
      { i: 'sec-driveway-siren', x: 2, y: 10, w: 2, h: 2 },
      { i: 'sec-driveway-light', x: 0, y: 12, w: 2, h: 2 },
      { i: 'sec-garage', x: 2, y: 12, w: 2, h: 2 },
      { i: 'sec-sensor-backdoor', x: 0, y: 14, w: 2, h: 2 },
      { i: 'sec-sensor-garage-side', x: 2, y: 14, w: 2, h: 2 },
      { i: 'sec-sensor-utility', x: 0, y: 16, w: 2, h: 2 },
      { i: 'sec-sensor-front', x: 2, y: 16, w: 2, h: 2 },
      { i: 'sec-sensor-ring-1', x: 0, y: 18, w: 2, h: 2 },
      { i: 'sec-sensor-ring-2', x: 2, y: 18, w: 2, h: 2 },
    ],
  },
  'cast-controls': {
    lg: [
      { i: 'cst-active', x: 0, y: 0, w: 2, h: 2 },
      { i: 'cst-shield', x: 2, y: 0, w: 2, h: 2 },
      { i: 'cst-bedroom', x: 0, y: 2, w: 2, h: 2 },
      { i: 'cst-basement', x: 2, y: 2, w: 2, h: 2 },
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
  weather: {
    lg: [
      { i: 'wth-hourly', x: 0, y: 0, w: 2, h: 2 },
    ],
  },
  'temp-monitor-view': {
    lg: [
      { i: 'tmp-chart', x: 0, y: 0, w: 2, h: 2 },
      { i: 'tmp-mbt-shower', x: 2, y: 0, w: 2, h: 2 },
      { i: 'tmp-freezer', x: 0, y: 2, w: 2, h: 2 },
      { i: 'tmp-filament', x: 2, y: 2, w: 2, h: 2 },
      { i: 'tmp-deep-freeze', x: 0, y: 4, w: 2, h: 2 },
      { i: 'tmp-bar-fridge', x: 2, y: 4, w: 2, h: 2 },
    ],
  },
  network: {
    lg: [
      { i: 'net-adguard', x: 0, y: 0, w: 2, h: 2 },
    ],
  },
  server: {
    lg: [
      { i: 'srv-ups-office', x: 0, y: 0, w: 2, h: 2 },
      { i: 'srv-ups-server', x: 2, y: 0, w: 2, h: 2 },
      { i: 'srv-printer', x: 0, y: 2, w: 2, h: 2 },
    ],
  },
  cooking: {
    lg: [
      { i: 'ck-smoker', x: 0, y: 0, w: 2, h: 2 },
    ],
  },
  map: {
    lg: [
      { i: 'map-time1', x: 0, y: 0, w: 2, h: 2 },
      { i: 'map-time2', x: 2, y: 0, w: 2, h: 2 },
    ],
  },
  car: {
    lg: [
      { i: 'car-vehicle', x: 0, y: 0, w: 2, h: 3 },
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
