import './assets/style.css';
import 'ol/ol.css'
import 'vue3-openlayers/vue3-openlayers.css'
import "ol-ext/dist/ol-ext.css"

// import libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// I18n
import I18NextVue from 'i18next-vue'
import { i18n as i18next } from "./utils/i18n.js"

// vuetify
import { createVuetify } from 'vuetify'
import { vuetifyTheme } from '~~/styles/vuetifyTheme.js'

import App from './App.vue';

// create vue app
const app = createApp(App);

// use i18n
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
app.mount('#app');