<script setup>
  import { computed } from 'vue';

  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~/stores/layerLib.js';
  import MapLegendFromStyle from '~~/components/MapLegendFromStyle.vue';

  // define variables
  const layerLib = useLayerLib();
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
    :layerName="layer.name"
    :style="layer.style"
    :map="layerLib.map"
    :unit="layer.unit"
    :valueConverter="valueConverter"
    v-bind="layer.legend"
    :titlePosition="top"
  />
</template>