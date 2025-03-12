import React from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { Cloud, Sun, Wind, Droplets, Thermometer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WeatherDisplay: React.FC = () => {
  const { weather, loading, error } = useWeatherStore();
  const { t } = useTranslation();

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {weather.name}, {weather.sys.country}
        </h2>
        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {Math.round(weather.main.temp)}{t('units.celsius')}
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 capitalize">
          {weather.weather[0].description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Thermometer className="w-5 h-5" />
          <span>{t('weather.feelsLike')}: {Math.round(weather.main.feels_like)}{t('units.celsius')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Wind className="w-5 h-5" />
          <span>{t('weather.wind')}: {weather.wind.speed} {t('units.speed')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Droplets className="w-5 h-5" />
          <span>{t('weather.humidity')}: {weather.main.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          {weather.clouds ? <Cloud className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>
            {weather.clouds ? `${t('weather.clouds')}: ${weather.clouds.all}%` : t('weather.clearSky')}
          </span>
        </div>
      </div>
    </div>
  );
};