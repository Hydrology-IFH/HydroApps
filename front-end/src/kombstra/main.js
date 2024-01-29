import './style.css';
import 'ol/ol.css';
import "ol-ext/control/Legend.css";

import { createForm } from './modules/forms.js';
import { create_map } from './modules/map.js';

createForm();
await create_map();

