<script setup>
  import { watchEffect, ref } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./utils/MenuSlider.vue";

  const config = useConfig();

  const labels = {
    1: "30 min",
    2: "1 h",
    3: "2 h",
    4: "4 h"
  }
  const sliderToDur = {
    1: 30,
    2: 60,
    3: 120,
    4: 240
  }

  const durToSlider = Object.fromEntries(
    Object.entries(sliderToDur).map(
      (val) => [val[1], parseInt(val[0])])
  )

  const sliderValue = ref(durToSlider[config.duration]);
  watchEffect(() => {
    config.duration = sliderToDur[sliderValue.value];
  })
  watchEffect(() => {
    sliderValue.value = durToSlider[config.duration];
  })
</script>
<template>
  <MenuSlider
    v-show="config.kind=='matrix'"
    v-model="sliderValue"
    :label="$t('menu_duration_label')"
    :min="1"
    :max="4"
    :step="1"
    :ticks="labels"
    :get-label="(val) => labels[val]"
    :tooltip="$t('menu_duration_tooltip')"
    :active="!config.region_selection_active"
  />
</template>