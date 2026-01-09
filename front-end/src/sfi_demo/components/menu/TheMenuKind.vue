<script setup>
  import { computed, watchEffect } from "vue";
  import { useTranslation } from "i18next-vue";

  import SelectionInput from "~~/components/inputs/SelectionInput.vue";
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const { i18next } = useTranslation();

  const kinds = computed(() => {
    let _kinds = {
      matrix: i18next.t('menu_kind_matrix'),
      event: i18next.t('menu_kind_event'),
    };
    if (config.region == "Wieslauf"){
      _kinds["nowcast"] = i18next.t('menu_kind_nowcast');
    }

    return _kinds;
  });

  // ensure valid kind when region changes
  watchEffect(() => {
    if (config.kind == "nowcast" && config.region != "Wieslauf") {
      config.kind = "event";
    }
  });

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