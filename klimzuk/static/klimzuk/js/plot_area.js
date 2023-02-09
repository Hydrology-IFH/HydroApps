"use strict";

const para_dict = {
  "pr": gettext("precipitation"),
  "tas": gettext("air temperature"),
  "td": gettext("moisted temperature"),
  "rsds": gettext("global radiation (W/m²)"),
  "rh": gettext("relative air moisture"),
  "ET": gettext("evapotranspiration"),
  "snow": gettext("snowfall")}
const period_dict = {
  "a": gettext("Year"),
  "m": gettext("Daily Maximum"),
  "w": gettext("Winter"),
  "f": gettext("Spring"),
  "s": gettext("Summer"),
  "h": gettext("Fall")
}

var plots_data = Vue.ref([])
function add_plot(stid, para, period) {
  if (!plots_data.value.some(el=>{return (el.station_id == stid) && (el.para == para) && (el.period == period)})){
    plots_data.value.push({
        station_id: stid, 
        para: para, 
        period: period,
        key: `${stid}_${para}_${period}`
      })
  }
}  

// Vue App
var plotAreaApp = Vue.createApp({
  data() {
    return {
      plots_data: plots_data
    }
  },
  methods: {
    clear_plot_area(){
      this.plots_data.splice(0, this.plots_data.length);
    }
  },
  updated() {
      tooltipList = tooltipList.filter((el) => el._element.isConnected);
      [...document.querySelectorAll('div#plot_area [data-bs-toggle="tooltip"]')
        ].map(tooltipTriggerEl => tooltipList.push(new bootstrap.Tooltip(tooltipTriggerEl)));
  }
})

// Vue.component(
plotAreaApp.component(
  'plot-card', {
    data: () => ({
      top: 0,
      left: 0,
      width: "300px",
    }),
    props: ['station_id', 'para', 'period', 'n'],
    computed: {
      src: function(){
        return `/static/klimzuk/PNG/A4_Ann_Trends_${this.station_id}_${this.para}_${this.period}.png`
      },
      style: function(){
        let jitter = this.n_start*15;
        return {left: jitter + 5 +"px", top: jitter + 60 + "px"}
      }
    },
    template: `<div class="card plot_card" :style="style"><div class="card-body"><button type="button" class="btn-close" aria-label="Close" @click="remove_plot"></button><img class="plot_img" v-bind:src="src"></div></div>`,
    methods: {
      remove_plot(){
        plots_data.value.splice(this.n, 1);
      }
    },
    created(){
      this.n_start = this.n; // to prevent creating a new jitter value if a plot got deleted
    }
  }
)

plotAreaApp.mount('#plot_area');

// make interactive plots
interact(".plot_card").resizable({
  edges: { top: true, left: true, bottom: true, right: true },
  listeners: {
    move: function (event) {
      let { x, y } = event.target.dataset;

      x = (parseFloat(x) || 0) + event.deltaRect.left;
      y = (parseFloat(y) || 0) + event.deltaRect.top;

      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
        transform: `translate(${x}px, ${y}px)`
      })

      Object.assign(event.target.dataset, { x, y })
    }
  },
  modifiers: [
    interact.modifiers.aspectRatio({
      // make sure the ratio stays the same
      ratio: "preserve",
      // also restrict the size by nesting another modifier
      modifiers: [
        interact.modifiers.restrictSize({ max: 'parent', min: {width:40} }),
      ],
    }),
  ],
})

var position;
interact(".plot_card").draggable({
  listeners: {
    start (event) {
      if (event.target.style.transform == ""){
        position = {x: 0, y: 0}
      } else {
        position = {
          x: parseFloat(event.target.dataset.x),
          y: parseFloat(event.target.dataset.y)}
      }
    },
    move (event) {
      position.x += event.dx;
      position.y += event.dy;

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`;

      Object.assign(event.target.dataset, position);
    },
  },
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "div#plot_area>div.card",
      // elementRect: { left: 0, right: 0, top: 1, bottom: 1 },
    })
  ]
})

// make whole plot area resizable
let plot_area_inter = interact("#plot_area>.card").resizable({
  edges: {bottom: true, right: true },
  listeners: {
    move: function (event) {
      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`
      })
    }
  },
  modifiers: [
    interact.modifiers.restrictSize({ 
      min: ()=>{
          let max_x = 0;
          let max_y = 0;
          document.querySelectorAll(".plot_card").forEach((e) => {
            max_x = Math.max(max_x, e.getBoundingClientRect().right);
            max_y = Math.max(max_y, e.getBoundingClientRect().bottom);
          }) 
          let start = document.querySelector("#plot_area").getBoundingClientRect()
          return {width: max_x-start.x+10, height: max_y-start.y+10}
        },
      max: ()=>{
        let main_page_bb = document.getElementById("main_page").getBoundingClientRect();
        let start_bb = document.querySelector("#plot_area").getBoundingClientRect();
        return {width: main_page_bb.right - start_bb.left - 5, height: 10000}
      }
    })
    // interact.modifiers.restrictRect({
    //   restriction: 'body > div.container',
    //   endOnly: true
    // })
  ],
})


