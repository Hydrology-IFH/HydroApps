<script setup>
  import { ref, watchEffect, computed, onMounted } from 'vue';

  import MenuSelection from "./utils/MenuSelection.vue";
  import { useLayerLib } from '~/stores/layerLib.js';
  import { useConfig } from '~/stores/config.js';

  const layerLib = useLayerLib();
  const config = useConfig();

  // variables for menu
  const colorscalesKeys = computed(
    () => layerLib.selectedLayer ? Object.keys(layerLib.selectedLayer.styles) : [])
  const colorscalesAvailable = computed(() => colorscalesKeys.value.length > 1)
  window.colorscalesKeys = colorscalesKeys

  // the scale to show in menu
  const menuScale = ref(
    layerLib.selectedLayer ? layerLib.selectedLayer.selectedStyle : null)
  // update on layer change
  watchEffect(() => {
    menuScale.value = layerLib.selectedLayer? layerLib.selectedLayer.selectedStyle: null
  })

  // update style
  const updateScale = () => {
    layerLib.selectedLayer.selectedStyle = menuScale.value
  }
</script>

<template>
  <MenuSelection v-model="menuScale"
              :label="$t('menu_colorscale_label')"
              :options="colorscalesKeys"
              v-show="colorscalesAvailable"
              @change="updateScale"
              :tooltip="$t('menu_colorscale_tooltip')"
              :active="!config.region_selection_active">
  </MenuSelection>
</template>
