<script setup>
  import { onMounted, ref } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import DateInput from '~~/components/inputs/DateInput.vue';

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
    :label="$t('date_input_daily_sri_label')"
    :allowed-dates="availableDates"
    :tooltip-msg="$t('date_input_daily_sri_tooltip')"
    :add-day-switcher="true"
    :filters="{ months: [0,1,2,3,9,10,11,12] }"
    :min-date="new Date(Math.min( ...availableDates ))"
    :max-date="new Date(Math.max( ...availableDates ))"
    prevent-min-max-navigation
  />
</template>




