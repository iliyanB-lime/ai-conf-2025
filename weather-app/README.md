# Weather Application

> **🤖 AI-Generated Application**  
> This entire weather application was generated using **vibe coding** with AI assistance. Not a single line of code was written manually - every component, utility, configuration, and feature was created through AI-powered development. This demonstrates the capabilities of modern AI coding tools in building complete, production-ready applications.

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. This application provides current weather conditions, 7-day forecasts, and historical weather data for any location using the Open-Meteo API and Nominatim for reverse geocoding.

## 🚀 AI Development Highlights

This project showcases the power of AI-assisted development:

- **Complete Codebase Generation**: Every file, component, and configuration was AI-generated
- **Zero Manual Coding**: No human-written code - entirely AI-created
- **Production-Ready Quality**: Built with best practices, proper TypeScript types, and modern React patterns
- **Complex Features**: Advanced features like debounced search, timezone handling, and interactive charts
- **Professional Architecture**: Clean project structure with proper separation of concerns
- **Real API Integration**: Full integration with multiple weather and geocoding APIs

## Features

### 🌤️ Current Weather
- Real-time temperature, humidity, wind speed, and direction
- Weather conditions with appropriate icons
- UV index with health recommendations
- Visibility and atmospheric pressure
- Precipitation data
- Dynamic background gradients based on weather conditions
- Accurate timezone-based time display

### 📅 7-Day Forecast
- **Interactive Temperature Chart**: Visual temperature trends with high/low temperature lines
- Daily high and low temperatures
- Weather conditions and icons
- Sunrise and sunset times
- Precipitation probability
- UV index summary
- Hourly breakdown for today
- Detailed daily forecast cards with humidity and wind data

### 📊 Historical Weather (Last 10 Days)
- Temperature trends and averages
- Comparison with current conditions
- Precipitation history
- Summary statistics
- Visual indicators for above/below average temperatures

### 🔍 Location Features
- **Smart Search**: Debounced search with real-time suggestions
- **Current Location**: Automatic location detection with reverse geocoding
- **Recent Locations**: Persistent history of searched locations
- **Geocoding**: Forward and reverse geocoding support
- **Timezone Support**: Proper timezone handling for accurate time display

### ⚙️ User Preferences
- Temperature unit toggle (Celsius/Fahrenheit)
- Wind speed unit toggle (km/h/mph)
- Persistent settings storage
- Theme preferences

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations and glassmorphism effects
- **State Management**: Zustand with persistence
- **Weather API**: Open-Meteo (free, no API key required)
- **Geocoding**: Open-Meteo Geocoding API + Nominatim for reverse geocoding
- **Icons**: Lucide React
- **Charts**: Recharts for interactive data visualization
- **Build Tool**: Vite
- **HTTP Client**: Axios with caching

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

This application uses multiple APIs to provide comprehensive weather and location services:

### Open-Meteo API
- **Current Weather**: Real-time weather data with timezone information
- **Forecast**: 7-day weather predictions
- **Historical Data**: Past 10 days of weather information
- **Geocoding**: Forward geocoding for location search

### Nominatim API (OpenStreetMap)
- **Reverse Geocoding**: Convert coordinates to location names
- **Address Details**: Comprehensive location information

### API Endpoints Used

- `https://api.open-meteo.com/v1/forecast` - Current weather and forecast
- `https://geocoding-api.open-meteo.com/v1/search` - Forward geocoding
- `https://nominatim.openstreetmap.org/reverse` - Reverse geocoding

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Search bar with debounced input
│   │   └── Layout.tsx          # Main layout wrapper
│   └── weather/
│       ├── CurrentWeather.tsx  # Current conditions display
│       ├── WeatherForecast.tsx # 7-day forecast
│       └── HistoricalWeather.tsx # Historical data
├── pages/
│   └── Dashboard.tsx           # Main dashboard page
├── services/
│   └── weatherApi.ts           # API service with caching
├── store/
│   └── weatherStore.ts         # Zustand store with persistence
├── types/
│   └── weather.ts              # TypeScript type definitions
├── utils/
│   └── weatherUtils.ts         # Utility functions and formatting
├── App.tsx                     # Main app component
└── main.tsx                    # App entry point
```

## Key Features Implementation

### Smart Search with Debouncing
- 300ms debounced search to prevent excessive API calls
- Real-time search suggestions
- Loading indicators during search
- Recent locations display

### Reverse Geocoding
- Automatic location name detection for current location
- Fallback to "Current Location" if geocoding fails
- Comprehensive address parsing (city, town, village, etc.)

### Timezone Handling
- Proper IANA timezone support
- Accurate local time display
- Fallback to UTC for invalid timezones
- Timezone-aware date/time formatting

### API Caching
- 10-minute cache for weather data
- Separate caching for geocoding results
- Automatic cache invalidation

## Key Components

### WeatherStore (Zustand)
- Centralized state management with persistence
- API integration with error handling
- User preferences management
- Location history with recent locations
- Loading and error states

### Weather API Service
- HTTP requests to multiple APIs
- Response caching with configurable duration
- Comprehensive error handling
- Forward and reverse geocoding support
- Timezone-aware data processing

### Weather Components
- **CurrentWeather**: Displays current conditions with dynamic backgrounds and proper time formatting
- **WeatherForecast**: 7-day forecast with hourly breakdown
- **HistoricalWeather**: Past weather data with trend analysis and comparisons

## Customization

### Styling
The application uses Tailwind CSS with custom utility classes:

- `.weather-card`: Glassmorphism card styling with backdrop blur
- `.weather-gradient`: Dynamic background gradients based on weather
- Custom animations and transitions
- Responsive design with mobile-first approach

### Weather Icons
Icons are mapped from WMO weather codes to Lucide React components with support for day/night variants.

### Units and Preferences
Temperature and wind speed units can be toggled and are persisted in localStorage with automatic conversion.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **API Caching**: 10-minute cache for API responses
- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Components load as needed
- **Optimized Icons**: SVG icons for fast loading
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling

## Recent Updates

### v1.1.0
- ✅ Fixed timezone issues causing app crashes
- ✅ Implemented debounced search to prevent UI blinking
- ✅ Added reverse geocoding for current location
- ✅ Improved location name display
- ✅ Enhanced error handling and fallbacks
- ✅ Added loading indicators for better UX

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather data
- [Nominatim](https://nominatim.org/) for reverse geocoding services
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Zustand](https://github.com/pmndrs/zustand) for state management
