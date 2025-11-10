<script setup>
  import { computed } from 'vue';
  import { useTranslation } from 'i18next-vue';

  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
  const { i18next } = useTranslation();

  const header = computed(() => {
    switch (config.parameter) {
      case 'duration':
        return i18next.t('map_header_duration', {event_rank: config.event_rank});
      case 'event_sri':
        return i18next.t('map_header_sri', { event_rank: config.event_rank });
      case 'month':
        return i18next.t('map_header_month', { event_rank: config.event_rank });
      case 'year':
        return i18next.t('map_header_year', { event_rank: config.event_rank });
      case 'NEvents_above_SRI':
        return i18next.t('map_header_NEvents_above', {sri: config.sri});
      case 'Top_SRI_year':
        return i18next.t('map_header_top_sri', {year: config.year});
      case 'daily':
        let date = config.daily_date.toLocaleDateString(
          i18next.language,
          { year: 'numeric', month: 'long', day: 'numeric' })
        if (config.daily_modus === 'pval') {
          if (config.daily_duration == "short") {
            return i18next.t('map_header_daily_pval_short', { date });
          } else {
            return i18next.t('map_header_daily_pval_long', { date });
          }
        } else {
          if (config.daily_duration == "short") {
            return i18next.t('map_header_daily_sri_short', { date });
          } else {
            return i18next.t('map_header_daily_sri_long', { date });
          }
        }
      default:
        return "";
    }
  });
</script>

<template>
  <h4>{{ header }}</h4>
</template>




