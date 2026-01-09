<script setup>
  import { ref, watch } from 'vue';
  import { useTranslation } from "i18next-vue";

  import MenuSlider from "./utils/MenuSlider.vue";
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const { i18next } = useTranslation();

  const ensembles = {
    0: i18next.t('menu_nowcast_ensemble_low'),
    1: i18next.t('menu_nowcast_ensemble_med'),
    2: i18next.t('menu_nowcast_ensemble_high'),
  };
  const ensembleKeys = {
    0: "low",
    1: "med",
    2: "high"
  }
  const ensembleSlider = ref(null);
  watch(() => config.nowcast.ensemble, (newVal) => {
    ensembleSlider.value = parseInt(Object.keys(ensembleKeys).find(key => ensembleKeys[key] === newVal));
  }, {
    immediate: true
  });
  watch(ensembleSlider, (newVal) => {
    config.nowcast.ensemble = ensembleKeys[newVal];
  });
</script>

<template>
  <MenuSlider
    v-if="config.nowcast.kind=='nowcast'"
    v-model="ensembleSlider"
    :label="$t('menu_nowcast_ensemble_label')"
    :min="0"
    :max="2"
    :step="1"
    :ticks="ensembles"
    :get-label="(value) => ensembles[value]"
    :tooltip="$t('menu_nowcast_ensemble_tooltip')"
    :active="!config.region_selection_active"
  />
</template>