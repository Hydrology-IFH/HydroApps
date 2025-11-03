<script setup>
  import { useTranslation } from "i18next-vue";

  import { useConfig } from '~/stores/config.js';
  import SelectionInput from "~~/components/inputs/SelectionInput.vue";

  const config = useConfig();
  const { i18next } = useTranslation();

  const kinds = {
    matrix: i18next.t('menu_kind_matrix'),
    event: i18next.t('menu_kind_event'),
  }

</script>

<template>
  <SelectionInput
    v-model="config.kind"
    :label="$t('menu_kind_label')"
    :options="kinds"
    :tooltip-msg="$t('menu_kind_tooltip')"
    as-buttons
    :active="!config.region_selection_active"
  />
</template>