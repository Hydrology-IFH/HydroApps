<script setup>
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./utils/MenuSlider.vue";

  const { i18next } = useTranslation();
  const config = useConfig();

  const labels = {
    matrix: {
      10: i18next.t("menu_SoilMoisture_dry"),
      50: i18next.t("menu_SoilMoisture_avg"),
      90: i18next.t("menu_SoilMoisture_wet"),
    },
    event: {
      5: i18next.t("menu_SoilMoisture_dry"),
      50: i18next.t("menu_SoilMoisture_avg"),
      95: i18next.t("menu_SoilMoisture_wet"),
    }
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
  <MenuSlider v-model="config.soilMoisture"
              v-if="config.kind=='matrix'"
              :label="$t('menu_SoilMoisture_label')"
              :min="min[config.kind]" :max="max[config.kind]"
              :step="(max[config.kind]-min[config.kind])/2"
              :ticks="labels[config.kind]"
              :getLabel="(val) => labels[val]"
              :tooltip="$t('menu_SoilMoisture_tooltip')"
              :getTickTooltips="getTickTooltip"/>
</template>