import { defineStore } from 'pinia'

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      // overall settings
      // ----------------
      region: "", // one of Bonndorf, Wieslauf
      kind: "matrix", // one of matrix, event
      opacity: 80,
      show_sfgf: false,

      // event settings
      // --------------

      // selected event date per region
      date: {
        Bonndorf: "2015-06-14", // yyyy-mm-dd of the event
        Wieslauf: "2024-06-02",
        Emmendingen: "2014-07-20",
      },

      // matrix settings
      // ---------------

      // pre event soil moisture
      soilMoisture: 50, // one of 5,10,50,90,95

      // precipitation
      sri: 7, // one of 3, 5, 7, 11
      duration: 60, // one of 30, 60, 120 min

      // System settings
      region_selection_active: true,
    })
  })