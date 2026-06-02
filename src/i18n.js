import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationID from './locales/id.json';
import translationZH from './locales/zh.json';
import translationJA from './locales/ja.json';

const resources = {
  id: { translation: translationID },
  zh: { translation: translationZH },
  ja: { translation: translationJA }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // Bahasa default saat web pertama kali dibuka
    fallbackLng: 'id', // Bahasa cadangan jika terjemahan tidak ditemukan
    interpolation: {
      escapeValue: false // React sudah aman dari XSS
    }
  });

export default i18n;