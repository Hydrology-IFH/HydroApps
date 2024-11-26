<script setup>
  import { ref, watchEffect } from 'vue';
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./utils/MenuSlider.vue";

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
      let diffs = Object.keys(labels).map((key_val) => parseInt(key_val) - parseInt(value))
      let prev_index = diffs.indexOf(
        diffs.filter(val => val < 0)
          .reduce((prev, curr) => Math.max(prev, curr)))
      let next_index = diffs.indexOf(
        diffs.filter(val => val > 0)
          .reduce((prev, curr) => Math.min(prev, curr)))
      let prev = Object.keys(labels)[prev_index]
      let next = Object.keys(labels)[next_index]

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

  const arrowEventListener = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      sliderValue.value = steps[steps.indexOf(sliderValue.value) - 1] || steps[0];
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      sliderValue.value = steps[steps.indexOf(sliderValue.value) + 1] || steps[steps.length - 1];
    }
  }

  const toggleArrows = (state) => {
    if (state) {
      window.addEventListener("keydown", arrowEventListener)
    } else {
      window.removeEventListener("keydown", arrowEventListener)
    }
  }
</script>
<template>
  <MenuSlider v-model="sliderValue"
              v-if="config.kind=='matrix'"
              :label="$t('menu_PrecipitationForce_label')"
              :min="3" :max="11" :step=".1"
              :ticks="labels"
              :getLabel="getLabel"
              :tooltip="$t('menu_PrecipitationForce_tooltip')"
              @update:focused="toggleArrows"/>
</template>