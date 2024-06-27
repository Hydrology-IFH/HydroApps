import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import i18n from '../common/utils/i18n.js';
import de from './locales/de.json'
import en from './locales/en.json'

const app = createApp(App)

// use i18n
i18n(app, "sfi_mockup", { de, en })

// use pinia
app.use(createPinia())

// mount the app
app.mount('#app')