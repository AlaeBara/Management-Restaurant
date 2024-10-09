import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';
import translationFR from './locales/fr.json'; 

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
  fr: {
    translation: translationFR, 
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Set French as the default language
    fallbackLng: 'fr', // Use French as the fallback language
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
