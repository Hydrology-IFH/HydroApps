<script setup>
  import { useConfig } from '~/stores/config.js';
  import SelectionInput from '~~/components/inputs/SelectionInput.vue';

  const config = useConfig();

</script>

<template>
  <SelectionInput
    v-model="config.daily_sri_duration"
    :label="$t('selection_input_daily_sri_duration_label')"
    :options="[{key: 'short', label: $t('daily_sri_duration_option_short')},
               {key: 'long', label: $t('daily_sri_duration_option_long')}]"
    :tooltip-msg="$t('selection_input_daily_sri_duration_tooltip')"
    as-buttons
  />
</template>




