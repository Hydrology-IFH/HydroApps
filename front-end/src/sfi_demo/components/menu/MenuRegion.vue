<script setup>
  import { watchEffect, ref } from 'vue';

  import { useConfig } from '~/stores/config.js';
  import MenuSelection from "./utils/MenuSelection.vue";

  const config = useConfig();

  const regions = ["Bonndorf", "Wieslauf"];

</script>

<template>
  <MenuSelection v-model="config.region"
              :label="$t('menu_region_label')"
              :options="regions"
              :tooltip="$t('menu_region_tooltip')"/>
</template>