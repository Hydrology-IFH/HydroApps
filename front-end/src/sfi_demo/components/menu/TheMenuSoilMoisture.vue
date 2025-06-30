<script setup>
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./utils/MenuSlider.vue";

  const { i18next } = useTranslation();
  const config = useConfig();

  const labels = {
    10: i18next.t("menu_SoilMoisture_dry"),
    50: i18next.t("menu_SoilMoisture_avg"),
    90: i18next.t("menu_SoilMoisture_wet")
  };
  const min = {
    matrix: 10,
    event: 5,
  };
  const max = {
    matrix: 90,
    event: 95,
  };

  const getTickTooltip = (value) => {
    return `${value} %nFK`;
  }
</script>
<template>
  <MenuSlider
    v-show="config.kind=='matrix'"
    v-model="config.soilMoisture"
    :label="$t('menu_SoilMoisture_label')"
    :min="min[config.kind]"
    :max="max[config.kind]"
    :step="(max[config.kind]-min[config.kind])/2"
    :ticks="labels"
    :get-label="(val) => labels[val]"
    :tooltip="$t('menu_SoilMoisture_tooltip')"
    :get-tick-tooltips="getTickTooltip"
    :active="!config.region_selection_active"
  />
</template>