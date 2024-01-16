import './style.css';
import 'ol/ol.css';
import "ol-ext/control/Legend.css";

import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';

import OSM from 'ol/source/OSM';
import { get_style } from './modules/styles.js';
import { form } from './modules/form.js';
import { create_legend, update_legend} from './modules/legend.js';
import { get_tif_source, radolan_layer } from './modules/radolan_layer.js';

// create the map
const init_tif_view = await radolan_layer.getSource().getView();
const map = new Map({
  target: 'map',
  layers: [
    radolan_layer,
    new TileLayer({
      source: new OSM(),
      projection: "EPSG:3857"
    })
  ],
  view: new View({
    projection: "SR-ORG:97019",
    center: init_tif_view.center,
    extent: init_tif_view.extent,
    showFullExtent: true,
    zoom: 7
  }),
});

// update function
function updateLayer() {
  let style = get_style();
  radolan_layer.setSource(get_tif_source());
  radolan_layer.setStyle(style);
  update_legend();
}
form.addEventListener(["submit"], updateLayer);

// get raster values at a point
function displayPixelValue(event) {
  console.log(radolan_layer.getData(event.pixel));
}
map.on(['click'], displayPixelValue);

// create legend
create_legend(map);

window.map = map;
window.form = form;
window.radolan_layer = radolan_layer;
window.get_style = get_style;
