import React from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { useTranslation } from 'react-i18next';

export const ForecastDisplay: React.FC = () => {
  const { forecast } = useWeatherStore();
  const { t, i18n } = useTranslation();

  if (!forecast) return null;

  // Group forecast by day and ensure each day has exactly 4 time slots
  const dailyForecasts = forecast.list.reduce((acc: any, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString(i18n.language);
    if (!acc[date]) {
      acc[date] = [];
    }
    if (acc[date].length < 4) {
      acc[date].push(item);
    }
    return acc;
  }, {});

  // Filter out days that don't have exactly 4 time slots
  const completeForecasts = Object.entries(dailyForecasts).filter(([_, forecasts]: [string, any]) => forecasts.length === 4);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {t('forecast.title')}
      </h3>
      <div className="space-y-4">
        {completeForecasts.map(([date, forecasts]: [string, any]) => (
          <div
            key={date}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {new Date(forecasts[0].dt * 1000).toLocaleDateString(i18n.language, {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {forecasts.map((item: any) => (
                <div
                  key={item.dt}
                  className="text-center text-gray-600 dark:text-gray-300"
                >
                  <div className="text-sm">
                    {new Date(item.dt * 1000).toLocaleTimeString(i18n.language, {
                      hour: 'numeric',
                      hour12: true
                    })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                    className="w-12 h-12 mx-auto"
                    loading="lazy"
                  />
                  <div className="font-medium">
                    {Math.round(item.main.temp)}{t('units.celsius')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};