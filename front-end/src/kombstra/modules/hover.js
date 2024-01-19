import { radolan_layer } from "./radolan_layer";
import { map } from "./map";
import { gridForm, gridFormPara } from "./forms.js";
import Overlay from 'ol/Overlay.js';

// define variables
const info_div = document.getElementById('info');
const units = {
    duration: "min",
    pval: "mm",
    sri: "",
    month: "",
    year: ""
}
var actual_unit;
var hover_active = true;

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
    element: info_div,
    autoPan: false,
    positioning: 'bottom-left'
  });

// define functions
function update_hover_unit() {
    actual_unit = units[gridFormPara.value];
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
    map.on('pointermove', function (evt) {
        if (evt.dragging) {
            overlay.setPosition(undefined);
            return;
        }
        let pixel = map.getEventPixel(evt.originalEvent)
        let pix_value = radolan_layer.getData(pixel);

        if (hover_active && (pix_value != null) && (pix_value[1] != 0)) {
            overlay.setPosition(evt.coordinate);
            info_div.innerText = `${pix_value[0]} ${actual_unit}`;
        } else {
            overlay.setPosition(undefined);
        }
    });

    update_hover_unit();
    gridForm.addEventListener("submit", update_hover_unit);
}