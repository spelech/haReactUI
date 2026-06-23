export interface ForecastDay {
  datetime: string;
  temperature: number;
  templow?: number;
  condition: string;
  precipitation?: number;
}

export interface WeatherProps {
  id: string;
  name: string;
  state: string;
  temperature: number;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  forecast?: ForecastDay[];
  stateText: string;
}

export const convertWeather = (entity: any): WeatherProps => {
  return {
    id: entity.entity_id,
    name: entity.attributes?.friendly_name || entity.entity_id,
    state: entity.state || 'cloudy',
    temperature: entity.attributes?.temperature || 21,
    humidity: entity.attributes?.humidity,
    windSpeed: entity.attributes?.wind_speed,
    pressure: entity.attributes?.pressure,
    forecast: entity.attributes?.forecast || [
      { datetime: new Date(Date.now() + 86400000).toISOString(), temperature: 24, templow: 16, condition: 'sunny' },
      { datetime: new Date(Date.now() + 172800000).toISOString(), temperature: 22, templow: 15, condition: 'cloudy' },
      { datetime: new Date(Date.now() + 259200000).toISOString(), temperature: 19, templow: 12, condition: 'rainy' },
      { datetime: new Date(Date.now() + 345600000).toISOString(), temperature: 20, templow: 14, condition: 'partlycloudy' },
      { datetime: new Date(Date.now() + 432000000).toISOString(), temperature: 23, templow: 16, condition: 'sunny' }
    ],
    stateText: `${entity.state || 'cloudy'} - ${entity.attributes?.temperature || 21}°`,
  };
};
