<script setup>
  import { ref, onMounted, computed } from 'vue';
  import Overlay from 'ol-ext/control/Overlay.js';
  import Button from 'ol-ext/control/Button.js';

  import { getReasonableDigits } from '~~/utils/reasonableDigits';
  import { useConfig } from '~/stores/config.js';

  // define variables
  const props = defineProps({
    layer_name: String,
    layer: Object,
    style: Object,
    map: Object,
    unit: { type: String, default: "mm" },
  })
  const legend_div = ref(null)
  const layerLib = useConfig().layerLib;

  const label = computed(() => {
    if (props.unit !== "") {
      return `${props.layer_name} in ${props.unit}`
    } else {
      return props.layer_name
    }
  })
  // get styling from style definition
  const style_col_ticks = computed(() => {
    return props.style.color[2].slice(3);
  })
  const ticks = computed(() => {
    // calculate amount of ticks
    let ticks = style_col_ticks.value.filter((el) => !(el instanceof Array));
    let n_ticks = ticks.length;
    let tick_min = ticks[0];
    let tick_max = ticks.at(-1);
    let n_max = 8;
    if (n_ticks > n_max) {
      // select only some of the ticks
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
    // round ticks
    let digits = getReasonableDigits(tick_min, tick_max);
    let rdigits = Math.pow(10, digits);
    ticks = ticks.map((el) => Math.round(el*rdigits)/rdigits);

    return ticks
  })

  const cb_style = computed(() => {
    let colors = style_col_ticks.value.filter((el) => el instanceof Array);
    return `background: linear-gradient(to right, rgb(${colors.join("), rgb(")})`
  })

  // special stylings
  var sri_T = {
    1: { T: "1 - 2" },
    2: { T: ">2 - 5" },
    3: { T: ">5 - 10" },
    4: { T: ">10 - 25" },
    5: { T: ">25 - 30" },
    6: { T: ">30 - 50" },
    7: { T: ">50 - 100" },
    8: { T: ">100", F: "1,20 - 1,39" },
    9: { T: ">100", F: "1,40 - 1,59" },
    10: { T: ">100", F: "1,60 - 2,19" },
    11: { T: ">100", F: "2,20 - 2,79" },
    12: { T: ">100", F: "&GreaterSlantEqual;2,80" }
  }

  // create legend overlay
  var overlay = null;
  var btnOpen = null;
  onMounted(() => {
    // Overlay for Legend
    overlay = new Overlay({
      content: legend_div.value,
      closeBox : false,
      className: "slide-left legend-overlay"
    });
    props.map.addControl(overlay);
    overlay.show()

    //   // A toggle control to show/hide the menu
    btnOpen = new Button({
      html: '<i class="bi bi-palette"></i>',
      className: "open-legend hidden",
      title: "Legend",
      handleClick: function () {
        overlay.show();
        btnOpen.element.classList.add("hidden");
      }
    });
    props.map.addControl(btnOpen);
  })

  // legend closer
  const close = () => {
    btnOpen.element.classList.remove("hidden");
    overlay.hide();
  }
</script>

<template>
  <div ref="legend_div">
    <button type="button" class="btn btn-close" role="button" @click="close"></button>
    <div class="colorbar colorbar-con-dis" ref="legend_div">
      <div class="colorbar-dis  ol-legend" v-if="layerLib.selectedLayer.id=='SRI'">
          <div class="colorbar-label">SRI</div>
          <div class="colorbar-elements">
            <div class="colorbar-element">
              <div class="colorbar-color" style="background: rgb(161, 194, 31);"></div>
              <div class="colorbar-tick">1</div>
            </div>
            <div class="colorbar-element">
              <div class="colorbar-color" style="background: rgb(178, 207, 129);"></div>
              <div class="colorbar-tick">2</div></div><div class="colorbar-element">
                  <div class="colorbar-color" style="background: rgb(222, 225, 14);"></div><div class="colorbar-tick">3</div></div><div class="colorbar-element">
                    <div class="colorbar-color" style="background: rgb(255, 236, 1);"></div><div class="colorbar-tick">4</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(241, 144, 6);"></div><div class="colorbar-tick">5</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(233, 98, 25);"></div><div class="colorbar-tick">6</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(229, 81, 26);"></div><div class="colorbar-tick">7</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(226, 35, 35);"></div><div class="colorbar-tick">8</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(227, 41, 64);"></div><div class="colorbar-tick">9</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(228, 35, 95);"></div><div class="colorbar-tick">10</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(224, 64, 141);"></div><div class="colorbar-tick">11</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(160, 69, 144);"></div><div class="colorbar-tick">12</div></div><div class="colorbar-element"><div class="colorbar-color" style="background: rgb(200, 200, 200);"></div><div class="colorbar-tick">Kein Ereignis</div></div></div></div>

      </div>
      <div class="colorbar-con ol-legend" v-else>
        <div class="colorbar-bar" :style="cb_style"></div>
        <div class="colorbar-ticks">
          <div class="colorbar-tick" v-for="tick in ticks" :key="tick">{{ tick }}</div>
        </div>
        <div class="colorbar-label">{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  div.colorbar-label{
    font-weight: 600;
    font-size: 1rem;
  }

  /* continous and discret colorbar mixed */
  div.colorbar-con-dis{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  div.colorbar-con-dis > div.colorbar-con{
    width: -moz-available;
    width: -webkit-fill-available;
  }
  div.colorbar-con-dis > div.colorbar-dis{
    margin-top: 5px;
    margin-left: 10px;
    width: fit-content;
  }
  div.colorbar-con-dis > div.colorbar-dis .colorbar-tick{
    width: max-content;
  }

  /* continous colorbar */
  div.colorbar-con {
    margin-top: 5px;
  }

  div.colorbar-con div.colorbar-bar {
    height: 20px;
    margin: 0px 1rem 0px 1rem;
  }

  div.colorbar-con div.colorbar-ticks {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 20px;
    text-align: center;
  }
  div.colorbar-con div.colorbar-tick {
    min-width: 2rem;
  }
  div.colorbar-con div.colorbar-label{
    text-align: center;
  }

  /* discrete colorbar */
  div.colorbar-dis div.colorbar-element {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  div.colorbar-dis div.colorbar-element > div.colorbar-color{
    width: 1.3rem;
    height: 1.3rem;
    border: 1px solid black;
    margin-right: calc(.1em + .35vw);
    margin-left: calc(.1em + .35vw);
  }

  /* close button */
  .btn-close {
    position: absolute;
    right: 0em;
    top: 0em;
    left: auto;
    font-size: 1em;
  }

</style>
<style>
  /* legend button */
  .open-legend {
    bottom: 0.5em;
    left: 0.5em;
  }
  .open-legend.hidden {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s .5s, opacity .5s linear;
  }
  /* legend overlay */
  .legend-overlay{
    height: max-content;
    width: max-content;
    min-width: 85%;
    max-width: 90%;
    overflow-x: hidden;
    overflow-y: auto;
    margin-left: 0.5em;
    bottom: .5em!important;
    top: auto!important;
    background: #fff9;
    color: #333;
    box-shadow: 0px 0px 5px #000;
    padding: 0.5em;
    padding-right: 1em;
    border-radius: 4px;
    z-index: 1;
  }
</style>