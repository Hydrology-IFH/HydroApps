import "~~/styles/uni-colors.css"
import "./assets/style.css"
import "~~/styles/olmap.css"

import 'vite/modulepreload-polyfill';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// I18n
import I18NextVue from 'i18next-vue'
import { i18n as i18next } from "./utils/i18n.js"

// vuetify
import { createVuetify } from 'vuetify'
import { vuetifyTheme } from '~~/styles/vuetifyTheme.js'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'

const app = createApp(App)

// use i18n
app.use(I18NextVue, { i18next });

// use pinia
app.use(createPinia())

// use vuetify
const vuetify = createVuetify({
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
})
app.use(vuetify)

// mount the app
app.mount('#app')