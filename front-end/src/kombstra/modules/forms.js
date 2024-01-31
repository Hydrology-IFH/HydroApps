import { createApp } from 'vue';
import formComponent from './Form.vue';

export const form = {};

export function createForm() {
  form.app = createApp(formComponent);
  form.inst = form.app.mount('#form-app');
}