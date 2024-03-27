import { Map, View } from 'ol';
import { get as getProjection, transformExtent, transform as transformCoords } from 'ol/proj.js';
import { buffer } from 'ol/extent';
import { basemap } from './basemap.js';
import { create_legend } from './legend.js';
import { sri_bw_layer, create_form_updaters } from './sri_bw_layer.js';
import { create_hover } from './hover.js';
import { create_popup } from './popup.js';
import { create_basemap_updater } from './basemap.js';
import { create_header } from './mapHeader.js';

export var map;

let map_proj = getProjection("EPSG:3857");

export async function create_map() {
  // create the map
  const init_tif_view = await sri_bw_layer.getSource().getView();
  let extent = transformExtent(
    init_tif_view.extent,
    init_tif_view.projection,
    map_proj)
  let buffer_extent = buffer(extent, 150000);
  buffer_extent[3] -= 120000;
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
  create_header();
  create_legend();
  create_hover();
  create_popup();
  create_basemap_updater();
  map.getTargetElement().classList.remove('spinner');
}
