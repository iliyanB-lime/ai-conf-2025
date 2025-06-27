import React from 'react';
import {
    Wind,
    Thermometer
} from 'lucide-react';
import { useWeatherStore } from '../../store/weatherStore';
import {
    convertTemperature,
    convertWindSpeed,
    formatTime
} from '../../utils/weatherUtils';

export const CurrentWeather: React.FC = () => {
    const { currentWeather, preferences } = useWeatherStore();

    if (!currentWeather) {
        return (
            <div className="weather-card animate-pulse">
                <div className="text-center text-white/70">
                    <p>No weather data available</p>
                    <p className="text-sm">Search for a location to get started</p>
                </div>
            </div>
        );
    }

    const { current, hourly, location } = currentWeather;
    const temperature = convertTemperature(current.temperature_2m, preferences.temperatureUnit);
    const windSpeed = convertWindSpeed(current.wind_speed_10m, preferences.windSpeedUnit);

    return (
        <div className="weather-card weather-gradient transition-all duration-500">
            {/* Location and Time */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                    {location.name}
                </h2>
                <p className="text-white/80 text-sm">
                    {formatTime(current.time, location.timezone)}
                </p>
            </div>

            {/* Main Weather Display */}
            <div className="flex items-center justify-center mb-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Thermometer size={64} className="text-white mr-4" />
                        <div>
                            <div className="text-6xl font-bold text-white">
                                {temperature}°
                            </div>
                            <div className="text-white/80 text-lg">
                                {preferences.temperatureUnit === 'celsius' ? 'C' : 'F'}
                            </div>
                        </div>
                    </div>
                    <p className="text-white text-lg font-medium">
                        Current Weather
                    </p>
                </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                        <Wind className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="text-white font-medium">{windSpeed}</div>
                    <div className="text-white/70 text-xs">
                        {preferences.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}
                    </div>
                    <div className="text-white/50 text-xs">Wind Speed</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                        <Thermometer className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="text-white font-medium">{temperature}°</div>
                    <div className="text-white/70 text-xs">
                        {preferences.temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
                    </div>
                    <div className="text-white/50 text-xs">Temperature</div>
                </div>
            </div>

            {/* Today's Hourly Breakdown */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Today's Hourly Breakdown</h4>
                <div className="grid grid-cols-6 gap-2">
                    {hourly.time.slice(0, 24).map((time, index) => {
                        const temp = convertTemperature(hourly.temperature_2m[index], preferences.temperatureUnit);
                        const humidity = hourly.relative_humidity_2m[index];
                        const hourTime = new Date(time).getHours();
                        const isCurrentHour = index === 0;

                        return (
                            <div key={time} className="text-center">
                                <div className={`text-xs ${isCurrentHour ? 'text-white font-bold' : 'text-white/70'}`}>
                                    {hourTime === 0 ? '12 AM' : hourTime === 12 ? '12 PM' : hourTime > 12 ? `${hourTime - 12} PM` : `${hourTime} AM`}
                                </div>
                                <div className={`text-sm font-medium ${isCurrentHour ? 'text-white' : 'text-white/80'}`}>
                                    {temp}°
                                </div>
                                <div className={`text-xs ${isCurrentHour ? 'text-white/80' : 'text-white/50'}`}>
                                    {humidity}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}; 