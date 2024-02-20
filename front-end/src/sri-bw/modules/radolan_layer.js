import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj.js';
import { register } from 'ol/proj/proj4.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { get_style } from './styles.js';

// import { gridForm, gridFormPara, gridFormPerc, gridFormRank, mapForm, mapFormOpacity } from './forms.js';
import { form } from './forms.js';
import { parameter, opacity, year, event_rank, sri } from './Form.vue';
import { update_legend } from './legend.js';

// found on https://www.spatialreference.org/ref/sr-org/7019/
// and adjusted for proj4js: https://github.com/proj4js/proj4js/issues/456
proj4.defs("SR-ORG:97019", '+proj=stere +lat_0=90 +lat_ts=60 +lon_0=10 +k=1 +x_0=0 +y_0=0 +a=6370040 +b=6370040 +to_meter=1000 +units=km +no_defs');
register(proj4);
const proj_radolan = getProjection("SR-ORG:97019");

export function get_tif_source(){
  // get tiff url
  let slider_value;
  switch (parameter.value) {
    case 'Top_SRI_year':
      slider_value = year;
      break;
    case 'NEvents_above_SRI':
      slider_value = sri;
      break;
    default:
      slider_value = event_rank;
  }

  let tif_url = `/static/sri-bw/SRI-BW_views/${parameter.value}_${slider_value.value}.tif`;

  // create source
  let source = new GeoTIFF({
    sources: [
      {
        bands: [1],
        url: tif_url
      }
    ],
    sourceOptions: {
      allowFullFile: true,
    },
    interpolate: false,
    normalize: false,
  })
  source.projection = proj_radolan;
  return source;
}

export const tif_source = get_tif_source();

// create layer
export const radolan_layer = new TileLayer({
  source: tif_source,
  zIndex: 2,
  style: get_style(),
  opacity: opacity.value/100,
});

// update layer function
export function create_form_updaters() {
  // grid updater
  function layer_updater() {
    radolan_layer.setSource(get_tif_source());
    radolan_layer.once("sourceready", () => radolan_layer.setStyle(get_style()));
    update_legend();
  }
  for (let vari of ["parameter", "year", "event_rank", "sri"]) {
    form.inst.$watch(vari, layer_updater);
  }
  // opacity updater
  form.inst.$watch('opacity', () => {
    radolan_layer.setOpacity(opacity.value / 100);
  });
}
