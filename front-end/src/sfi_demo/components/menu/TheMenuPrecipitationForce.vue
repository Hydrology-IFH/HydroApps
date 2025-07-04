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
    5: "",
    7: i18next.t("menu_precipitationForce_7"),
    9: "",
    11: i18next.t("menu_precipitationForce_11"),
  }
  const steps = [3, 5, 7, 9, 11];

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
  // update slider value if config changes
  config.$subscribe((mutation, state) => {
    if (state.sri !== sliderValue.value) {
      sliderValue.value = state.sri;
    }
  })

  // Arrow sliding
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
  <MenuSlider
    v-show="config.kind=='matrix'"
    v-model="sliderValue"
    :label="$t('menu_PrecipitationForce_label')"
    :min="3"
    :max="11"
    :step=".1"
    :ticks="labels"
    :get-label="getLabel"
    :tooltip="$t('menu_PrecipitationForce_tooltip')"
    :active="!config.region_selection_active"
    @update:focused="toggleArrows"
  />
</template>