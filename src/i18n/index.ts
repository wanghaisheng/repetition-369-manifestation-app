
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import zhCommon from './resources/zh/common.json';
import zhLanding from './resources/zh/landing.json';
import zhApp from './resources/zh/app.json';
import zhMarketing from './resources/zh/marketing.json';

import enCommon from './resources/en/common.json';
import enLanding from './resources/en/landing.json';
import enApp from './resources/en/app.json';
import enMarketing from './resources/en/marketing.json';

const resources = {
  zh: {
    common: zhCommon,
    landing: zhLanding,
    app: zhApp,
    marketing: zhMarketing,
  },
  en: {
    common: enCommon,
    landing: enLanding,
    app: enApp,
    marketing: enMarketing,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    defaultNS: 'common',
    ns: ['common', 'landing', 'app', 'marketing'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false, // Avoid suspense for SSR compatibility
    },
  });

export default i18n;
