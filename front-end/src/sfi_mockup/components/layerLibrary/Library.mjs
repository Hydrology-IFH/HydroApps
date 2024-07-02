import LAYERS from './LAYERS.json';
import { Layer } from './Layer';

export class LayerLib {
  constructor(map) {
    this.map = map;
    this.layers = [];
  }

  _activateLayer(layer) {
    if (this.activeLayer) {
      this.activeLayer.visible = false
    }

    layer.visible = true;
  }

  activateLayer(name) {
    let layers = this.layers.filter(layer => layer.name == name)
    if (layers.length > 0) {
      this._activateLayer(layers[0]);
    } else {
      let LAYER = LAYERS.filter(layerDef => layerDef.name == name);
      if (LAYER.length > 0) {
        let layer = new Layer(name, LAYER[0]);
        console.log("this", this);
        this.map.addLayer(layer.olLayer);
        console.log(layer);
        this.layers.push(layer);
        this._activateLayer(layer);
      } else {
        console.error(`Layer ${name} not found`);
      }
    }
  }

  get activeLayer() {
    return this.layers.find((layer, key) => layer.visible);
  }
}