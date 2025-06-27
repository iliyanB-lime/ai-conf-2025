import React, { useEffect } from 'react';
import {
    Thermometer,
    Wind,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { useWeatherStore } from '../../store/weatherStore';
import {
    convertTemperature,
    convertWindSpeed,
    formatDate,
    getDailyDataFromHourly
} from '../../utils/weatherUtils';

export const HistoricalWeather: React.FC = () => {
    const {
        currentWeather,
        historicalWeather,
        preferences,
        fetchHistoricalWeather
    } = useWeatherStore();

    useEffect(() => {
        if (currentWeather && !historicalWeather) {
            fetchHistoricalWeather(
                currentWeather.location.latitude,
                currentWeather.location.longitude,
                currentWeather.location.timezone
            );
        }
    }, [currentWeather, historicalWeather, fetchHistoricalWeather]);

    if (!currentWeather) {
        return (
            <div className="weather-card">
                <h3 className="text-xl font-bold text-white mb-4">Historical Weather</h3>
                <div className="text-center text-white/70">
                    <p>No location selected</p>
                </div>
            </div>
        );
    }

    if (!historicalWeather || !historicalWeather.hourly) {
        return (
            <div className="weather-card">
                <h3 className="text-xl font-bold text-white mb-4">Historical Weather</h3>
                <div className="text-center text-white/70">
                    <p>Loading historical data...</p>
                </div>
            </div>
        );
    }

    const { hourly, location } = historicalWeather;
    const dailyData = getDailyDataFromHourly(hourly);
    const currentDayData = getDailyDataFromHourly(currentWeather.hourly)[0];

    // Calculate temperature trends
    const temperatures = dailyData.map(day => ({
        max: day.maxTemp,
        min: day.minTemp,
        date: new Date(day.date)
    }));

    const avgMaxTemp = temperatures.reduce((sum, day) => sum + day.max, 0) / temperatures.length;
    const avgMinTemp = temperatures.reduce((sum, day) => sum + day.min, 0) / temperatures.length;

    const getTemperatureTrend = (current: number, average: number) => {
        const diff = current - average;
        if (Math.abs(diff) < 2) return 'normal';
        return diff > 0 ? 'above' : 'below';
    };

    const maxTrend = getTemperatureTrend(currentDayData.maxTemp, avgMaxTemp);
    const minTrend = getTemperatureTrend(currentDayData.minTemp, avgMinTemp);

    return (
        <div className="weather-card">
            <h3 className="text-xl font-bold text-white mb-6">Historical Weather (Last 10 Days)</h3>

            {/* Current vs Average */}
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h4 className="text-white font-medium mb-3">Today vs Average</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-white/70 text-sm">High Temperature</div>
                        <div className="text-white font-medium">
                            {convertTemperature(currentDayData.maxTemp, preferences.temperatureUnit)}°
                        </div>
                        <div className="flex items-center justify-center text-xs">
                            {maxTrend === 'above' && <TrendingUp className="h-3 w-3 text-green-400 mr-1" />}
                            {maxTrend === 'below' && <TrendingDown className="h-3 w-3 text-blue-400 mr-1" />}
                            <span className={maxTrend === 'above' ? 'text-green-400' : maxTrend === 'below' ? 'text-blue-400' : 'text-white/70'}>
                                {maxTrend === 'above' ? 'Above' : maxTrend === 'below' ? 'Below' : 'Normal'} average
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-white/70 text-sm">Low Temperature</div>
                        <div className="text-white font-medium">
                            {convertTemperature(currentDayData.minTemp, preferences.temperatureUnit)}°
                        </div>
                        <div className="flex items-center justify-center text-xs">
                            {minTrend === 'above' && <TrendingUp className="h-3 w-3 text-green-400 mr-1" />}
                            {minTrend === 'below' && <TrendingDown className="h-3 w-3 text-blue-400 mr-1" />}
                            <span className={minTrend === 'above' ? 'text-green-400' : minTrend === 'below' ? 'text-blue-400' : 'text-white/70'}>
                                {minTrend === 'above' ? 'Above' : minTrend === 'below' ? 'Below' : 'Normal'} average
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Data */}
            <div className="space-y-3">
                {dailyData.map((day, index) => {
                    const maxTemp = convertTemperature(day.maxTemp, preferences.temperatureUnit);
                    const minTemp = convertTemperature(day.minTemp, preferences.temperatureUnit);
                    const maxWindSpeed = convertWindSpeed(day.maxWindSpeed, preferences.windSpeedUnit);
                    const date = formatDate(day.hourlyData[0].time, location.timezone);
                    const isToday = index === 0;

                    return (
                        <div
                            key={day.date}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isToday
                                ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                                : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
                                }`}
                        >
                            {/* Date */}
                            <div className="flex-1">
                                <div className="text-white font-medium">
                                    {isToday ? 'Today' : date}
                                </div>
                                <div className="text-white/70 text-sm">
                                    Humidity: {day.avgHumidity}%
                                </div>
                            </div>

                            {/* Weather Icon */}
                            <div className="flex items-center mx-3">
                                <Thermometer size={28} className="text-white" />
                            </div>

                            {/* Temperature */}
                            <div className="text-right">
                                <div className="text-white font-medium">
                                    {maxTemp}° / {minTemp}°
                                </div>
                                <div className="text-white/70 text-xs">
                                    {preferences.temperatureUnit === 'celsius' ? 'C' : 'F'}
                                </div>
                            </div>

                            {/* Wind Speed */}
                            <div className="ml-3 text-right">
                                <div className="flex items-center text-white/70 text-sm">
                                    <Wind className="h-3 w-3 mr-1" />
                                    {maxWindSpeed}
                                </div>
                                <div className="text-white/50 text-xs">
                                    {preferences.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h4 className="text-white font-medium mb-3">Summary Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-white/70 text-sm">Avg High</div>
                        <div className="text-white font-medium">
                            {convertTemperature(avgMaxTemp, preferences.temperatureUnit)}°
                        </div>
                    </div>
                    <div>
                        <div className="text-white/70 text-sm">Avg Low</div>
                        <div className="text-white font-medium">
                            {convertTemperature(avgMinTemp, preferences.temperatureUnit)}°
                        </div>
                    </div>
                    <div>
                        <div className="text-white/70 text-sm">Avg Humidity</div>
                        <div className="text-white font-medium">
                            {Math.round(dailyData.reduce((sum, day) => sum + day.avgHumidity, 0) / dailyData.length)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-white/70 text-sm">Max Wind</div>
                        <div className="text-white font-medium">
                            {convertWindSpeed(Math.max(...dailyData.map(day => day.maxWindSpeed)), preferences.windSpeedUnit)}
                            {preferences.windSpeedUnit === 'kmh' ? ' km/h' : ' mph'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 