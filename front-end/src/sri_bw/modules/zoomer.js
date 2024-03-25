import "./zoomer.css";
import { i18n } from './i18n.js';

export function create_zoomer(){
  document.querySelectorAll(".zoomable").forEach((el)=>{
    // add zoom containers and put element inside
    let zoomcont = document.createElement("div");
    zoomcont.className = "zoom-container";
    let zoomels = document.createElement("div");
    zoomels.className = "zoom-elements";
    zoomcont.appendChild(zoomels);
    el.insertAdjacentElement("beforebegin", zoomcont);
    zoomels.appendChild(el);

    // add button to close and open
    let btn = document.createElement("a");
    btn.className = "zoom-button";
    let ttp = new bootstrap.Tooltip(btn)
    zoomels.insertAdjacentElement("afterbegin", btn);

    // set button icon and tooltip
    let set_button_icon = (openstate)=>{
      if (openstate){
        btn.innerHTML = `<i class="bi bi-x-lg"></i>`;
        ttp._config.title = i18n.t("tooltip_fullscreen_close");
        ttp._config.placement = "left";
      } else {
        btn.innerHTML = `<i class="bi bi-arrows-fullscreen"></i>`;
        ttp._config.title = i18n.t("tooltip_fullscreen_open");
        ttp._config.placement = "top";
      }
      ttp.update();
      ttp.hide();
    }
    set_button_icon(false);

    // toggle between open and close
    let open_state = false;
    let toggle_open_state = ()=>{
      open_state = !open_state;
      set_button_icon(open_state);
      zoomcont.classList.toggle("zoom-active");
    }

    btn.addEventListener("click", toggle_open_state)
  });
}