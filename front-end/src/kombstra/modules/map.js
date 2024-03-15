import { Map, View } from 'ol';

import { basemap } from './basemap.js';
import { create_legend } from './legend.js';
import { radolan_layer, create_form_updaters } from './radolan_layer.js';
import { create_hover } from './hover.js';
import { create_popup } from './popup.js';
import { create_basemap_updater } from './basemap.js';
import { create_header } from './mapHeader.js';

export var map;

export async function create_map() {
  // create the map
  const init_tif_view = await radolan_layer.getSource().getView();
  map = new Map({
    target: 'map',
    layers: [
      radolan_layer,
      basemap
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
  create_header();
  create_legend();
  create_hover();
  create_popup();
  create_basemap_updater();
  map.getTargetElement().classList.remove('spinner');
}
