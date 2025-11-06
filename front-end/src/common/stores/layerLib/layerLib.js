import { defineStore, acceptHMRUpdate  } from 'pinia'
import { Layer } from './Layer.mjs'

export const useLayerLib = defineStore(
  "layerLib",
  {
    state: () => ({
      map: null,
      layers: [],
      config: null
    }),

    getters: {
      selectedLayer() {
        return this.layers.find((layer, key) => layer.selected);
      }
    },

    actions: {
      _selectLayer(layer) {
        if (this.selectedLayer) {
          this.selectedLayer.unselect()
        }
        layer.select()
      },

      selectLayer(layer) {
        // check if input is layer or layer id
        if (typeof layer == "string") {
          layer = this.getLayer(layer)
        } else {
          // check if layer is in library
          if (!this.layers.includes(layer)) {
            console.error("Layer not in library")
            return
          }
        }

        // add layer to map and select
        if (layer != null) {
          this._selectLayer(layer);
        } else {
          console.error("Could not select layer: ", layer);
        }
      },

      initConfig(config) {
        this.config = config;
        this.layers.forEach(layer => layer.initConfig(config));
      },

      initLayers(layerOpts) {
        this.layers = layerOpts.map(layerOpt => new Layer(layerOpt))
        if (this.map != null) {
          this.layers.forEach(layer => layer.initMap(this.map));
        }
        if (this.config != null) {
          this.layers.forEach(layer => layer.initConfig(this.config));
        }
      },

      initMap(map) {
        this.map = map;
        this.layers.forEach(layer => layer.initMap(map));
      },

      getLayer(layerID) {
        let layers = this.layers.filter(layer => layer.id == layerID);
        if (layers.length == 0) {
          console.error(`Layer "${layerID}" not found`);
          return null;
        }
        return layers[0]
      },

      setOpacity(value) {
        this.layers.forEach(layer => layer.setOpacity(value));
      }
    }
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLayerLib, import.meta.hot))
//   import.meta.hot.accept("./Layer/LAYERS.js", ({ LAYERS }) => {
//     console.log("updating LAYERS");
//     let store = useLayerLib();
//     let selectedLayerID = store.selectedLayer.id;
//     store.layers.forEach(layer => store.map.removeLayer(layer.olLayer));
//     store.layers = LAYERS.map(layerDef => new Layer(layerDef));
//     store.layers.forEach(layer => layer.initMap(store.map));
//     store.selectLayer(selectedLayerID);
//   });
}