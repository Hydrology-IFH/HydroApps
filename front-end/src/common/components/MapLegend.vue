<script setup>
  import { ref, onMounted, computed, watchEffect } from 'vue';
  import Overlay from 'ol-ext/control/Overlay.js';
  import Button from 'ol-ext/control/Button.js';

  // define variables
  const props = defineProps({
    title: String,
    elements: Array, // Array of elements {colors, labels=[String] || [{label, tooltip}], type="con"} || {color, label, tooltip, type="dis"} }
    map: Object,
    titlePosition: { type: Boolean, default: "topIfContinous" }, // top/bottom/topIfContinous, default topIfContinous: depending if continous elements are present,
    visible: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 }
  })
  const legend_div = ref(null)

  // get correct legend elements
  const elements = computed(() => {
    if (props.elements.length >= 0) {
      let validElements = props.elements.filter((el) => {
        if (el.type === "dis") {
          return el.hasOwnProperty("label") && el.hasOwnProperty("color")
        } else if (el.type === "con") {
          return (el.hasOwnProperty("colors") && el.hasOwnProperty("labels") &&
            (el.labels.map((label) => (
              (typeof label === "string") || (typeof label === "number") ||
              ((typeof label == "object") && label.hasOwnProperty("label"))
            ))).reduce((a, b) => a && b, true))
        }
      })
      // convert all continous eleements labels to Object format
      return validElements.map((el) => {
        if (el.type === "con") {
          el.labels = el.labels.map((label) => (typeof label === "object") ? label : {label: label} )
        }
        return el
      })
    }
  })

  // get title position
  const titleStyle = computed(() => {
    if ((props.titlePosition === "top") ||
        (props.titlePosition === "topIfContinous" && elements.value.some((el) => el.type === "con"))) {
      return {order: 0}
    } else {
      return {order: 2}
    }
  })

  // get style for continous elements
  const cb_style = function(colors) {
    colors = colors.map((color) => {
      if (typeof color === "string") {
        return color
      } else {
        return `rgb(${color.join(", ")})`
      }
    })
    return {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
      opacity: props.opacity
    }
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
    if (props.visible) { overlay.show(); }

    // A toggle control to show/hide the menu
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

  // watch for visibility changes
  watchEffect(() => {
    if (props.visible) {
      overlay?.show();
    } else {
      overlay?.hide();
    }
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
    <div class="colorbar" ref="legend_div">
      <slot default>
        <slot name="title">
          <div class="colorbar-title" :style="titleStyle">{{ title }} </div>
        </slot>
        <slot name="colorbar-elements">
          <div class="colorbar-elements">
            <div v-for="element in elements" :key="element.label" :class="`colorbar-${element.type}`">
              <slot v-if="element.type=='con'">
                <div class="colorbar-bar" :style="cb_style(element.colors)"></div>
                <div class="colorbar-ticks">
                  <div class="colorbar-tick" v-for="(label, index) in element.labels" :key="label.label"
                   :style="{ transform: `translateX(${(-50 + index / (element.labels.length-1) * 100)}%)` }">
                    {{ label.label }}
                    <v-tooltip v-if="label.hasOwnProperty('tooltip')"
                              :text="label.tooltip"
                              class="arrow-bottom" offset="20px"
                              activator="parent" location="top"/>
                  </div>
                </div>
              </slot>
              <slot v-else>
                <div class="colorbar-color">
                  <div :style="{ background: element.color, opacity: opacity }"></div>
                </div>
                <div class="colorbar-tick">
                  {{ element.label }}
                </div>
                <v-tooltip v-if="element.hasOwnProperty('tooltip')"
                          class="arrow-bottom" offset="0px"
                          activator="parent" location="top">
                  <span v-html="element.tooltip"></span>
                </v-tooltip>
              </slot>
            </div>
          </div>
        </slot>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  /* Colorbar */
  div.colorbar{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
  }

  /* Colorbar title */
  div.colorbar-title{
    font-weight: 600;
    font-size: 1rem;
    margin-right: 0.8em;
  }
  div.colorbar .colorbar-title:first-child{
    margin-bottom: 5px;
    margin-top: -5px;
  }
  div.colorbar .colorbar-title:last-child{
    text-align: center;
  }

  /* the real legend elements */
  div.colorbar-elements {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
  }

  /* continous colorbar */
  div.colorbar-con {
    width: -moz-available;
    width: -webkit-fill-available;
    min-width: 50%;
  }

  div.colorbar-con div.colorbar-bar {
    height: 20px;
    margin: 0px 1rem 0px 1rem;
  }

  div.colorbar-con div.colorbar-ticks {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    height: 1.5em;
    text-align: center;
    margin: 0px 1rem 0px 1rem;
  }
  .colorbar-con>.colorbar-ticks>.colorbar-tick {
    padding: 1em;
    padding-top: 0;
  }
  div.colorbar-con {
    min-width: 2rem;
  }

  /* discrete colorbar */
  div.colorbar-dis {
    padding: 0 .5em;
  }
  div.colorbar-dis:first-child {
    padding-left: 0;
  }
  div.colorbar-dis > div.colorbar-color{
    width: 1.3rem;
    height: 1.3rem;
    border: 1px solid black;
   margin: auto;
  }
  div.colorbar-dis > div.colorbar-color > div{
    width: 100%;
    height: 100%;
  }
  div.colorbar-dis > div.colorbar-tick{
    width: 100%;
    height: 1.5em;
    text-align: center;
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
  .legend-overlay:has(.colorbar-con){
    min-width: 85%;
  }
</style>