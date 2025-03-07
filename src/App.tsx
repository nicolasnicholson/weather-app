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
  const [city, setCity] = useState<string>(''); // Ahora se usa en el renderizado
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
    return dailyData.slice(0, 7);
  };

  const getWeather = async (city: string): Promise<WeatherData> => {
    const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.data;
  };

  const getForecast = async (city: string): Promise<ForecastData[]> => {
    const response = await axios.get(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
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
      setCity(weather.name); // Se asegura de que la ciudad se actualice correctamente
    } catch (error) {
      setError('Error fetching weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomCity = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    handleSearch(randomCity);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await axios.get(
                `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
              );
              const forecastResponse = await axios.get(
                `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
              );

              setWeatherData(response.data);
              setForecastData(groupForecastByDay(forecastResponse.data.list));
              setCity(response.data.name);
            },
            async () => {
              await handleSearch('New York'); // Si el usuario no otorga permisos, cargar NY por defecto
            }
          );
        } else {
          await handleSearch('New York');
        }
      } catch (error) {
        setError('Error fetching weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
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

          <section className="text-center mb-4">
            {/* {city && <p className="text-lg font-semibold">Current city: {city}</p>} */}
            {city ? "": ""}
          </section>

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
