import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import OSM from 'ol/source/OSM.js';

import { create_legend } from './legend.js';
import { radolan_layer, create_form_updaters } from './radolan_layer.js';
import { create_hover } from './hover.js';
import { create_popup } from './popup.js';

export var map;

export async function create_map() {
  // create the map
  const init_tif_view = await radolan_layer.getSource().getView();
  map = new Map({
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
  map.on('loadstart', function () {
    map.getTargetElement().classList.add('spinner');
  });
  map.on('loadend', function () {
    map.getTargetElement().classList.remove('spinner');
  });
  map.getTargetElement().classList.add('spinner');

  create_form_updaters();
  create_legend();
  create_hover();
  create_popup();
  window.map = map;
  map.getTargetElement().classList.remove('spinner');
}
