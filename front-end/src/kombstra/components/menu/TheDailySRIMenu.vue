<script setup>
  import { onMounted } from 'vue';

  import SelectionInput from '~~/components/inputs/SelectionInput.vue';
  import DateInput from '~~/components/inputs/DateInput.vue';
  import SliderInput from '~~/components/inputs/SliderInput.vue';
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  onMounted(() => {
    config.fetchDailyAllDatesMaxSRI();
  });
</script>

<template>
  <SliderInput
    v-model="config.daily_min_sri"
    :label="$t('daily_min_sri_slider_label')"
    :min="0"
    :max="12"
    :tooltip-msg="$t('daily_min_sri_slider_tooltip')"
    num-field-width="70px"
  />
  <DateInput
    v-model="config.daily_date"
    :label="$t('daily_date_input_label')"
    :allowed-dates="config.daily_filtered_dates"
    :tooltip-msg="$t('daily_date_input_tooltip')"
    :add-day-switcher="true"
    :filters="{ months: [0,1,2,3,9,10,11,12] }"
    :min-date="new Date(Math.min( ...config.daily_filtered_dates ))"
    :max-date="new Date(Math.max( ...config.daily_filtered_dates ))"
    prevent-min-max-navigation
  />
  <SelectionInput
    v-model="config.daily_duration"
    :label="$t('daily_duration_selection_input_label')"
    :options="[{key: 'short', label: $t('daily_duration_option_short')},
               {key: 'long', label: $t('daily_duration_option_long')}]"
    :tooltip-msg="$t('daily_duration_selection_input_tooltip')"
    as-buttons
  />
  <SelectionInput
    v-model="config.daily_modus"
    :label="$t('daily_modus_selection_input_label')"
    :options="[{key: 'sri', label: $t('daily_modus_option_SRI')},
               {key: 'pval', label: $t('daily_modus_option_PVAL')}]"
    :tooltip-msg="$t('daily_modus_selection_input_tooltip')"
    as-buttons
  />
</template>




