import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WeatherData,
  Location,
  UserPreferences,
  TemperatureUnit,
  WindSpeedUnit,
} from "../types/weather";
import { weatherApi } from "../services/weatherApi";

interface WeatherState {
  // Weather data
  currentWeather: WeatherData | null;
  historicalWeather: WeatherData | null;
  loading: boolean;
  error: string | null;

  // Location
  currentLocation: Location | null;
  recentLocations: Location[];

  // User preferences
  preferences: UserPreferences;

  // Actions
  setCurrentWeather: (weather: WeatherData) => void;
  setHistoricalWeather: (weather: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentLocation: (location: Location) => void;
  addRecentLocation: (location: Location) => void;
  removeRecentLocation: (locationId: number) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;

  // Async actions
  fetchWeather: (
    latitude: number,
    longitude: number,
    timezone?: string,
    location?: Location
  ) => Promise<void>;
  fetchHistoricalWeather: (
    latitude: number,
    longitude: number,
    timezone?: string,
    location?: Location
  ) => Promise<void>;
  searchAndSetLocation: (query: string) => Promise<void>;
  getCurrentLocationWeather: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  theme: "auto",
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWeather: null,
      historicalWeather: null,
      loading: false,
      error: null,
      currentLocation: null,
      recentLocations: [],
      preferences: defaultPreferences,

      // Synchronous actions
      setCurrentWeather: (weather) => set({ currentWeather: weather }),
      setHistoricalWeather: (weather) => set({ historicalWeather: weather }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setCurrentLocation: (location) => set({ currentLocation: location }),

      addRecentLocation: (location) => {
        const { recentLocations } = get();
        const filtered = recentLocations.filter(
          (loc) => loc.id !== location.id
        );
        const updated = [location, ...filtered].slice(0, 5); // Keep only 5 recent locations
        set({ recentLocations: updated });
      },

      removeRecentLocation: (locationId) => {
        const { recentLocations } = get();
        const updated = recentLocations.filter((loc) => loc.id !== locationId);
        set({ recentLocations: updated });
      },

      setTemperatureUnit: (unit) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, temperatureUnit: unit } });
      },

      setWindSpeedUnit: (unit) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, windSpeedUnit: unit } });
      },

      setTheme: (theme) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, theme } });
      },

      // Async actions
      fetchWeather: async (
        latitude: number,
        longitude: number,
        timezone?: string,
        location?: Location
      ) => {
        const { setLoading, setError, setCurrentWeather } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await weatherApi.getCurrentWeather(
            latitude,
            longitude,
            timezone
          );

          // Use provided location or create a default one
          const locationData: Location = location || {
            id: Date.now(), // Generate a temporary ID
            name: "Unknown Location", // Will be updated when we have location data
            latitude: response.latitude,
            longitude: response.longitude,
            country: "Unknown",
            timezone: response.timezone,
          };

          const weatherData: WeatherData = {
            current: response.current,
            hourly: response.hourly,
            location: locationData,
          };

          setCurrentWeather(weatherData);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch weather data"
          );
        } finally {
          setLoading(false);
        }
      },

      fetchHistoricalWeather: async (
        latitude: number,
        longitude: number,
        timezone?: string,
        location?: Location
      ) => {
        const { setLoading, setError, setHistoricalWeather } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await weatherApi.getHistoricalWeather(
            latitude,
            longitude,
            timezone || "auto"
          );

          const locationData: Location = location || {
            id: Date.now(),
            name: "Unknown Location",
            latitude: response.latitude,
            longitude: response.longitude,
            country: "Unknown",
            timezone: response.timezone,
          };

          const weatherData: WeatherData = {
            current: response.current,
            hourly: response.hourly,
            location: locationData,
          };

          setHistoricalWeather(weatherData);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch historical weather data"
          );
        } finally {
          setLoading(false);
        }
      },

      searchAndSetLocation: async (query) => {
        const {
          setLoading,
          setError,
          setCurrentLocation,
          addRecentLocation,
          fetchWeather,
        } = get();

        try {
          setLoading(true);
          setError(null);

          const locations = await weatherApi.searchLocation(query);

          if (locations.length > 0) {
            const location = locations[0];
            const locationData: Location = {
              id: location.id,
              name: location.name,
              latitude: location.latitude,
              longitude: location.longitude,
              country: location.country,
              timezone: location.timezone || "UTC",
            };

            setCurrentLocation(locationData);
            addRecentLocation(locationData);
            await fetchWeather(
              location.latitude,
              location.longitude,
              "auto",
              locationData
            );
          } else {
            setError("Location not found");
          }
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to search location"
          );
        } finally {
          setLoading(false);
        }
      },

      getCurrentLocationWeather: async () => {
        const {
          setLoading,
          setError,
          setCurrentLocation,
          addRecentLocation,
          fetchWeather,
        } = get();

        try {
          setLoading(true);
          setError(null);

          const coords = await weatherApi.getCurrentLocation();

          // First, get the weather data to extract the timezone
          const weatherResponse = await weatherApi.getCurrentWeather(
            coords.latitude,
            coords.longitude,
            "auto"
          );

          // Try to get the location name using reverse geocoding
          let locationName = "Current Location";
          let country = "Unknown";

          try {
            // Use reverse geocoding to get the location name
            const locationInfo = await weatherApi.reverseGeocode(
              coords.latitude,
              coords.longitude
            );
            locationName = locationInfo.name;
            country = locationInfo.country;
            console.log("Found location:", locationName, country);
          } catch (geocodingError) {
            console.warn(
              "Could not get location name, using 'Current Location':",
              geocodingError
            );
          }

          const locationData: Location = {
            id: Date.now(),
            name: locationName,
            latitude: coords.latitude,
            longitude: coords.longitude,
            country: country,
            timezone: weatherResponse.timezone || "UTC",
          };

          setCurrentLocation(locationData);
          addRecentLocation(locationData);
          await fetchWeather(
            coords.latitude,
            coords.longitude,
            "auto",
            locationData
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to get current location"
          );
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        recentLocations: state.recentLocations,
        preferences: state.preferences,
      }),
    }
  )
);
