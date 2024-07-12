<script setup>
  import { ref, watchEffect } from 'vue';
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./MenuSlider.vue";

  const { i18next } = useTranslation();
  const config = useConfig();

  const sliderValue = ref(config.sri);

  const labels = {
    3: i18next.t("menu_precipitationForce_3"),
    7: i18next.t("menu_precipitationForce_7"),
    9: "",
    11: i18next.t("menu_precipitationForce_11"),
  }
  const steps = [3, 7, 9, 11];

  const getLabel = (value) => {
    if (labels[value]) {
      return labels[value];
    } else {
      let prev = -Infinity;
      let next = Infinity;
      Object.keys(labels).forEach((key) => {
        let dif = parseInt(key) - value;
        if (dif < 0 && (dif > prev)) { prev = parseInt(key) }
        if (dif > 0 && (dif < next)) { next = parseInt(key) }
      });
      return `${labels[prev]} - ${labels[next]}`;
    }
  }

  // check for steps that are available and round values to the nearest step
  watchEffect(() => {
    if (!steps.includes(sliderValue.value)) {
      sliderValue.value = steps.reduce((prev, curr) => {
        return (Math.abs(curr - sliderValue.value) < Math.abs(prev - sliderValue.value) ? curr : prev);
      });
    }
    config.sri = sliderValue.value;
  })
</script>
<template>
  <MenuSlider v-model="sliderValue"
              :label="$t('menu_PrecipitationForce_label')"
              :min="3" :max="11" :step=".1"
              :ticks="labels"
              :getLabel="getLabel"
              :tooltip="$t('menu_PrecipitationForce_tooltip')"/>
</template>