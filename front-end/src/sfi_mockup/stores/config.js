import { defineStore } from 'pinia'
import { LayerLib } from '../layerLibrary/Library';

export const useConfig = defineStore(
  "config",
  {
    state: () => ({
      // pre event soil moisture
      soilMoisture: 50, // one of 10,50,90

      // precipitation
      sri: 7, // one of 3, 7, 11
      duration: 60, // one of 30, 60, 120 min

      // opacity
      opacity: 80,

      // layer lib
      layerLib: new LayerLib(),

    })
  })