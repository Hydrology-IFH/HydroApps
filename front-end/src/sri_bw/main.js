import './style.css';

import 'vite/modulepreload-polyfill';
import './polyfill/imageSmoothingEnabled.js';

import { createForm } from './modules/forms.js';
import { create_map } from './modules/map.js';
import { init_i18n } from './modules/i18n.js';
import { create_zoomer } from './modules/zoomer.js';

init_i18n();
createForm();
create_map();
create_zoomer();