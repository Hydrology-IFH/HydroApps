import Legend from "ol-ext/legend/Legend.js";
import LegendCtrl from "ol-ext/control/Legend.js";
import { get_style } from "./styles.js";
import { parameter, year, sri } from "./Form.vue"
import { map } from "./map.js";
import { i18n } from './i18n.js';

// heading labels
const labels = {
  duration: () => i18n.t('legend_label_duration'),
  sri: () => i18n.t('legend_label_sri'),
  month: () => i18n.t('legend_label_month'),
  year: () => i18n.t('legend_label_year'),
  NEvents_above_SRI: () => `${i18n.t('legend_label_NEvents_above')} SRI >= ${sri.value}`,
  Top_SRI_year: () => `${i18n.t('legend_label_top_sri')} ${year.value}`,
}

// sri return periods
const sri_T = {
  1: { T: "<b>1&nbsp;-&nbsp;2</b>" },
  2: { T: "<b>3.3&nbsp;-&nbsp;5</b>" },
  3: { T: "<b>10</b>" },
  4: { T: "<b>20&nbsp;-&nbsp;25</b>" },
  5: { T: "<b>33.3</b>" },
  6: { T: "<b>50</b>" },
  7: { T: "<b>100</b>" },
  8: { T: "<b>>100</b>", F: "<b>1,20&nbsp;-&nbsp;1,39</b>" },
  9: { T: "<b>>100</b>", F: "<b>1,40&nbsp;-&nbsp;1,59</b>" },
  10: { T: "<b>>100</b>", F: "<b>1,60&nbsp;-&nbsp;2,19</b>" },
  11: { T: "<b>>100</b>", F: "<b>2,20&nbsp;-&nbsp;2,79</b>" },
  12: { T: "<b>>100</b>", F: "<b>&GreaterSlantEqual;2,80</b>" }
}

// create discrete colorbar elements
function get_discrete_element(color, value) {
  let cb_el = document.createElement("div");
  cb_el.className = "colorbar-element";

  // add color
  let cb_col = document.createElement("div");
  cb_col.className = "colorbar-color";
  cb_col.style.background = `rgb(${color.join(",")})`;
  cb_el.appendChild(cb_col);

  // add label
  let cb_tick = document.createElement("div");
  cb_tick.className = "colorbar-tick";
  if (value == 9998) {
    cb_tick.innerText = i18n.t('legend_colorbar_no_event');
  } else {
    cb_tick.innerText = `${value}`;
  }
  cb_el.appendChild(cb_tick);

  return cb_el
}

// add discrete colorbar to legend
function add_discrete_colorbar(styleColorDis, cb_div, label) {
  // get relevant style variables
  let col_ticks = styleColorDis.slice(1);
  let colors = col_ticks.filter((el) => el[0] != "==");
  let ticks = col_ticks.filter((el) => el[0] == "==").map((el) => el[2]);

  cb_div.className = "colorbar colorbar-dis ol-legend";

  // add label
  let cb_label = document.createElement("div");
  cb_label.className = "colorbar-label";
  cb_label.innerHTML = `${label}`;
  cb_div.appendChild(cb_label);

  // create discrete legend div
  let cb_els = document.createElement("div");
  cb_els.className = "colorbar-elements";
  for (let i = 0; i < ticks.length; i++) {
    cb_els.appendChild(get_discrete_element(colors[i], ticks[i]));
  }
  cb_div.appendChild(cb_els);

  // add sri return period
  if (["sri", "Top_SRI_year"].includes(parameter.value)) {
    for (let i = 0; i < (ticks.length-1); i++) {
      let cb_el = cb_els.children[i];
      let sri = parseInt(cb_el.children[1].innerText);
      let i18n_opts = { ...sri_T[sri], 'interpolation': { 'escapeValue': false } }
      new bootstrap.Tooltip(cb_el, {
        html: true,
        placement: "top",
        title: `${i18n.t("legend_sri_return_period", i18n_opts)} ${"F" in i18n_opts ? "<br>"+i18n.t("legend_sri_factor", i18n_opts) : ""}`
      });
    }
  }
}

function add_linear_colorbar(styleColorLin, cb_div, label) {
  // get relevant style variables
  let col_ticks = styleColorLin.slice(3);
  let colors = col_ticks.filter((el) => el instanceof Array);
  let ticks = col_ticks.filter((el) => !(el instanceof Array));

  // create continous legend div
  cb_div.className = "colorbar colorbar-con ol-legend";
  let cb_bar = document.createElement("div");
  cb_bar.className = "colorbar-bar";
  cb_bar.style.background = `linear-gradient(to right, rgb(${colors.join("), rgb(")})`;
  cb_div.appendChild(cb_bar);

  // calculate amount of ticks
  let n_ticks = ticks.length;
  let tick_min = ticks[0];
  let tick_max = ticks.at(-1);
  let n_max = 8;
  if (n_ticks > n_max) {
    let factor;
    let start_i = (n_ticks - (n_ticks % n_max) + n_max) / n_max;
    for (let i = start_i; i <= n_ticks+1; i++) {
      if ((n_ticks+1) % i == 0) {
        factor = i;
        break;
      }
    }
    ticks = ticks.filter((el) => ((ticks.indexOf(el)+2) % factor == 0) | (ticks.indexOf(el) == 0));
    n_ticks = ticks.length;
  }
  if ((n_ticks == 2) & ((tick_max - tick_min) % 2 == 0)) {
    n_ticks = 3;
    ticks = [tick_min, tick_min + (tick_max - tick_min) / 2, tick_max];
  }

  // create tick divs
  let cb_ticks = document.createElement("div");
  cb_ticks.className = "colorbar-ticks";
  for (let n_tick = 0; n_tick < n_ticks; n_tick++) {
    let tick_val = Math.round(tick_min + (tick_max - tick_min) / (n_ticks - 1) * n_tick);
    let tick = document.createElement("div");
    tick.className = "colorbar-tick";
    tick.innerHTML = `${tick_val}`;
    cb_ticks.appendChild(tick);
  }
  cb_div.appendChild(cb_ticks);

  // add label
  let cb_label = document.createElement("div");
  cb_label.className = "colorbar-label";
  cb_label.innerHTML = `${label}`;
  cb_div.appendChild(cb_label);
}

function create_colorbar() {
  // get style parameters
  let style = get_style();
  let label = labels[parameter.value]();

  let cb_div = document.createElement("div");

  if (style.color[2][0] == "interpolate") {
    add_linear_colorbar(style.color[2], cb_div, label)
  } else if (style.color[2][0] == "case") {
    if ((JSON.stringify(style.color[2][1]) == '["==",["band",1],9998]') &
      (style.color[2][3][0] == "interpolate")) {
      cb_div.classList.add(
        "colorbar",
        "colorbar-con-dis");

      let div_lin = document.createElement("div");
      add_linear_colorbar(style.color[2][3], div_lin, label)
      div_lin.classList.remove("colorbar");
      cb_div.appendChild(div_lin);

      let cb_nodata = get_discrete_element(style.color[2][2], 9998);
      let cb_els = document.createElement("div");
      cb_els.className = "colorbar-dis ol-legend";
      cb_els.appendChild(cb_nodata);
      cb_div.appendChild(cb_els);
    } else {
      add_discrete_colorbar(style.color[2], cb_div, label)
    }
  }

  return cb_div
}

export function update_legend() {
  let leg_div = document.querySelector("div.ol-legend");
  leg_div.querySelector("div.colorbar").replaceWith(create_colorbar());
}

export function create_legend() {
  // legend
  map.addControl(
    new LegendCtrl({
    legend: new Legend({}),
    collapsed: false
    })
  );

  let leg_div = document.querySelector("div.ol-legend");
  leg_div.querySelector("ul.ol-legend").remove();
  leg_div.querySelector("canvas").remove();

  // add the colorbar div
  leg_div.appendChild(create_colorbar());
}


