import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import de from '../locales/de.json'
import en from '../locales/en.json'

export const i18n = i18next.createInstance();

export function init_i18n() {
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en',
      supportedLngs: ['de', 'en'],
      resources: {
        de: { translation: de },
        en: { translation: en }
      },
      detection: {
        order: ['htmlTag']
      },
    });
};

// for vue apps
export function i13nVue (app) {
  app.use(I18NextVue, { i18next: i18n });
  return app
}