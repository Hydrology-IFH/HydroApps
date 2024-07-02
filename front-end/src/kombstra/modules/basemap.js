import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { get as getProjection } from 'ol/proj.js';

import TileLayer from 'ol/layer/WebGLTile.js';
import OSM from 'ol/source/OSM.js';
import TileWMS from 'ol/source/TileWMS.js';

import { form } from './forms.js';
import { basemap as formBasemap } from './Form.vue';

proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4);
let basemap_proj = getProjection("EPSG:25832");

let basemap_sources = {
  basemap_grey: new TileWMS({
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    projection: basemap_proj,
    crossOrigin: '',
    attributions: '© GeoBasis-DE / <a href="https://www.bkg.bund.de" target="_blank">BKG</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>',
    params: {
      'LAYERS': 'de_basemapde_web_raster_grau',
      'TILED': false,
      'FORMAT': 'image/png',
      'VERSION': '1.3.0',
      "CRS": basemap_proj.code_,
      'SERVICE': 'WMS',
    }
  }),
  basemap_color: new TileWMS({
    url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
    projection: basemap_proj,
    crossOrigin: '',
    attributions: '© GeoBasis-DE / <a href="https://www.bkg.bund.de" target="_blank">BKG</a> / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>',
    params: {
      'LAYERS': 'de_basemapde_web_raster_farbe',
      'TILED': false,
      'FORMAT': 'image/png',
      'VERSION': '1.3.0',
      "CRS": basemap_proj.code_,
      'SERVICE': 'WMS',
    }
  }),
  osm: new OSM(),
}

let get_source = function(){
  return basemap_sources[formBasemap.value];
}

export const basemap = new TileLayer({
  title: 'Basemap',
  source: get_source()
});

export const create_basemap_updater = function(){
  form.inst.$watch("basemap", () => {
    basemap.setSource(get_source());
  });
}
