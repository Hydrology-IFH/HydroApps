<script setup>
  import { watchEffect, ref } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./MenuSlider.vue";

  const config = useConfig();

  const labels = {
    1: "30 min",
    2: "1 h",
    3: "2 h",
  }

  const sliderValue = ref(config.sri);
  watchEffect(() => {
    switch (sliderValue.value) {
      case 1:
        config.duration = 30;
        break;
      case 2:
        config.duration = 60;
        break;
      case 3:
        config.duration = 120;
        break;
    }
  })
</script>
<template>
  <MenuSlider v-model="sliderValue"
              :label="$t('menu_duration_label')"
              :min="1" :max="3" :step="1"
              :ticks="labels"
              :getLabel="(val) => labels[val]"
              :tooltip="$t('menu_duration_tooltip')"/>
</template>