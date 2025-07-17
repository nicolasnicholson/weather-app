import React, { useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ForecastDisplay } from './components/ForecastDisplay';
import { LocationButton } from './components/LocationButton';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useWeatherStore } from './store/weatherStore';
import './i18n';

function App() {
  const { t } = useTranslation();
  const { fetchByCoordinates, fetchRandomCity } = useWeatherStore();

  useEffect(() => {
    // Add timeout to prevent hanging on mobile
    const locationTimeout = setTimeout(() => {
      fetchRandomCity();
    }, 5000);

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          fetchByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        () => {
          clearTimeout(locationTimeout);
          // If user denies location permission, fetch random city
          fetchRandomCity();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000
        }
      );
    } else {
      clearTimeout(locationTimeout);
      fetchRandomCity();
    }

    return () => clearTimeout(locationTimeout);
  }, [fetchByCoordinates, fetchRandomCity]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 mb-8">
          <SearchBar />
          <LocationButton />
        </div>

        <div className="max-w-2xl mx-auto">
          <WeatherDisplay />
          <ForecastDisplay />
        </div>
      </div>
    </div>
  );
}

export default App;