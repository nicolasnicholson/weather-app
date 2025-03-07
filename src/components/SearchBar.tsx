import React, { useState } from 'react';
import axios from 'axios';

interface City {
  name: string;
  country: string;
}

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=43cf0f68f70cdac1ae2ce6fdb407d1e8`
        );
        setSuggestions(response.data.map((city: any) => ({ name: city.name, country: city.country })));
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    onSearch(city);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a city..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(`${city.name}, ${city.country}`)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;