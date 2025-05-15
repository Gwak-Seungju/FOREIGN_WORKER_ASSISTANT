// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cn from './locales/cn.json';
import en from './locales/en.json';
import id from './locales/id.json';
import ko from './locales/ko.json';
import th from './locales/th.json';
import vi from './locales/vi.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en', // 초기 언어 (예: 한국어)
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    th: { translation: th },
    vi: { translation: vi },
    cn: { translation: cn },
    id: { translation: id }
  },
});

export default i18n;