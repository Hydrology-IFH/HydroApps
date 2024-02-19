import './style.css';

import { createForm } from './modules/forms.js';
import { create_map } from './modules/map.js';
import { init_i18n } from './modules/i18n.js';

init_i18n();
createForm();
create_map();