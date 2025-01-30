<script setup>
  import { ref, watchEffect, computed, onMounted } from 'vue';

  import MenuSelection from "./utils/MenuSelection.vue";
  import { useLayerLib } from '~/stores/layerLib.js';

  const layerLib = useLayerLib();
  const STYLES = {
    soil_moisture: {
      salinity : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "salinity",
          continous: true,
          reverse: true,
        },
      },
      NEO_soil_moisture : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "NEO_soil_moisture",
          continous: true,
          reverse: true,
        },
      },
      YlGnBu: {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "YiGnBu",
          continous: true,
          reverse: true,
        },
      },
      bathymetry : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "bathymetry",
          continous: true,
          reverse: true,
        },
      },
      viridis : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "viridis",
          continous: true,
          reverse: true,
        },
      },
      velocityGreen : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "velocity-green",
          continous: true,
          reverse: true,
        },
      },
      OwnRedYelBlu: {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "soil_moisture",
          continous: true,
          reverse: false,
        }
      },
      temperature : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "temperature",
          continous: true,
          reverse: true,
        },
      },
      EO_soil_moist_div : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "eo_soil_moist_div",
          continous: true,
          reverse: true,
        },
      },
      SVS_soil_moisture : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "svs_soil_moisture",
          continous: true,
          reverse: true,
        },
      },
      plasma : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "plasma",
          continous: true,
          reverse: true,
        },
      },
      RdBu : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "RdBu",
          continous: true,
          reverse: true,
        },
      },
      NEO_ceres_net : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "NEO_ceres_net",
          continous: true,
          reverse: false,
        },
      },
      NEO_trmm_rainfall : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "NEO_trmm_rainfall",
          continous: true,
          reverse: true,
        },
      },
      bluered : {
        colorscale: {
          min: 0,
          max: 100,
          colorbar: "bluered",
          continous: true,
          reverse: true,
        },
      }
    },
    OA: {
      bathymetry: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "bathymetry",
          continous: true,
          reverse: true,
        },
      },
      salinity: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "salinity",
          continous: true,
          reverse: true,
        },
      },
      viridis: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "viridis",
          continous: true,
          reverse: true,
        },
      },
      YlGnBu: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "YiGnBu",
          continous: true,
          reverse: true,
        },
      },
      plasma: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "plasma",
          continous: true,
          reverse: false,
        },
      },
      plasma_rev: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "plasma",
          continous: true,
          reverse: true,
        },
      },
      density: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "density",
          continous: true,
          reverse: true,
        },
      },
      freesurfaceBlue: {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "freesurface-blue",
          continous: true,
          reverse: true,
        },
      },
      "cmocean:rain": {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "cmocean:rain",
          continous: true,
          reverse: false,
        },
      },
      "NEO_soil_moisture": {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "NEO_soil_moisture",
          continous: true,
          reverse: true,
        },
      },
      "NEO_trmm_rainfall": {
        colorscale: {
          min: 0,
          max: 90,
          colorbar: "neo_trmm_rainfall",
          continous: true,
          reverse: true,
        },
      }
    },
    precipitation: {
      "cmocean:rain": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "cmocean:rain",
          continous: true,
          reverse: false,
        },
      },
      density: {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "density",
          continous: true,
          reverse: true,
        },
      },
      "NEO_trmm_rainfall": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "neo_trmm_rainfall",
          continous: true,
          reverse: true,
        },
      },
      "NEO_soil_moisture": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "NEO_soil_moisture",
          continous: true,
          reverse: true,
        },
      },
      "YlGnBu": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "YiGnBu",
          continous: true,
          reverse: true,
        },
      },
      EO_aura_omi_formal: {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "eo_aura_omi_formal",
          continous: true,
          reverse: true,
        },
      },
      "markus_precip": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "precip",
          continous: true,
          reverse: false,
        },
      },
      "salinity": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "salinity",
          continous: true,
          reverse: true,
        },
      },
      "viridis": {
        colorscale: {
          min: 0,
          max: 120,
          colorbar: "viridis",
          continous: true,
          reverse: true,
        },
      }
    }
  }

  const selected_style = ref({
    soil_moisture: "bathymetry",
    OA: "density",
    precipitation: "cmocean:rain",
  })
  const style = ref(layerLib.selectedLayer? selected_style.value[layerLib.selectedLayer.id]: null)
  watchEffect(() => {
    style.value = layerLib.selectedLayer? selected_style.value[layerLib.selectedLayer.id]: null
  })

  const styles_available = computed(
    () => Object.keys(STYLES).includes(layerLib.selectedLayer?.id))
  const styles_keys = computed(
    () => styles_available.value? Object.keys(STYLES[layerLib.selectedLayer?.id]): [])

  const updateStyle = () => {
    console.log("updateStyle", layerLib.selectedLayer.id, style.value)
    selected_style.value[layerLib.selectedLayer.id] = style.value
    layerLib.selectedLayer.restyle(STYLES[layerLib.selectedLayer.id][style.value])
  }

  onMounted(() => {
    Object.keys(selected_style.value).forEach((key) => {
      layerLib.getLayer(key).restyle(STYLES[key][selected_style.value[key]])
    })
  })
</script>

<template>
  <MenuSelection v-model="style"
              label="Colorbar"
              :options="styles_keys"
              v-show="styles_available"
              @change="updateStyle">
  </MenuSelection>
</template>
