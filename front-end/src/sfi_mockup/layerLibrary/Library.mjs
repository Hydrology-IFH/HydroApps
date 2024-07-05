import LAYERS from './LAYERS.json';
import { Layer } from './Layer';

export class LayerLib {
  constructor() {
    this.map = null;
    this.layers = LAYERS.map(layerDef => new Layer(layerDef.id, layerDef));
  }

  _selectLayer(layer) {
    if (this.selectedLayer) {
      this.selectedLayer.unselect()
    }
    layer.select()
  }

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
  }

  get selectedLayer() {
    return this.layers.find((layer, key) => layer.visible);
  }

  initMap(map) {
    this.map = map;
    this.layers.forEach(layer => layer.initMap(map));
  }

  getLayer(layerID) {
    let layers = this.layers.filter(layer => layer.id == layerID);
    if (layers.length == 0) {
      console.error(`Layer "${layerID}" not found`);
      return null;
    }
    return layers[0]
  }

  setOpacity(value) {
    this.layers.forEach(layer => layer.setOpacity(value));
  }
}