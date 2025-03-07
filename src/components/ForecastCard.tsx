import React from 'react';
import WeatherIcon from './WeatherIcon';

interface ForecastData {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
}

interface ForecastCardProps {
  data: ForecastData;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data }) => {
  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-500';
    if (temp < 15) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatCondition = (condition: string) => {
    return condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const day = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center w-32 h-32">
      <h3 className="text-md font-bold mb-1">{day}</h3>
      <WeatherIcon condition={data.weather[0].main} className="w-8 h-8 mx-auto mb-1" />
      <p className={`text-sm font-bold ${getTemperatureColor(data.main.temp)}`}>
        {Math.round(data.main.temp)}°C
      </p>
      <p className="text-xs font-semibold">{formatCondition(data.weather[0].description)}</p>
    </div>
  );
};

export default ForecastCard;