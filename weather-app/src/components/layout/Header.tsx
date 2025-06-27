import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Settings, Menu, X } from 'lucide-react';
import { useWeatherStore } from '../../store/weatherStore';
import type { Location } from '../../types/weather';

export const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const {
        recentLocations,
        searchAndSetLocation,
        getCurrentLocationWeather,
        loading
    } = useWeatherStore();

    // Debounced search function
    const debouncedSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            const { weatherApi } = await import('../../services/weatherApi');
            const locations = await weatherApi.searchLocation(query);

            const locationData: Location[] = locations.map(location => ({
                id: location.id,
                name: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                country: location.country,
                timezone: location.timezone || 'UTC',
            }));

            setSearchResults(locationData);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for debounced search
        debounceTimeoutRef.current = setTimeout(() => {
            debouncedSearch(query);
        }, 300); // 300ms delay
    };

    const handleLocationSelect = async (location: Location) => {
        try {
            await searchAndSetLocation(location.name);
            setShowSearch(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Location selection error:', error);
        }
    };

    const handleCurrentLocation = async () => {
        try {
            await getCurrentLocationWeather();
            setShowMenu(false);
        } catch (error) {
            console.error('Current location error:', error);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-white">Weather App</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a city..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setShowSearch(true)}
                                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
                            {searchLoading && (
                                <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results */}
                        {showSearch && (searchQuery.length > 0 || recentLocations.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="p-2">
                                        <h3 className="text-sm font-medium text-white/70 px-2 py-1">Search Results</h3>
                                        {searchResults.map((location) => (
                                            <button
                                                key={location.id}
                                                onClick={() => handleLocationSelect(location)}
                                                className="w-full text-left px-2 py-2 hover:bg-white/10 rounded flex items-center space-x-2"
                                            >
                                                <MapPin className="h-4 w-4 text-white/70" />
                                                <span className="text-white">{location.name}</span>
                                                {location.country && (
                                                    <span className="text-white/50 text-sm">({location.country})</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Recent Locations */}
                                {recentLocations.length > 0 && searchResults.length === 0 && (
                                    <div className="p-2">
                                        <h3 className="text-sm font-medium text-white/70 px-2 py-1">Recent Locations</h3>
                                        {recentLocations.map((location) => (
                                            <button
                                                key={location.id}
                                                onClick={() => handleLocationSelect(location)}
                                                className="w-full text-left px-2 py-2 hover:bg-white/10 rounded flex items-center space-x-2"
                                            >
                                                <MapPin className="h-4 w-4 text-white/70" />
                                                <span className="text-white">{location.name}</span>
                                                {location.country && (
                                                    <span className="text-white/50 text-sm">({location.country})</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No results message */}
                                {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                                    <div className="p-4 text-center text-white/50">
                                        No locations found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-white hover:text-white/80 p-2"
                        >
                            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={handleCurrentLocation}
                            disabled={loading}
                            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <MapPin className="h-4 w-4" />
                            <span>Current Location</span>
                        </button>
                        <button className="text-white hover:text-white/80 p-2">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMenu && (
                    <div className="md:hidden border-t border-white/20 py-4">
                        <div className="space-y-2">
                            <button
                                onClick={handleCurrentLocation}
                                disabled={loading}
                                className="w-full flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <MapPin className="h-4 w-4" />
                                <span>Current Location</span>
                            </button>
                            <button className="w-full flex items-center space-x-2 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}; 