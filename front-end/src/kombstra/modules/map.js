import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';

import OSM from 'ol/source/OSM';
import { create_legend } from './legend.js';
import { radolan_layer, create_radolan_updater } from './radolan_layer.js';
import { create_hover } from './hover.js';

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

  create_radolan_updater();
  create_legend();
  create_hover();
}
