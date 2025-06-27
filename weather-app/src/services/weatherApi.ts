import axios from "axios";
import type {
  WeatherApiResponse,
  GeocodingResponse,
  Location,
} from "../types/weather";

const WEATHER_API_BASE = "https://api.open-meteo.com/v1";
const GEOCODING_API_BASE = "https://geocoding-api.open-meteo.com/v1";

// Cache for API responses
const weatherCache = new Map<
  string,
  { data: WeatherApiResponse; timestamp: number }
>();
const geocodingCache = new Map<
  string,
  { data: GeocodingResponse[]; timestamp: number }
>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedWeatherData = (key: string): WeatherApiResponse | null => {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedWeatherData = (key: string, data: WeatherApiResponse) => {
  weatherCache.set(key, { data, timestamp: Date.now() });
};

const getCachedGeocodingData = (key: string): GeocodingResponse[] | null => {
  const cached = geocodingCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedGeocodingData = (key: string, data: GeocodingResponse[]) => {
  geocodingCache.set(key, { data, timestamp: Date.now() });
};

export const weatherApi = {
  async getCurrentWeather(
    latitude: number,
    longitude: number,
    timezone: string = "auto"
  ): Promise<WeatherApiResponse> {
    const cacheKey = `weather_${latitude}_${longitude}_${timezone}`;
    const cached = getCachedWeatherData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHER_API_BASE}/forecast`, {
        params: {
          latitude,
          longitude,
          current: "temperature_2m,wind_speed_10m",
          hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
          timezone,
        },
      });

      setCachedWeatherData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
    }
  },

  async getHistoricalWeather(
    latitude: number,
    longitude: number,
    timezone: string = "auto"
  ): Promise<WeatherApiResponse> {
    const cacheKey = `historical_${latitude}_${longitude}_${timezone}`;
    const cached = getCachedWeatherData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WEATHER_API_BASE}/forecast`, {
        params: {
          latitude,
          longitude,
          past_days: 10,
          hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
          timezone,
        },
      });

      setCachedWeatherData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching historical weather data:", error);
      throw new Error("Failed to fetch historical weather data");
    }
  },

  async searchLocation(query: string): Promise<GeocodingResponse[]> {
    const cacheKey = `geocode_${query}`;
    const cached = getCachedGeocodingData(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${GEOCODING_API_BASE}/search`, {
        params: {
          name: query,
          count: 10,
          language: "en",
          format: "json",
        },
      });

      if (response.data.results) {
        setCachedGeocodingData(cacheKey, response.data.results);
        return response.data.results;
      }
      return [];
    } catch (error) {
      console.error("Error searching location:", error);
      throw new Error("Failed to search location");
    }
  },

  async getWeatherByLocation(location: Location): Promise<WeatherApiResponse> {
    return this.getCurrentWeather(
      location.latitude,
      location.longitude,
      location.timezone
    );
  },

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },

  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ name: string; country: string }> {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            addressdetails: 1,
            "accept-language": "en",
          },
          headers: {
            "User-Agent": "WeatherApp/1.0",
          },
        }
      );

      const data = response.data;
      let name = "Current Location";
      let country = "Unknown";

      if (data.address) {
        // Try to get the most specific location name
        name =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.suburb ||
          data.address.county ||
          data.address.state ||
          data.address.country ||
          "Current Location";

        country = data.address.country || "Unknown";
      }

      return { name, country };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return { name: "Current Location", country: "Unknown" };
    }
  },
};
