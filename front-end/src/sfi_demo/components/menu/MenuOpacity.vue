<script setup>
  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./utils/MenuSlider.vue";

  const config = useConfig();
  const labels = {
    0: "0 %",
    100: "100 %",
  }
</script>
<template>
  <MenuSlider v-model="config.opacity"
              :label="$t('menu_opacity_label')"
              :min="0" :max="100" :step="1"
              :ticks="labels"
              :getLabel="(val) => val"
              :tooltip="$t('menu_opacity_tooltip')"
              :active="!config.region_selection_active"/>
</template>