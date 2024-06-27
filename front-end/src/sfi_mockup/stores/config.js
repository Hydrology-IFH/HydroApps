import { defineStore } from 'pinia'

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      // pre event soil moisture
      soil_moisture: "event", // one of event, dry, wet

      // radar precipitation
      precip_variant: "live", // one of live, version2

      // active layer
      active_layer: null,

      // opacity
      opacity: 0.5,

    }),
  })