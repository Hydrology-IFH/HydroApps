import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { de, en } from 'vuetify/locale'

import { vuetifyTheme } from '~~/styles/vuetifyTheme.js'

export const vuetify = ({ i18next }) => {
  return createVuetify({
    theme: {
      defaultTheme: 'HydroAppsTheme',
      themes: {
        HydroAppsTheme: vuetifyTheme
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    locale: {
      locale: i18next?.language || 'en',
      fallback: 'en',
      messages: { de, en }
    }
  })
}