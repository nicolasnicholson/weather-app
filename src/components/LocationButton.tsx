import React from 'react';
import { MapPin, Shuffle } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';
import { useTranslation } from 'react-i18next';

export const LocationButton: React.FC = () => {
  const { fetchByCoordinates, fetchRandomCity } = useWeatherStore();
  const { t } = useTranslation();

  const handleGetLocation = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        () => {
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
      fetchRandomCity();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleGetLocation}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <MapPin size={20} />
        <span>{t('location.button')}</span>
      </button>
      <button
        onClick={fetchRandomCity}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        <Shuffle size={20} />
        <span>{t('location.random')}</span>
      </button>
    </div>
  );
};