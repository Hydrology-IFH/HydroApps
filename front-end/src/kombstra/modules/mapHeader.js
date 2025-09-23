import MapHeader from "./TheMapHeader.vue";
import { createApp } from 'vue';
import { i13nVue } from './i18n.js';

export function create_header() {
  i13nVue(createApp(MapHeader)).mount('#map-header');
}