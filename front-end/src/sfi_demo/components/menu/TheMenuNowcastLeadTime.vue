<script setup>
  import SelectionInput from "~~/components/inputs/SelectionInput.vue";
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();

  const times = {
    "-45": "45 min",
    "-15": "15 min",
  };
</script>

<template>
  <SelectionInput
    v-if="config.nowcast.kind === 'nowcast'"
    v-model="config.nowcast.leadTime"
    :label="$t('menu_nowcast_lead-time_label')"
    :options="times"
    :tooltip-msg="$t('menu_nowcast_lead-time_tooltip')"
    as-buttons
    :active="!config.region_selection_active"
  />
</template>