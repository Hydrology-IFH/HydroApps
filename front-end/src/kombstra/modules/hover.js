import { radolan_layer } from "./radolan_layer";
import { map } from "./map";
import { gridForm, gridFormPara } from "./forms.js";

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
        info_div.style.visibility = 'hidden';
    }
}

// create hover
export function create_hover() {
    map.on('pointermove', function (evt) {
        if (evt.dragging) {
            info_div.style.visibility = 'hidden';
            return;
        }
        let pixel = map.getEventPixel(evt.originalEvent)
        let pix_value = radolan_layer.getData(pixel);

        if (hover_active && (pix_value != null) && (pix_value[1] != 0)) {
            info_div.style.left = pixel[0] + 'px';
            info_div.style.top = pixel[1] + 'px';
            info_div.style.visibility = 'visible';
            info_div.innerText = `${pix_value[0]} ${actual_unit}`;
        } else {
            info_div.style.visibility = 'hidden';
        }
    });

    update_hover_unit();
    gridForm.addEventListener("submit", update_hover_unit);
}