import { Map, View } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { get as getProjection, transformExtent, transform as transformCoords } from 'ol/proj.js';
import {buffer} from 'ol/extent';

import { basemap } from './basemap.js';
import { create_legend } from './legend.js';
import { sri_bw_layer, create_form_updaters } from './sri-bw_layer.js';
import { create_hover } from './hover.js';
import { create_popup } from './popup.js';
import { create_basemap_updater } from './basemap.js';

export var map;

proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
register(proj4);
let map_proj = getProjection("EPSG:3857");

export async function create_map() {
  // create the map
  const init_tif_view = await sri_bw_layer.getSource().getView();
  let extent = transformExtent(
    init_tif_view.extent,
    init_tif_view.projection,
    map_proj)
  let buffer_extent = buffer(extent, 80000);
  buffer_extent[3] -= 40000;
  map = new Map({
    target: 'map',
    layers: [
      sri_bw_layer,
      basemap
    ],
    view: new View({
      projection: map_proj,
      center: transformCoords(init_tif_view.center, init_tif_view.projection, map_proj),
      extent: buffer_extent,
      zoom: 7
    }),
  });

  // setup the spinner
  map.on('loadstart', function () {
    map.getTargetElement().classList.add('spinner');
  });
  map.on('loadend', function () {
    map.getTargetElement().classList.remove('spinner');
  });
  map.getTargetElement().classList.add('spinner');

  // create the map controls and updaters
  create_form_updaters();
  create_legend();
  create_hover();
  create_popup();
  create_basemap_updater();
  map.getTargetElement().classList.remove('spinner');
}
