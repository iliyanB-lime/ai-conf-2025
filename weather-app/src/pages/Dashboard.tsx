import React from 'react';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { WeatherForecast } from '../components/weather/WeatherForecast';
import { HistoricalWeather } from '../components/weather/HistoricalWeather';
import { useWeatherStore } from '../store/weatherStore';
import { Loader2, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { loading, error, currentWeather } = useWeatherStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Error loading weather data</p>
                    <p className="text-white/70">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentWeather) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Welcome to Weather App</h2>
                    <p className="text-white/70 mb-6">
                        Search for a city or use your current location to get started with weather information.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <h3 className="text-white font-medium mb-2">Features:</h3>
                        <ul className="text-white/70 text-sm space-y-1">
                            <li>• Current weather conditions</li>
                            <li>• 7-day weather forecast</li>
                            <li>• Historical weather data</li>
                            <li>• Temperature and unit preferences</li>
                            <li>• Location search and history</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Current Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CurrentWeather />
                <WeatherForecast />
            </div>

            {/* Historical Weather */}
            <HistoricalWeather />
        </div>
    );
}; 