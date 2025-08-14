import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  cloudCover: number;
  description: string;
  location: string;
  timestamp: number;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const fetchWeatherData = useCallback(async (coords: LocationCoords) => {
    setIsLoading(true);
    setError(null);

    try {
      // Using OpenWeatherMap API (requires API key)
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error('Weather API key not configured');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      const weather: WeatherData = {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        visibility: data.visibility ? data.visibility / 1000 : 0, // Convert to km
        cloudCover: data.clouds?.all || 0,
        description: data.weather[0]?.description || 'Unknown',
        location: data.name || 'Unknown Location',
        timestamp: Date.now(),
      };

      setWeatherData(weather);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(`Location error: ${error.message}`);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 } // 5min cache
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
    }
  }, [fetchWeatherData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    refreshWeather();
    
    const interval = setInterval(() => {
      refreshWeather();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [refreshWeather]);

  return {
    weatherData,
    isLoading,
    error,
    lastUpdate,
    refreshWeather,
  };
};