import './style.css';
import 'ol/ol.css';
import "ol-ext/control/Legend.css";

import { create_legend } from './modules/legend.js';
import { create_radolan_updater } from './modules/radolan_layer.js';
import { create_map } from './modules/map.js';
import { map } from './modules/map.js';

await create_map();

