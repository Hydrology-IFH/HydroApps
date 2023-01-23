// import Vue from "vue";
// import Moveable from "vue-moveable";

const para_dict = {
  "pr": "Niederschlag",
  "tas": "Lufttemperatur",
  "td": "Feuchtetemperatur",
  "rsds": "Globalstrahlung (W/m²)",
  "rh": "relative Luftfeuchtigkeit",
  "ET": "evapotranspiration",
  "snow": "Schnee"}
const period_dict = {
  "a": "Year",
  "m": "Daily Maximum",
  "w": "Winter",
  "f": "Spring",
  "s": "Summer",
  "h": "Fall"
}

// var PlotArea = new Vue({
var PlotArea = Vue.createApp({
  el: '#plot_area',
  data: {
      plots_data: [],
      },
  }
)

// PlotCard = 
// Vue.component(
PlotArea.component(
  'plot-card',{
    data: function () {
    return {
      top: 0,
      left: 0,
      width: "300px",
      mouse_x1: 0,
      mouse_y1: 0,
      left1: 0,
      top1: 0,
      cursor: "move",
    }
    },
    props: ['station_id', 'para', 'period'],
    computed: {
    src: function(){
      return `./static/PNG/A4_Ann_Trends_${this.station_id}_${this.para}_${this.period}.png`
    },
    plot_key: function(){
        return `${this.station_id}_${this.para}_${this.period}`
    },
    para_readable: function(){
      return para_dict[this.para]
    },
    period_readable: function(){
      return period_dict[this.period]
    },
    top_px: function(){return this.top+"px"},
    left_px: function(){return this.left+"px"}
    },
    template: `<div class="card" v-bind:style="{width: width, top: top_px, left: left_px, cursor:cursor}" v-on:mousedown.left="dragMouseDown" v-on:mouseover="mouseOver"><div class="card-body"><h5 class="card-title">{{station_id}}</h5><h6 class="card-subtitle mb-2 text-muted">{{para_readable}} - {{period_readable}}</h6><img class="plot_img" v-bind:src="src"></div></div>`,
    methods: {
      dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.mouse_x1 = e.clientX;
        this.mouse_y1 = e.clientY;
        this.left1 = this.left;
        this.top1 = this.top;
        document.onmouseup = this.closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = this.elementDrag;
      },
      elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          this.left = Math.max((this.left1 + (e.clientX - this.mouse_x1 )),0);
          this.top =  Math.max((this.top1 + (e.clientY - this.mouse_y1 )),0);
      }, 
      closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
      }, 
      mouseOver(e) {
          if ((e.offsetX<10 && e.offsetY<10)) {
          this.activateResize()
          } else {
          this.deactivateResize()
          }
      },
      activateResize(){
          this.cursor = "n-resize";
          document.onmousedown = this.resizeMouseDown;
      },
      deactivateResize(){
          this.cursor = "move";
          document.onmousedown = this.dragMouseDown;
      },
      resizeMouseDown(){}
    }
  }
)

export { PlotArea }