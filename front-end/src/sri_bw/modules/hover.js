import { sri_bw_layer } from "./sri_bw_layer.js";
import { map } from "./map.js";
// import { gridForm, gridFormPara } from "./forms.js";
import { parameter } from "./Form.vue";
import { form } from "./forms.js";
import Overlay from 'ol/Overlay.js';
import { containsCoordinate } from 'ol/extent.js';
import { i18n } from "./i18n.js";

// define variables
const info_div = document.getElementById('info');
const units = {
  duration: "min",
  pval: "mm",
  sri: "",
  month: "",
  year: "",
  NEvents_above_SRI: "",
  Top_SRI_year: "",
}
var actual_unit;
var hover_active = true;

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: info_div,
  className: 'ov-hover',
  autoPan: false,
  positioning: 'bottom-left',

});

// define functions
export function update_hover_unit() {
  actual_unit = units[parameter.value];
}

// activate/deactivate hover
export function toggle_hover(state) {
  if (state == null) {
    hover_active = !hover_active;
  } else {
    hover_active = state;
  }
  if (!hover_active) {
    overlay.setPosition(undefined);
  }
}

// create hover
export function create_hover() {
  map.addOverlay(overlay);
  info_div.style.visibility = 'visible';
  let map_view = map.getView();
  map.on('pointermove', function (evt) {
    if (evt.dragging | !hover_active) {
      overlay.setPosition(undefined);
      return;
    }
    let pixel = map.getEventPixel(evt.originalEvent)
    let view_extent = map_view.getViewStateAndExtent().extent;
    if (!containsCoordinate(view_extent, evt.coordinate)) {
      overlay.setPosition(undefined);
      return;
    }

    let pix_value = sri_bw_layer.getData(pixel);
    if ((pix_value != null) && (pix_value[1] != 0)) {
      overlay.setPosition(evt.coordinate);
      if (pix_value[0] == 9998) {
        info_div.innerText = i18n.t("hover_no-event");
      } else {
        info_div.innerText = `${pix_value[0]} ${actual_unit}`;
      }
    } else {
      overlay.setPosition(undefined);
    }
  });

  // additional event listener to make hover disappear on exiting map
  map.getViewport().addEventListener('pointerleave', function () {
    overlay.setPosition(undefined);
  });

  update_hover_unit();
  form.inst.$watch('parameter', update_hover_unit);
}