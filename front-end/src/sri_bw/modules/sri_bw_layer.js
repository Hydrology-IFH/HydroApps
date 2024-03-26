import GeoTIFF from 'ol/source/GeoTIFF.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { get_style } from './styles.js';

import { form } from './forms.js';
import { parameter, opacity, year, event_rank, sri } from './Form.vue';
import { update_legend } from './legend.js';

// get the view file as openlayer source
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

  let tif_url = `/static/sri_bw/views/${parameter.value}_${slider_value.value}.tif`;

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
    projection: "EPSG:4326"
  });
  return source;
}

export const tif_source = get_tif_source();

// create layer
export const sri_bw_layer = new TileLayer({
  source: tif_source,
  zIndex: 2,
  style: get_style(),
  opacity: opacity.value/100,
});

// update layer function
export function create_form_updaters() {
  // grid updater
  function layer_updater() {
    sri_bw_layer.setSource(get_tif_source());
    sri_bw_layer.once("sourceready", () => sri_bw_layer.setStyle(get_style()));
    update_legend();
  }
  for (let vari of ["parameter", "year", "event_rank", "sri"]) {
    form.inst.$watch(vari, layer_updater);
  }
  // opacity updater
  form.inst.$watch('opacity', () => {
    sri_bw_layer.setOpacity(opacity.value / 100);
  });
}