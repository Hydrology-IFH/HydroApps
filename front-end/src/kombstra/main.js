import './style.css';
import 'ol/ol.css';
import "ol-ext/control/Legend.css";

import ol from 'ol';
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

// const form = document.getElementById('form_select_grid');
// const formPara = form.querySelector('select#parameter');
// const formPerc = form.querySelector('select#percentile');
// const formRank = form.querySelector('input#eventRank');
// const formSubmit = form.querySelector("input#btn_update_grid");

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

// styles
// let styles = {
//   duration: {
//     color: [
//       "case",
//       [">", ["band", 2], 0],
//       [
//         'interpolate',
//         ['linear'],
//         ["band", 1],
//         10, [0, 0, 0],
//         360, [255, 255, 255],
//       ],
//       ["color", 0,0,0,0]
//     ]
//   },
//   pval: {
//     color: [
//       "case",
//       [">", ["band", 2], 0],
//       [
//         'interpolate',
//         ['linear'],
//         ["band", 1],
//         0, [0, 0, 0],
//         200, [255, 5, 5],
//       ],
//       ["color", 0,0,0,0]
//     ]
//   },
//   sri: {
//     color: [
//       "case",
//       [">", ["band", 2], 0],
//       [ 'interpolate',
//         ['linear'],
//         ["band", 1],
//         1, [161, 194, 31],
//         2, [178, 207, 129],
//         3, [222, 225, 14],
//         4, [255, 236, 1],
//         5, [241, 144, 6],
//         6, [233, 98, 25],
//         7, [229, 81, 26],
//         8, [226, 35, 35],
//         9, [227, 41, 64],
//         10, [228, 35, 95],
//         11, [224, 64, 141],
//         12, [160, 69, 144],
//       ],
//       ["color", 0,0,0,0]
//     ]
//   },
//   month: {
//     color: [
//       "case",
//       [">", ["band", 2], 0],
//       [ 'interpolate',
//         ['linear'],
//         ["band", 1],
//         // colorpalette from matplotlib "twilight_reversed -> cyclic"
//         0, [48, 20, 55],
//         1, [78, 24, 111],
//         2, [94, 69, 166],
//         3, [98, 118, 186],
//         4, [124, 162, 194],
//         5, [179, 198, 206],
//         6, [226, 217, 226],
//         7, [212, 188, 172],
//         8, [198, 137, 108],
//         9, [178, 86, 82],
//         10, [141, 43, 80],
//         11, [88, 22, 71],
//         12, [47, 20, 54],
//       ],
//       ["color", 0,0,0,0]
//     ]
//   },
//   year: {
//     color: [
//       "case",
//       [">", ["band", 2], 0],
//       [ 'interpolate',
//         ['linear'],
//         ["band", 1],
//         2001, [249, 253, 204],
//         2002, [244, 251, 192],
//         2003, [238, 248, 179],
//         2004, [227, 244, 178],
//         2005, [214, 239, 179],
//         2006, [202, 234, 180],
//         2007, [183, 227, 182],
//         2008, [160, 218, 184],
//         2009, [135, 208, 186],
//         2010, [115, 200, 189],
//         2011, [95, 193, 192],
//         2012, [76, 186, 194],
//         2013, [59, 176, 195],
//         2014, [47, 164, 194],
//         2015, [36, 152, 193],
//         2016, [30, 139, 189],
//         2017, [31, 122, 181],
//         2018, [33, 106, 173],
//         2019, [34, 90, 166],
//         2020, [35, 77, 160],
//         2021, [36, 63, 153],
//         2022, [35, 51, 144],
//         2023, [26, 43, 126],
//         2024, [17, 36, 107],
//         2025, [8, 29, 88],
//       ],
//       ["color", 0,0,0,0]
//     ]
//   },
// }
// const get_style = function () {
//   return styles[formPara.value];
// }

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
// legend.setLayer(radolan_layer);
// var legendCtrl = new LegendCtrl({
//   legend: legend,
//   collapsed: false
// });

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

// map.addControl(legendCtrl);

window.map = map;
window.form = form;
window.radolan_layer = radolan_layer;
// window.legendCtrl = legendCtrl;
window.legend = legend;
window.get_style = get_style;
