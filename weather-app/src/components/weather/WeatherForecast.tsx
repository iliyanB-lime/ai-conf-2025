import React from 'react';
import {
    Thermometer,
    Wind
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { useWeatherStore } from '../../store/weatherStore';
import {
    convertTemperature,
    convertWindSpeed,
    formatDate,
    getDailyDataFromHourly
} from '../../utils/weatherUtils';

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
    }>;
    label?: string;
}

export const WeatherForecast: React.FC = () => {
    const { currentWeather, preferences } = useWeatherStore();

    if (!currentWeather || !currentWeather.hourly) {
        return (
            <div className="weather-card">
                <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
                <div className="text-center text-white/70">
                    <p>No forecast data available</p>
                </div>
            </div>
        );
    }

    const { hourly, location } = currentWeather;
    const dailyData = getDailyDataFromHourly(hourly);

    // Prepare chart data
    const chartData = dailyData.slice(0, 7).map((day, index) => {
        const maxTemp = convertTemperature(day.maxTemp, preferences.temperatureUnit);
        const minTemp = convertTemperature(day.minTemp, preferences.temperatureUnit);
        const date = formatDate(day.hourlyData[0].time, location.timezone);

        return {
            day: index === 0 ? 'Today' : date,
            max: maxTemp,
            min: minTemp,
            avg: Math.round((maxTemp + minTemp) / 2),
            humidity: day.avgHumidity,
            windSpeed: convertWindSpeed(day.maxWindSpeed, preferences.windSpeedUnit)
        };
    });

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 text-white">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">High: {payload[0]?.value}°</p>
                    <p className="text-sm">Low: {payload[1]?.value}°</p>
                    <p className="text-sm">Humidity: {payload[2]?.value}%</p>
                    <p className="text-sm">Wind: {payload[3]?.value} {preferences.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="weather-card">
            <h3 className="text-xl font-bold text-white mb-6">7-Day Forecast</h3>

            {/* Temperature Chart */}
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <h4 className="text-white font-medium mb-4">Temperature Trend</h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="day"
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.7)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}°`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="max"
                                stroke="#EF4444"
                                strokeWidth={3}
                                fill="none"
                                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="min"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fill="none"
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-2">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-white/70 text-sm">High</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-white/70 text-sm">Low</span>
                    </div>
                </div>
            </div>

            {/* Detailed Forecast List */}
            <div className="space-y-4">
                {dailyData.slice(0, 7).map((day, index) => {
                    const maxTemp = convertTemperature(day.maxTemp, preferences.temperatureUnit);
                    const minTemp = convertTemperature(day.minTemp, preferences.temperatureUnit);
                    const maxWindSpeed = convertWindSpeed(day.maxWindSpeed, preferences.windSpeedUnit);
                    const date = formatDate(day.hourlyData[0].time, location.timezone);

                    return (
                        <div
                            key={day.date}
                            className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {/* Date */}
                            <div className="flex-1">
                                <div className="text-white font-medium">
                                    {index === 0 ? 'Today' : date}
                                </div>
                                <div className="text-white/70 text-sm">
                                    Humidity: {day.avgHumidity}%
                                </div>
                            </div>

                            {/* Weather Icon */}
                            <div className="flex items-center mx-4">
                                <Thermometer size={32} className="text-white" />
                            </div>

                            {/* Temperature */}
                            <div className="text-right">
                                <div className="text-white font-medium">
                                    {maxTemp}° / {minTemp}°
                                </div>
                                <div className="text-white/70 text-sm">
                                    {preferences.temperatureUnit === 'celsius' ? 'C' : 'F'}
                                </div>
                            </div>

                            {/* Wind Speed */}
                            <div className="ml-4 text-right">
                                <div className="flex items-center text-white/70 text-sm">
                                    <Wind className="h-4 w-4 mr-1" />
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
        </div>
    );
}; 