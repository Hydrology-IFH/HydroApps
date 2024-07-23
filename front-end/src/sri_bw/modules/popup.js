import Overlay from 'ol/Overlay.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { GeoJSON } from 'ol/format.js';
import { getCenter, containsCoordinate } from 'ol/extent.js';
import { createApp } from 'vue';

import { map } from './map.js';
import { toggle_hover } from './hover.js';
import PopupContent from './PopupContent.vue';
import { i13nVue, i18n } from './i18n.js';
import { sri_bw_layer } from './sri_bw_layer.js';

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: false,
  className: 'ol-overlay-popup',
});

const popup_cell_source = new VectorSource({});
const popup_cell_layer = new VectorLayer({
  source: popup_cell_source,
  map: map,
  style: {
    'stroke-color': 'rgba(225, 0, 255, 1)',
    'stroke-width': 4,
  },
  zIndex: 9,
});

// create PopupContent component
let popupApp = i13nVue(createApp(PopupContent));
let popupAppInst = popupApp.mount(content);

// functions to set popup position
function set_overlay_position() {
  let ext = popup_cell_source.getExtent();
  let center = getCenter(ext);
  let pixel = map.getPixelFromCoordinate(center);
  let screenTopPos = pixel[1] + map.getTargetElement().getBoundingClientRect().y;
  let overlayEl = overlay.getElement();

  if (screenTopPos <= (window.screen.availHeight * 0.4)) {
    overlayEl.className = 'ol-popup popup-bottom';
    overlay.setPosition([center[0], ext[1]]);
  } else if (screenTopPos <= (window.screen.availHeight * 0.6)) {
    if ((pixel[0] > map.getTargetElement().getBoundingClientRect().width * 0.6) && (pixel[0] + map.getTargetElement().getBoundingClientRect().x > 450)) {
      overlayEl.className = 'ol-popup popup-left';
      overlay.setPosition([ext[0], center[1]]);
    } else {
      overlayEl.className = 'ol-popup popup-right';
      overlay.setPosition([ext[2], center[1]]);
    }
  } else {
    overlayEl.className = 'ol-popup popup-top';
    overlay.setPosition([center[0], ext[3]]);
  }
};
function set_overlay_position_error(long, lat) {
  overlay.setPosition([long, lat]);
};

// get sri-BW data from api
function update_sri_bw_data(long, lat) {
  fetch("/en/sri_bw/api/sri_bw_polygon?long=" + long + "&lat=" + lat)
    .then((res) => res.json())
    .then((data) => {
      popup_cell_source.addFeatures(
        new GeoJSON().readFeatures(data[0].geometry, {
          dataProjection: "EPSG:3857",
          featureProjection: "EPSG:3857",
        }));
      popupAppInst.update_popup_data(data[0].grid_id, lat, long);
      set_overlay_position();
    })
    .catch((err) => {
      console.log(err);
      popupAppInst.set_error_msg(i18n.t('popup_error_msg_position'));
      set_overlay_position_error(long, lat);
    });
}

function remove_popup_cell_layer() {
  popup_cell_source.clear();
}

// create popup and add to map
export function create_popup() {
  // pointermove handler to remove the popup when focus outside map
  let map_view = map.getView();
  function dragging_listener(evt) {
    let cell_extent = getCenter(popup_cell_source.getExtent());
    let view_extent = map_view.getViewStateAndExtent().extent;
    if (!containsCoordinate(view_extent, cell_extent)) {
      overlay.setPosition(undefined);
    } else {
      set_overlay_position();
    }
  }
  function add_dragging_handler() {
    map.on('pointerdrag', dragging_listener)
    window.addEventListener("scroll", dragging_listener);
  };
  function remove_dragging_handler() {
    map.un('pointerdrag', dragging_listener)
    window.removeEventListener("scroll", dragging_listener);
  };

  //  add popup to map
  map.addOverlay(overlay);
  map.addLayer(popup_cell_layer);
  container.style.visibility = 'visible';

  // add a click handler to hide the popup.
  closer.onclick = () => {
    overlay.setPosition(undefined);
    closer.blur();
    toggle_hover(true);
    remove_popup_cell_layer();
    remove_dragging_handler();
    return false;
  };

  // Add a click handler to the map to render the popup.
  map.on('singleclick', (evt) => {
    toggle_hover(false);

    let coordinate = evt.coordinate;
    let cell_features = popup_cell_source.getFeatures();

    // only update if clilcked outside last clicked cell
    if (!((cell_features.length > 0) && cell_features[0].getGeometry().containsXY(...coordinate))) {
      remove_popup_cell_layer();

      // check if inside sri_bw layer and update popup
      let pix_value = sri_bw_layer.getData(map.getEventPixel(evt.originalEvent));
      if ((pix_value != null) && (pix_value[1] != 0)) {
        update_sri_bw_data(coordinate[0], coordinate[1]);
      } else {
        overlay.setPosition(undefined);
      }
    }

    add_dragging_handler();
  });
}