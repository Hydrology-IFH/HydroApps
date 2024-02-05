import { createApp } from 'vue';

import formComponent from './Form.vue';
import i18n from './i18n.js';

export const form = {};

export function createForm() {
  form.app = i18n(createApp(formComponent));
  form.inst = form.app.mount('#form-app');
}