import { createApp } from 'vue';

import formComponent from './TheParameterForm.vue';
import { i13nVue } from './i18n.js';

export const form = {};

export function createForm() {
  form.app = i13nVue(createApp(formComponent));
  form.inst = form.app.mount('#form-app');
}