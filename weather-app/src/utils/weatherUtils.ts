import type {
  WeatherCode,
  TemperatureUnit,
  WindSpeedUnit,
} from "../types/weather";

export const weatherCodes: WeatherCode[] = [
  {
    code: 0,
    description: "Clear sky",
    icon: "sun",
    dayIcon: "sun",
    nightIcon: "moon",
  },
  {
    code: 1,
    description: "Mainly clear",
    icon: "cloud-sun",
    dayIcon: "cloud-sun",
    nightIcon: "cloud-moon",
  },
  {
    code: 2,
    description: "Partly cloudy",
    icon: "cloud",
    dayIcon: "cloud-sun",
    nightIcon: "cloud-moon",
  },
  {
    code: 3,
    description: "Overcast",
    icon: "cloud",
    dayIcon: "cloud",
    nightIcon: "cloud",
  },
  {
    code: 45,
    description: "Foggy",
    icon: "cloud-fog",
    dayIcon: "cloud-fog",
    nightIcon: "cloud-fog",
  },
  {
    code: 48,
    description: "Depositing rime fog",
    icon: "cloud-fog",
    dayIcon: "cloud-fog",
    nightIcon: "cloud-fog",
  },
  {
    code: 51,
    description: "Light drizzle",
    icon: "cloud-drizzle",
    dayIcon: "cloud-drizzle",
    nightIcon: "cloud-drizzle",
  },
  {
    code: 53,
    description: "Moderate drizzle",
    icon: "cloud-drizzle",
    dayIcon: "cloud-drizzle",
    nightIcon: "cloud-drizzle",
  },
  {
    code: 55,
    description: "Dense drizzle",
    icon: "cloud-drizzle",
    dayIcon: "cloud-drizzle",
    nightIcon: "cloud-drizzle",
  },
  {
    code: 56,
    description: "Light freezing drizzle",
    icon: "cloud-drizzle",
    dayIcon: "cloud-drizzle",
    nightIcon: "cloud-drizzle",
  },
  {
    code: 57,
    description: "Dense freezing drizzle",
    icon: "cloud-drizzle",
    dayIcon: "cloud-drizzle",
    nightIcon: "cloud-drizzle",
  },
  {
    code: 61,
    description: "Slight rain",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 63,
    description: "Moderate rain",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 65,
    description: "Heavy rain",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 66,
    description: "Light freezing rain",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 67,
    description: "Heavy freezing rain",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 71,
    description: "Slight snow",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 73,
    description: "Moderate snow",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 75,
    description: "Heavy snow",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 77,
    description: "Snow grains",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 80,
    description: "Slight rain showers",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 81,
    description: "Moderate rain showers",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 82,
    description: "Violent rain showers",
    icon: "cloud-rain",
    dayIcon: "cloud-rain",
    nightIcon: "cloud-rain",
  },
  {
    code: 85,
    description: "Slight snow showers",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 86,
    description: "Heavy snow showers",
    icon: "cloud-snow",
    dayIcon: "cloud-snow",
    nightIcon: "cloud-snow",
  },
  {
    code: 95,
    description: "Thunderstorm",
    icon: "cloud-lightning",
    dayIcon: "cloud-lightning",
    nightIcon: "cloud-lightning",
  },
  {
    code: 96,
    description: "Thunderstorm with slight hail",
    icon: "cloud-lightning",
    dayIcon: "cloud-lightning",
    nightIcon: "cloud-lightning",
  },
  {
    code: 99,
    description: "Thunderstorm with heavy hail",
    icon: "cloud-lightning",
    dayIcon: "cloud-lightning",
    nightIcon: "cloud-lightning",
  },
];

export const getWeatherInfo = (
  code: number,
  isDay: boolean = true
): WeatherCode => {
  const weatherInfo = weatherCodes.find((w) => w.code === code);
  if (!weatherInfo) {
    return {
      code,
      description: "Unknown",
      icon: "help-circle",
      dayIcon: "help-circle",
      nightIcon: "help-circle",
    };
  }
  return {
    ...weatherInfo,
    icon: isDay ? weatherInfo.dayIcon : weatherInfo.nightIcon,
  };
};

export const convertTemperature = (
  celsius: number,
  unit: TemperatureUnit
): number => {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const convertWindSpeed = (kmh: number, unit: WindSpeedUnit): number => {
  if (unit === "mph") {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
};

export const getWindDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const formatTime = (timeString: string, timezone: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
};

export const formatDate = (dateString: string, timezone: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  });
};

export const formatDateTime = (
  dateTimeString: string,
  timezone: string
): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
};

export const getUVIndexLevel = (
  uvIndex: number
): { level: string; color: string } => {
  if (uvIndex <= 2) return { level: "Low", color: "text-green-500" };
  if (uvIndex <= 5) return { level: "Moderate", color: "text-yellow-500" };
  if (uvIndex <= 7) return { level: "High", color: "text-orange-500" };
  if (uvIndex <= 10) return { level: "Very High", color: "text-red-500" };
  return { level: "Extreme", color: "text-purple-500" };
};

export const getWeatherGradient = (
  weatherCode: number,
  isDay: boolean
): string => {
  if (weatherCode >= 0 && weatherCode <= 3) {
    return isDay ? "weather-gradient-sunny" : "weather-gradient";
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return "weather-gradient-cloudy";
  }
  if (weatherCode >= 51 && weatherCode <= 99) {
    return "weather-gradient-rainy";
  }
  return "weather-gradient";
};

// Helper function to get daily data from hourly data
export const getDailyDataFromHourly = (hourlyData: {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}) => {
  const dailyData: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    avgHumidity: number;
    maxWindSpeed: number;
    hourlyData: Array<{
      time: string;
      temperature_2m: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
    }>;
  }> = [];

  const groupedByDay = new Map<
    string,
    Array<{
      time: string;
      temperature_2m: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
    }>
  >();

  // Group hourly data by day
  hourlyData.time.forEach((time, index) => {
    const date = new Date(time).toISOString().split("T")[0];
    if (!groupedByDay.has(date)) {
      groupedByDay.set(date, []);
    }
    groupedByDay.get(date)!.push({
      time,
      temperature_2m: hourlyData.temperature_2m[index],
      relative_humidity_2m: hourlyData.relative_humidity_2m[index],
      wind_speed_10m: hourlyData.wind_speed_10m[index],
    });
  });

  // Calculate daily statistics
  groupedByDay.forEach((hourlyDataForDay, date) => {
    const temperatures = hourlyDataForDay.map((h) => h.temperature_2m);
    const humidities = hourlyDataForDay.map((h) => h.relative_humidity_2m);
    const windSpeeds = hourlyDataForDay.map((h) => h.wind_speed_10m);

    dailyData.push({
      date,
      maxTemp: Math.max(...temperatures),
      minTemp: Math.min(...temperatures),
      avgHumidity: Math.round(
        humidities.reduce((a, b) => a + b, 0) / humidities.length
      ),
      maxWindSpeed: Math.max(...windSpeeds),
      hourlyData: hourlyDataForDay,
    });
  });

  return dailyData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
