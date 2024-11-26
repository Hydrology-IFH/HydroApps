<script setup>
  import { watchEffect, ref } from 'vue';

  import { useConfig } from '~/stores/config.js';
  import MenuInfo from "./utils/MenuInfo.vue";

  const config = useConfig();

</script>

<template>
  <MenuInfo :label="$t('menu_date_label')"
            :msg="config.date[config.region]"
            type="date"
            :tooltip="$t('menu_region_tooltip')"/>
</template>