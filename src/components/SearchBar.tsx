import React, { useState, useEffect, useRef } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';
import { useTranslation } from 'react-i18next';
import { cities } from '../data/cities';

interface City {
  name: string;
  country: string;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { fetchWeather, fetchForecast, searchHistory, clearHistory } = useWeatherStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (cityName: string) => {
    if (cityName.trim()) {
      await fetchWeather(cityName);
      await fetchForecast(cityName);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const filteredCities = cities
        .filter(city => 
          city.name.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="w-full max-w-md relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder={t('search.placeholder')}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Search size={20} />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {suggestions.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleSearch(city.name)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
            >
              <span className="text-gray-900 dark:text-white">{city.name}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">{city.country}</span>
            </button>
          ))}
        </div>
      )}
      
      {searchHistory.length > 0 && (
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('search.recentSearches')}
            </h3>
            <button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 text-sm"
            >
              <Trash2 size={16} />
              {t('search.clearHistory')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {searchHistory.map((city) => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};