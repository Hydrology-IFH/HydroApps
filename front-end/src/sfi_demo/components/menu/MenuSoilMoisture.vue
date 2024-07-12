<script setup>
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import MenuSlider from "./MenuSlider.vue";

  const { i18next } = useTranslation();
  const config = useConfig();

  const labels = {
    10: i18next.t("menu_SoilMoisture_10"),
    50: i18next.t("menu_SoilMoisture_50"),
    90: i18next.t("menu_SoilMoisture_90"),
  }

  const getTickTooltip = (value) => {
    return `${value} %nFK`;
  }
</script>
<template>
  <MenuSlider v-model="config.soilMoisture"
              :label="$t('menu_SoilMoisture_label')"
              :min="10" :max="90" :step="40"
              :ticks="labels"
              :getLabel="(val) => labels[val]"
              :tooltip="$t('menu_SoilMoisture_tooltip')"
              :getTickTooltips="getTickTooltip"/>
</template>