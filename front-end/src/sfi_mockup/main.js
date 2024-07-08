import "~~/styles/uni-colors.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import I18NextVue from 'i18next-vue'

// vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { vuetifyTheme } from '~~/styles/vuetifyTheme.js'

import { i18n as i18next } from "./utils/i18n.js"
import App from './App.vue'

const app = createApp(App)

// use i18n
// i18nVue(app, "sfi_mockup", { de, en })
app.use(I18NextVue, { i18next });

// use pinia
app.use(createPinia())

// initiate the vuetify instance
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'HydroAppsTheme',
    themes: {
      HydroAppsTheme: vuetifyTheme
    }
  }
})
app.use(vuetify)

// mount the app
app.mount('#app')