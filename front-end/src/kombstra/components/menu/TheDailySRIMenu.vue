<script setup>
  import { computed, onMounted, ref, provide } from 'vue';

  import SelectionInput from '~~/components/inputs/SelectionInput.vue';
  import DateInput from '~~/components/inputs/DateInput.vue';
  import SliderInput from '~~/components/inputs/SliderInput.vue';
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const allDatesMaxSRI = ref([]);

  const filteredDates = computed(() => {
    if (config.daily_duration === 'short') {
      return allDatesMaxSRI.value.filter(d => d.sri_60 >= config.daily_min_sri).map(d => d.date);
    } else if (config.daily_duration === 'long') {
      return allDatesMaxSRI.value.filter(d => d.sri_240 >= config.daily_min_sri).map(d => d.date);
    } else {
      return [];
    }
  });
  provide('daily_sri-filteredDates', filteredDates);
  provide('daily_sri-allDatesMaxSRI', allDatesMaxSRI);

  onMounted(() => {
    // Fetch available dates
    fetch(`/static/kombstra/daily_events/allDatesMaxSRI.json`)
      .then((res) => { window.res = res; return res.json() })
      .then((data) => {
        let obj = data.map(d => {
          d.date = new Date(d.date);
          return d;
        });
        allDatesMaxSRI.value = obj;
        config.daily_date = filteredDates.value[0];
      });
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
    :allowed-dates="filteredDates"
    :tooltip-msg="$t('daily_date_input_tooltip')"
    :add-day-switcher="true"
    :filters="{ months: [0,1,2,3,9,10,11,12] }"
    :min-date="new Date(Math.min( ...filteredDates ))"
    :max-date="new Date(Math.max( ...filteredDates ))"
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
  <!-- TODO: add plot of daily maximum SRI -->
</template>




