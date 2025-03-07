import React from 'react';
import WeatherIcon from './WeatherIcon';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
  dt: number;
}

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-500';
    if (temp < 15) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatCondition = (condition: string) => {
    return condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const date = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">{data.name}</h2>
      <WeatherIcon condition={data.weather[0].main} className="w-16 h-16 mx-auto mb-2" />
      <p className={`text-4xl font-bold ${getTemperatureColor(data.main.temp)}`}>
        {Math.round(data.main.temp)}°C
      </p>
      <p className="text-lg text-gray-600">{formatCondition(data.weather[0].description)}</p>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">{date}</p>
        <div className="flex justify-center gap-4">
          <p className="text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Wind {data.wind.speed} m/s
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Pressure {data.main.pressure} hPa
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <p className="text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
            </svg>
            Humidity {data.main.humidity}%
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Cloudiness 0%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;