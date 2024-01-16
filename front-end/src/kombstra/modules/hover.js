import { radolan_layer } from "./radolan_layer";
import { map } from "./map";
import { form, formPara } from "./form";

const info_div = document.getElementById('info');

const units = {
    duration: "min",
    pval: "mm",
    sri: "",
    month: "",
    year: ""
}
var actual_unit;

function update_hover_unit() {
    actual_unit = units[formPara.value];
}

export function create_hover() {
    map.on('pointermove', function (evt) {
        if (evt.dragging) {
            info_div.style.visibility = 'hidden';
            return;
        }
        let pixel = map.getEventPixel(evt.originalEvent)
        let pix_value = radolan_layer.getData(pixel);

        if (pix_value[1]!=0) {
            info_div.style.left = pixel[0] + 'px';
            info_div.style.top = pixel[1] + 'px';
            info_div.style.visibility = 'visible';
            info_div.innerText = `${pix_value[0]} ${actual_unit}`;
        } else {
            info_div.style.visibility = 'hidden';
        }
    });

    update_hover_unit();
    form.addEventListener("submit", update_hover_unit);
}