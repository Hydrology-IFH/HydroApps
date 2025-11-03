import { defineStore } from 'pinia'
const spans = JSON.parse(document.getElementById('spans').textContent);

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      // overall settings
      // ----------------
      parameter: "NEvents_above_SRI",
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
      daily_sri_date: new Date(2006, 4, 1),
      daily_sri_duration: "short" // "short" or "long"
    })
  })