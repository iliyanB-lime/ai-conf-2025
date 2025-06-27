export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  wind_speed_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  location: Location;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    wind_speed_10m: string;
  };
  current: CurrentWeather;
  hourly_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
  hourly: HourlyWeather;
}

export interface GeocodingResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "mph";

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: "light" | "dark" | "auto";
}

export interface WeatherCode {
  code: number;
  description: string;
  icon: string;
  dayIcon: string;
  nightIcon: string;
}
