<script>
import { parameter, year, sri, event_rank } from "./Form.vue"
import { i18n } from './i18n.js';

export default {
  data: function () {
    return {
      parameter: parameter,
      year: year,
      sri: sri,
      event_rank: event_rank
    }
  },
  computed: {
    header: function () {
      switch (this.parameter) {
        case 'duration':
          return i18n.t('map_header_duration', {event_rank: this.event_rank});
        case 'sri':
          return i18n.t('map_header_sri', { event_rank: this.event_rank });
        case 'month':
          return i18n.t('map_header_month', { event_rank: this.event_rank });
        case 'year':
          return i18n.t('map_header_year', { event_rank: this.event_rank });
        case 'NEvents_above_SRI':
          return i18n.t('map_header_NEvents_above', {sri: this.sri});
        case 'Top_SRI_year':
          return i18n.t('map_header_top_sri', { year: this.year });
        default:
          return "";
      }
    }
  },
}
</script>

<template>
  <h4>{{ header }}</h4>
</template>




