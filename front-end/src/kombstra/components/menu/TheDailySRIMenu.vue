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
    v-model="config.daily_sri_date"
    :label="$t('daily_sri_date_input_label')"
    :allowed-dates="availableDates"
    :tooltip-msg="$t('daily_sri_date_input_tooltip')"
    :add-day-switcher="true"
    :filters="{ months: [0,1,2,3,9,10,11,12] }"
    :min-date="new Date(Math.min( ...availableDates ))"
    :max-date="new Date(Math.max( ...availableDates ))"
    prevent-min-max-navigation
  />
  <SelectionInput
    v-model="config.daily_sri_duration"
    :label="$t('daily_sri_duration_selection_input_label')"
    :options="[{key: 'short', label: $t('daily_sri_duration_option_short')},
               {key: 'long', label: $t('daily_sri_duration_option_long')}]"
    :tooltip-msg="$t('daily_sri_duration_selection_input_tooltip')"
    as-buttons
  />
  <SelectionInput
    v-model="config.daily_sri_modus"
    :label="$t('daily_sri_modus_selection_input_label')"
    :options="[{key: 'SRI', label: $t('daily_sri_modus_option_SRI')},
               {key: 'P', label: $t('daily_sri_modus_option_P')}]"
    :tooltip-msg="$t('daily_sri_modus_selection_input_tooltip')"
    as-buttons
  />
</template>




