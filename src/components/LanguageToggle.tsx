import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { useWeatherStore } from '../store/weatherStore';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLanguage } = useWeatherStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
    >
      <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {i18n.language === 'en' ? 'EN' : 'ES'}
      </span>
    </button>
  );
};