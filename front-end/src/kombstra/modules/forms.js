import { createApp } from 'vue';
import formComponent from './Form.vue';

export const form = {};

export function createForm() {
  form.app = createApp(formComponent);
  form.inst = form.app.mount('#form-app');
}

window.form = form;

// grid form
// const gridForm = document.getElementById('form_select_grid');
// const gridFormPara = gridForm.querySelector('select#parameter');
// const gridFormPerc = gridForm.querySelector('select#percentile');
// const gridFormRank = gridForm.querySelector('input#eventRank');

// // map form
// const mapForm = document.getElementById('form_map_settings');
// const mapFormOpacity = mapForm.querySelector('input#Opacity');

// dispatch submit event on change
// for (let el of [gridFormPara, gridFormPerc, gridFormRank, mapFormOpacity]) {
//   let form = el.form;
//   el.addEventListener('change', function(el) {
//     form.dispatchEvent(new Event('submit'));
//   });
// }

// export {gridFormPara, gridFormPerc, gridFormRank, gridForm, mapFormOpacity, mapForm};