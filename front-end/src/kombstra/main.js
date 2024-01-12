import './style.css';
import 'ol/ol.css';
import "ol-ext/control/Legend.css";

import {Map, View} from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import proj4 from 'proj4';
import {get as getProjection} from 'ol/proj.js';
import { register } from 'ol/proj/proj4.js';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import OSM from 'ol/source/OSM';
import get_style from './styles.js';
import { form, formPara, formPerc, formRank } from './form.js';
// import Legend as LegendCont from "ol/control";
// import Legend from "ol/legend";
import Legend from "ol-ext/legend/Legend";
import LegendCtrl from "ol-ext/control/Legend";

let debug = false;

// found on https://www.spatialreference.org/ref/sr-org/7019/
// and adjusted for proj4js: https://github.com/proj4js/proj4js/issues/456
proj4.defs("SR-ORG:97019", '+proj=stere +lat_0=90 +lat_ts=60 +lon_0=10 +k=1 +x_0=0 +y_0=0 +a=6370040 +b=6370040 +to_meter=1000 +units=km +no_defs');
register(proj4);
const proj_radolan = getProjection("SR-ORG:97019");


let get_tif_source = function(){
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
let tif_source = get_tif_source();
const init_tif_view = await tif_source.getView();

// create layer
let radolan_layer = new TileLayer({
  source: tif_source,
  zIndex: 2,
  style: get_style(),
});

// create the map
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
  radolan_layer.setSource(get_tif_source());
  radolan_layer.setStyle(get_style());
}
form.addEventListener(["submit"], updateLayer);

// get raster values at a point
function displayPixelValue(event) {
  console.log(radolan_layer.getData(event.pixel));
}
map.on(['click'], displayPixelValue);

// legend
var legend = new Legend({
  title: 'Legend',
  margin: -5,
  maxWidth: 300,
});

// Set the style of the legend
legend.setStyle({
  color: [
    'interpolate',
    ['linear'],
    ["band", 1],
    10, [0, 0, 0],
    360, [255, 255, 255],
  ]
});

// Set the layer of the legend
legend.setLayer(radolan_layer);

const legendCtrl = new LegendCtrl({
  legend: legend,
  collapsed: false
});

// Add the Legend control to the map
map.addControl(legendCtrl);

window.map = map;
window.form = form;
window.radolan_layer = radolan_layer;
// window.legendCtrl = legendCtrl;
window.legend = legend;
window.get_style = get_style;
