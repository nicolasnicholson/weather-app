import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, ForecastData } from '../types/weather';
import axios from 'axios';

interface WeatherStore {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  language: string;
  searchHistory: string[];
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  fetchWeather: (city: string) => Promise<void>;
  fetchForecast: (city: string) => Promise<void>;
  fetchByCoordinates: (lat: number, lon: number) => Promise<void>;
  fetchRandomCity: () => Promise<void>;
  addToHistory: (city: string) => void;
  clearHistory: () => void;
}

const API_KEY = '43cf0f68f70cdac1ae2ce6fdb407d1e8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const RANDOM_CITIES = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney',
  'Berlin', 'Rome', 'Madrid', 'Moscow', 'Dubai',
  'Singapore', 'Toronto', 'Mumbai', 'Hong Kong', 'Seoul'
];

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      weather: null,
      forecast: null,
      loading: false,
      error: null,
      darkMode: systemPrefersDark,
      language: 'en',
      searchHistory: [],

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setLanguage: (lang: string) => {
        set({ language: lang });
      },

      fetchWeather: async (city: string) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.get(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${get().language}`,
            { timeout: 10000 }
          );
          set({ weather: response.data });
          get().addToHistory(city);
        } catch (error) {
          set({ error: 'Error fetching weather data' });
        } finally {
          set({ loading: false });
        }
      },

      fetchForecast: async (city: string) => {
        try {
          const response = await axios.get(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=${get().language}`,
            { timeout: 10000 }
          );
          set({ forecast: response.data });
        } catch (error) {
          set({ error: 'Error fetching forecast data' });
        }
      },

      fetchByCoordinates: async (lat: number, lon: number) => {
        try {
          set({ loading: true, error: null });
          const weatherResponse = await axios.get(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${get().language}`,
            { timeout: 10000 }
          );
          const forecastResponse = await axios.get(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${get().language}`,
            { timeout: 10000 }
          );
          set({ 
            weather: weatherResponse.data,
            forecast: forecastResponse.data,
            loading: false 
          });
        } catch (error) {
          set({ error: 'Error fetching weather data', loading: false });
        }
      },

      fetchRandomCity: async () => {
        const randomCity = RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)];
        await get().fetchWeather(randomCity);
        await get().fetchForecast(randomCity);
      },

      addToHistory: (city: string) => {
        set((state) => {
          const newHistory = [
            city,
            ...state.searchHistory.filter((c) => c !== city)
          ].slice(0, 5);
          return { searchHistory: newHistory };
        });
      },

      clearHistory: () => {
        set({ searchHistory: [] });
      },
    }),
    {
      name: 'weather-store',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        language: state.language,
        searchHistory: state.searchHistory
      })
    }
  )
);