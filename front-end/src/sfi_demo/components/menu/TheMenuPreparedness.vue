<script setup>
  import { watchEffect, ref } from 'vue';
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~/stores/layerLib.js';
  import SelectionInput from "~~/components/inputs/SelectionInput.vue";

  const config = useConfig();
  const layerLib = useLayerLib();
  const { i18next } = useTranslation();

  const labels = {
    1: i18next.t('menu_preparedness_low'),
    2: i18next.t('menu_preparedness_medium'),
    3: i18next.t('menu_preparedness_high'),
  }

  const sliderToPrep = {
    1: "low",
    2: "medium",
    3: "high",
  }
  const prepToSlide = Object.fromEntries(
    Object.entries(sliderToPrep).map(
      (val) => [val[1], parseInt(val[0])])
  )

  const sliderValue = ref(prepToSlide[config.preparedness]);
  watchEffect(() => {
    config.preparedness = sliderToPrep[sliderValue.value];
  })
  watchEffect(() => {
    sliderValue.value = prepToSlide[config.preparedness];
  })
</script>
<template>
  <SelectionInput
    v-show="layerLib.selectedLayer?.id=='damage'"
    v-model="sliderValue"
    :label="$t('menu_preparedness_label')"
    :min="1"
    :max="3"
    :step="1"
    :ticks="labels"
    :get-label="(val) => labels[val]"
    :tooltip-msg="$t('menu_preparedness_tooltip')"
    :active="!config.region_selection_active"
  />
</template>