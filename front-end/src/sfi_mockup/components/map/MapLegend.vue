<script setup>
  import { computed } from 'vue';

  import { useConfig } from '~/stores/config.js';
  import MapLegendFromStyle from '~~/components/MapLegendFromStyle.vue';

  // define variables
  const layerLib = useConfig().layerLib;
  const layer = computed(() => layerLib.selectedLayer);

  const valueConverter = computed(() => {
    if (layer.value.valueConverter) {
      return layer.value.valueConverter;
    }
    return (x) => x;
  })
</script>

<template>
  <MapLegendFromStyle
    :layer_name="layer.name"
    :style="layer.style"
    :map="layerLib.map"
    :unit="layer.unit"
    :valueConverter="valueConverter"
    v-bind="layer.legend"
    :titlePosition="top"
  />
</template>