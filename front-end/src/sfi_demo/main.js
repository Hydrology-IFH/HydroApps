// import styles
import '~~/styles/olmap.css'
import "~~/styles/uni-colors.css"
import "./assets/style.css"

// import polyfill for module preload
import 'vite/modulepreload-polyfill';

// import libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// I18n
import I18NextVue from 'i18next-vue'
import { i18next } from "./utils/i18n.js"

// vuetify
import { vuetify } from '~~/utils/vuetify.js'

// primeVue
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import App from './App.vue'

const app = createApp(App)

// use i18n
app.use(I18NextVue, { i18next });

// use pinia
app.use(createPinia())

// initiate the vuetify instance
app.use(vuetify({ i18next }));

// use primeVue
app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: 'var(--uni-blue-20)',
          200: 'var(--uni-blue-40)',
          100: 'var(--uni-blue-20)',
          300: 'var(--uni-blue-40)',
          400: 'var(--uni-blue-60)',
          500: 'var(--uni-blue-60)',
          600: 'var(--uni-blue-80)',
          700: 'var(--uni-blue-80)',
          800: 'var(--uni-blue-100)',
          900: 'var(--uni-blue-100)',
          950: 'var(--uni-blue-100)'
        },
      },
      components: {
        popover: {
          shadow: '0 0 6px 2px var(--uni-blue-40)',
          border: {
            color: 'var(--uni-blue-60)'
          }
        }
      }
    })
  }
});

// mount the app
app.mount('#app')