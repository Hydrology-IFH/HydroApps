<script setup>
  import { watchEffect, ref, computed } from 'vue';

  import { useConfig } from '~/stores/config.js';
  import MenuInfo from "./utils/MenuInfo.vue";
  import MenuSelection from "./utils/MenuSelection.vue";

  const config = useConfig();

  const REGIONDATES = {
    "Wieslauf": ["2024-06-02"],
    "Bonndorf": ["2015-06-14"],
    "Emmendingen": ["2014-07-20", "2021-06-08"],
  }
  const regionDates = computed(() => {
    return REGIONDATES[config.region] || [];
  });

  // updating config.date on selection changes
  const selected_date = ref(null);
  watchEffect(() => {
    selected_date.value = config.date[config.region];
  });
  const updateDate = () => {
    config.date[config.region] = selected_date.value;
  }
</script>

<template>
  <template v-if="config.kind=='event'">
    <template v-if="regionDates.length==1">
      <MenuInfo
            :label="$t('menu_date_label')"
            :msg="selected_date"
            type="date"
            :tooltip="$t('menu_date_static_tooltip')"
            :active="!config.region_selection_active"/>
    </template>
    <template v-else>
      <MenuSelection
            :label="$t('menu_date_label')"
            :tooltip="$t('menu_date_selection_tooltip')"
            v-model="selected_date"
            :options="regionDates"
            @change="updateDate"
            :active="!config.region_selection_active"/>
    </template>
  </template>

</template>