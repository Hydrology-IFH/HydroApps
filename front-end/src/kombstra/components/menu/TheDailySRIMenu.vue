<script setup>
  import { onMounted, ref } from 'vue';

  import SelectionInput from '~~/components/inputs/SelectionInput.vue';
  import DateInput from '~~/components/inputs/DateInput.vue';
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const availableDates = ref([]);

  onMounted(() => {
    // Fetch available dates
    fetch(`/static/kombstra/daily_events/availableDates.json`)
      .then((res) => res.json())
      .then((data) => {
        let dates = data.map(dateStr => {
          let parts = dateStr.split("-");
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        });
        availableDates.value = dates;
      });
  });

</script>

<template>
  <DateInput
    v-model="config.daily_date"
    :label="$t('daily_date_input_label')"
    :allowed-dates="availableDates"
    :tooltip-msg="$t('daily_date_input_tooltip')"
    :add-day-switcher="true"
    :filters="{ months: [0,1,2,3,9,10,11,12] }"
    :min-date="new Date(Math.min( ...availableDates ))"
    :max-date="new Date(Math.max( ...availableDates ))"
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




