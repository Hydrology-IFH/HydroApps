<script setup>
  import { useTranslation } from "i18next-vue";

  import SelectionInput from "~~/components/inputs/SelectionInput.vue";
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const { i18next } = useTranslation();

  const kinds = {
    nowcast: i18next.t('menu_nowcast_kind_nowcast'),
    hindcast: i18next.t('menu_nowcast_kind_hindcast'),
  };
</script>

<template>
  <SelectionInput
    v-model="config.nowcast.kind"
    :label="$t('menu_nowcast_kind_label')"
    :options="kinds"
    :tooltip-msg="$t('menu_nowcast_kind_tooltip')"
    as-buttons
    :active="!config.region_selection_active"
  />
</template>