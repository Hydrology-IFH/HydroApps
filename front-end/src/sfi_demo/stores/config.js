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
        Karlsbad: "2021-06-18",
        // Karlsbad: "2021-06-29",
        // Karlsbad: "2021-07-04",
        Herrstein: "2018-05-27",
        Otting: "2017-08-15",
        Stadtallendorf: "2020-08-11",
      },

      // matrix settings
      // ---------------

      // pre event soil moisture
      soilMoisture: 50, // one of 5,10,50,90,95

      // precipitation
      sri: 7, // one of 3, 5, 7, 11
      duration: 60, // one of 30, 60, 120 min

      // the dammage layer to show
      damageKind: "avg_dm_ttl", // one of min_dm_ttl, avg_dm_ttl, max_dm_ttl
      preparedness: "medium", // one of low, medium, high
      damagePerHoushold: false, // true, false

      // System settings
      region_selection_active: true,
    })
  })