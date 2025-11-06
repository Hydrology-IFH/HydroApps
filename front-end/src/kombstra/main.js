import './assets/style.css';
import '~~/styles/olmap.css';

// import libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// I18n
import I18NextVue from 'i18next-vue'
import { i18next } from "./utils/i18n.js"

import App from './App.vue';

// create vue app
const app = createApp(App);

// use i18n
app.use(I18NextVue, { i18next });

// use pinia
app.use(createPinia())

// mount the app
app.mount('#app');