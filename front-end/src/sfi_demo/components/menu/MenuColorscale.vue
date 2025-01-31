<script setup>
  import { ref, watchEffect, computed, onMounted } from 'vue';

  import MenuSelection from "./utils/MenuSelection.vue";
  import { useLayerLib } from '~/stores/layerLib.js';
  import { useConfig } from '~/stores/config.js';

  const layerLib = useLayerLib();
  const config = useConfig();

  // possible Colorscales
  // --------------------
  const COLORSCALES = {
    soil_moisture: {
      bathymetry : {
        colorbar: "bathymetry",
        reverse: true,
      },
      salinity : {
        colorbar: "salinity",
        reverse: true,
      },
      NEO_soil_moisture : {
        colorbar: "NEO_soil_moisture",
        reverse: true,
      },
      "Yellow-Green-Blue": {
        colorbar: "YiGnBu",
        reverse: true,
      },
      viridis : {
        colorbar: "viridis",
        reverse: true,
      },
      velocityGreen : {
        colorbar: "velocity-green",
        reverse: true,
      },
      "Orange-Blue": {
        colorbar: "OrBu",
        reverse: false
      },
      temperature : {
        colorbar: "temperature",
        reverse: true,
      },
      EO_soil_moist_div : {
        colorbar: "EO_soil_moist_div",
        reverse: true,
      },
      SVS_soil_moisture : {
        colorbar: "SVS_soil_moisture",
        reverse: true,
      },
      "Plasma reversed" : {
        colorbar: "plasma",
        reverse: true,
      },
      "Plasma" : {
        colorbar: "plasma",
        reverse: false,
      },
      "Red-Blue" : {
        colorbar: "RdBu",
        reverse: true,
      },
      NEO_trmm_rainfall : {
        colorbar: "NEO_trmm_rainfall",
        reverse: true,
      }
    },
    OA: {
      density: {
        colorbar: "density",
        reverse: true,
      },
      bathymetry: {
        colorbar: "bathymetry",
        reverse: true,
      },
      salinity: {
        colorbar: "salinity",
        reverse: true,
      },
      viridis: {
        colorbar: "viridis",
        reverse: true,
      },
      "Yellow-Green-Blue": {
        colorbar: "YiGnBu",
        reverse: true,
      },
      "Plasma": {
        colorbar: "plasma",
        reverse: false,
      },
      "Plasma reversed": {
        colorbar: "plasma",
        reverse: true,
      },
      freesurfaceBlue: {
        colorbar: "freesurface-blue",
        reverse: true,
      },
      "cmocean:rain": {
        colorbar: "cmocean:rain",
        reverse: false,
      },
      "NEO_soil_moisture": {
        colorbar: "NEO_soil_moisture",
        reverse: true,
      },
      "NEO_trmm_rainfall": {
        colorbar: "NEO_trmm_rainfall",
        reverse: true,
      }
    },
    precipitation: {
      "cmocean:rain": {
        colorbar: "cmocean:rain",
        reverse: false,
      },
      density: {
        colorbar: "density",
        reverse: true,
      },
      "NEO_trmm_rainfall": {
        colorbar: "NEO_trmm_rainfall",
        reverse: true,
      },
      "NEO_soil_moisture": {
        colorbar: "NEO_soil_moisture",
        reverse: true,
      },
      "Yellow-Green-Blue": {
        colorbar: "YiGnBu",
        reverse: true,
      },
      "EO_aura_omi_formal": {
        colorbar: "EO_aura_omi_formal",
        reverse: true,
      },
      "Blue-Purple": {
        colorbar: "BluPu",
        reverse: false,
      },
      "salinity": {
        colorbar: "salinity",
        reverse: true,
      },
      "viridis": {
        colorbar: "viridis",
        reverse: true,
      }
    }
  }
  // add original layer settings, like min and max values to COLORSCALES
  Object.keys(COLORSCALES).forEach((para) => {
    Object.keys(COLORSCALES[para]).forEach((styleKey) => {
      COLORSCALES[para][styleKey] = {
        ...layerLib.getLayer(para)._styleInit.colorscale,
        ...COLORSCALES[para][styleKey]
      }
    })
  })

  // variables for menu
  const colorscales_available = computed(
    () => Object.keys(COLORSCALES).includes(layerLib.selectedLayer?.id))
  const colorscales_keys = computed(
    () => colorscales_available.value ? Object.keys(COLORSCALES[layerLib.selectedLayer?.id]) : [])

  // variables for selected scale
  const selected_scales = ref({
    soil_moisture: "bathymetry",
    OA: "density",
    precipitation: "cmocean:rain",
  })

  // the scale to show in menu
  const menu_scale = ref(
    layerLib.selectedLayer ? selected_scales.value[layerLib.selectedLayer.id] : null)
  // update on layer change
  watchEffect(() => {
    menu_scale.value = layerLib.selectedLayer? selected_scales.value[layerLib.selectedLayer.id]: null
  })

  // update style
  const updateScale = () => {
    selected_scales.value[layerLib.selectedLayer.id] = menu_scale.value
    layerLib.selectedLayer.restyle(
      { colorscale: COLORSCALES[layerLib.selectedLayer.id][menu_scale.value] })
  }
</script>

<template>
  <MenuSelection v-model="menu_scale"
              :label="$t('menu_colorscale_label')"
              :options="colorscales_keys"
              v-show="colorscales_available"
              @change="updateScale"
              :tooltip="$t('menu_colorscale_tooltip')"
              :active="!config.region_selection_active">
  </MenuSelection>
</template>
