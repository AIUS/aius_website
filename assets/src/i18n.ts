import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import XHRBackend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: true,
    returnNull: false,

    interpolation: {
      escapeValue: false
    },

    backend: {
      backends: [LocalStorageBackend, XHRBackend],
      backendOptions: [{
        versions: {
          fr: 'v0.1',
          en: 'v0.1',
          gsw: 'v0.1',
        },
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      }],
    }
  });

export default i18n;
