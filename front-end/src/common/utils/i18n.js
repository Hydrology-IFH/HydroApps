import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import de from '../locales/de.json'
import en from '../locales/en.json'

// initialize i18next
export function initI18n(app_name, app_locales) {
  // load locales
  const rsrc = {de: {common: de}, en: {common: en}}
  rsrc.de[app_name] = app_locales.de
  rsrc.en[app_name] = app_locales.en

  // i18next initialization
  i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en',
      supportedLngs: ['de', 'en'],
      resources: rsrc,
      detection: {
        order: ['htmlTag']
      },
      ns: ['common', app_name],
      defaultNS: app_name
    });

  return i18next
}

