import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj.js';
import { register } from 'ol/proj/proj4.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { get_style } from './styles.js';

import { formPara, formPerc, formRank } from './form.js';

let debug = false;

// found on https://www.spatialreference.org/ref/sr-org/7019/
// and adjusted for proj4js: https://github.com/proj4js/proj4js/issues/456
proj4.defs("SR-ORG:97019", '+proj=stere +lat_0=90 +lat_ts=60 +lon_0=10 +k=1 +x_0=0 +y_0=0 +a=6370040 +b=6370040 +to_meter=1000 +units=km +no_defs');
register(proj4);
const proj_radolan = getProjection("SR-ORG:97019");


export function get_tif_source(){
  // get tiff url
  let para = formPara.value;
  let perc = formPerc.value;
  let rank = formRank.value;
  let static_stem = "/static";
  let tif_url = `${static_stem}/kombstra/kombstra_views/${perc}_${rank}_${para}.tif`;
  let tif_blob;
  if (debug){
    tif_blob = fetch(tif_url).then(response => response.blob());
  }

  // create source
  let source = new GeoTIFF({
    sources: [
      {
        bands: [1],
        ...(debug? {blob:tif_blob}:{url:tif_url})
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
});