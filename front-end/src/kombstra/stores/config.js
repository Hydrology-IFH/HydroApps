import { defineStore } from 'pinia'
const spans = JSON.parse(document.getElementById('spans').textContent);

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      // overall settings
      // ----------------
      parameter: "event_sri",
      slider: 1,
      opacity: 80,
      spans: spans,

      // slider values for parameters
      // ----------------------------------
      year: 2020,
      event_rank: 1,
      sri: 1,

      // parameters for daily data
      // ----------------------------------
      daily_date: new Date(2006, 4, 1),
      daily_duration: "short", // "short" or "long"
      daily_modus: "sri", // "sri" or "pval"
      daily_min_sri: 0,
    }),
    actions: {
      fetchAllDatesMaxSRI() {
        // Implementation for fetching all dates max SRI
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
      }
    }
  })