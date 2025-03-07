<script setup>
  import { ref, toRef, onMounted, computed, watch } from 'vue';
  import { containsCoordinate } from 'ol/extent.js';
  import Overlay from 'ol/Overlay.js';
  import  VectorLayer  from 'ol/layer/Vector';
  window.VectorLayer = VectorLayer;

  const props = defineProps({
    map: Object,
    layer: Object,
    unit: { type: String, default: "mm" },
    decimals: { type: Number, default: 2 },
    valueConverter: { type: Function, default: (x) => x },
    propertyName: { type: [Array, String], default: "value" },
    dtype : { type: String, default: "number" } // number or string
  })

  const hoverDiv = ref(null)
  const hoverActive = ref(false)
  const pixel = ref(null)
  const layerRef = toRef(props, 'layer');

  // get value converter function
  const valueConverter = computed(() => {
    if (props.valueConverter instanceof Function) {
      return props.valueConverter;
    }
    return (x) => x;
  })

  // hover text
  const hoverText = ref("");
  const updateHoverText = async () => {
    if (pixel.value == null) return;

    // get raw value from raster or vector layer
    let rawValue;
    const extraProps = {};
    if (props.layer.constructor === VectorLayer) {
      // vector layer
      [ rawValue, extraProps.features ] = await props.layer.getFeatures(pixel.value).then((features) => {
        if (features.length > 0) {
          if (Array.isArray(props.propertyName)) {
            let prop = features[0].getProperties();
            for (let id of props.propertyName) {
              prop = prop[id];
            }
            return [prop, features];
          }
          return [features[0].get(props.propertyName), features];
        }
        return [null, features];
      });
    } else {
      // raster layer
      let pixValue = props.layer.getData(pixel.value);
      // console.log(pixValue);
      if ((pixValue != null) && (pixValue[1] != 0)) {
        rawValue = pixValue[0];
      }
    }

    // convert raw value to display value
    if (rawValue != null) {
      let value = rawValue;
      if (props.dtype == "number") {
        let dec = props.decimals;
        value = Math.round(parseFloat(value) * 10 ** dec) / 10 ** dec;
      }
      value = valueConverter.value(value, extraProps);
      hoverText.value = (value!==undefined && value !== null)? `${value.toLocaleString()} ${ props.unit }`.trim():"";
    } else {
      hoverText.value =  "";
    }
  }
  watch(pixel, updateHoverText, { deep: true, flush: 'sync' });

  // hover style
  const hoverStyle = computed(() => {
    return {
      visibility: hoverActive.value & hoverText.value != "" ? 'visible' : 'hidden'
    }
  })

  // update hoverText if layer changes
  watch(layerRef, (newLayer, oldLayer) => {
    if (newLayer.ol_uid !== oldLayer.ol_uid) {
      if (pixel.value !== null) {
        // set to "" on change
        updateHoverText();

        // loop until data is ready
        const checkAndGetData = () => {
          if (newLayer.getData(pixel.value) !== null) {
            updateHoverText();
          } else {
            setTimeout(checkAndGetData, 100);
          }
        };
        checkAndGetData();
      }
    }
  },
  { deep: false, flush: 'sync' });

  // create overlay
  onMounted(() => {
    // create overlay
    const overlay = new Overlay({
      element: hoverDiv.value,
      className: 'ov-hover',
      autoPan: false,
      positioning: 'bottom-left'
    });
    props.map.addOverlay(overlay);
    hoverActive.value = true;

    // update hover position
    props.map.on('pointermove', (evt) => {
      // check if dragging
      if (evt.dragging) {
        overlay.setPosition(undefined);
        return;
      }

      //  check if pointer on map
      let view_extent = props.map.getView().getViewStateAndExtent().extent;
      if (!containsCoordinate(view_extent, evt.coordinate)) {
        overlay.setPosition(undefined);
        pixel.value = null;
        return;
      }

      // update the hover position
      pixel.value = props.map.getEventPixel(evt.originalEvent);
      overlay.setPosition(evt.coordinate);
    });

    // additional event listener to make hover disappear on exiting map
    props.map.getViewport().addEventListener('pointerleave', () => {
      overlay.setPosition(undefined);
    });
  });
</script>

<template>
  <div class="hover" ref="hoverDiv"
    :style="hoverStyle"
    v-html="hoverText">
  </div>
</template>

<style scoped>
  .hover {
    position: relative;
    width: max-content;
    z-index: 3000;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    margin-left: 4px;
    margin-bottom: 4px;
    box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.62);
    pointer-events: none!important;
  }
</style>
<style>
  .ol-viewport {
    overflow: visible !important;
  }
</style>