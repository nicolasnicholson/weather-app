import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import ForecastCard from './components/ForecastCard';

const API_KEY = '43cf0f68f70cdac1ae2ce6fdb407d1e8'; // Reemplaza con tu API Key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cities = [
  'Tokyo', 'New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Moscow', 'Beijing', 'Cairo', 'Rio de Janeiro'
];

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

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const groupForecastByDay = (forecastList: any[]): ForecastData[] => {
    const dailyData = forecastList.reduce((acc: any[], item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
      if (!acc.find((day) => day.date === date)) {
        acc.push({ date, ...item });
      }
      return acc;
    }, []);
    return dailyData.slice(0, 7); // Mostrar solo 7 días
  };

  const getWeather = async (city: string): Promise<WeatherData> => {
    const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.data;
  };

  const getForecast = async (city: string): Promise<ForecastData[]> => {
    const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    return groupForecastByDay(response.data.list);
  };

  const getWeatherByLocation = async (lat: number, lon: number): Promise<WeatherData> => {
    const response = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.data;
  };

  const getForecastByLocation = async (lat: number, lon: number): Promise<ForecastData[]> => {
    const response = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return groupForecastByDay(response.data.list);
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError('');
    try {
      const weather = await getWeather(city);
      const forecast = await getForecast(city);
      setWeatherData(weather);
      setForecastData(forecast);
      setCity(city);
    } catch (error) {
      setError('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomCity = async () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    handleSearch(randomCity);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Obtener clima y pronóstico para la ubicación actual
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationWeather = await getWeatherByLocation(latitude, longitude);
            const locationForecast = await getForecastByLocation(latitude, longitude);
            setWeatherData(locationWeather);
            setForecastData(locationForecast);
            setCity(locationWeather.name);
          }, async () => {
            // Si el usuario no otorga permisos, cargar Nueva York por defecto
            const defaultWeather = await getWeather('New York');
            const defaultForecast = await getForecast('New York');
            setWeatherData(defaultWeather);
            setForecastData(defaultForecast);
            setCity('New York');
          });
        } else {
          // Si el navegador no soporta geolocalización, cargar Nueva York por defecto
          const defaultWeather = await getWeather('New York');
          const defaultForecast = await getForecast('New York');
          setWeatherData(defaultWeather);
          setForecastData(defaultForecast);
          setCity('New York');
        }
      } catch (error) {
        setError('Error fetching weather data. Please try again.');
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="container mx-auto p-4">
        <header>
          <h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>
        </header>
        <main>
          <section className="flex justify-center gap-2 mb-6">
            <SearchBar onSearch={handleSearch} />
            <button
              onClick={handleRandomCity}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Random City
            </button>
          </section>
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <section className="max-w-md mx-auto">
            {weatherData && <WeatherCard data={weatherData} />}
          </section>
          <section className="mt-6">
            <h2 className="text-xl text-center font-bold mb-4 uppercase">7-Day Forecast</h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              {forecastData.slice(0, 7).map((day, index) => (
                <ForecastCard key={index} data={day} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;