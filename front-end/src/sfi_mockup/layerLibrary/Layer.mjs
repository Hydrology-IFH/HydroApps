import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import { getColorscaleTileLayerStyle } from "~/common/utils/mapLayerStyles.mjs";
import { useConfig } from "../stores/config.js";

export class Layer {
  constructor(id, {file, style}) {
    this.id = id;
    this.file = file;
    this._style = style;
    this.onMap = false;
    this.map = null;
    this.config = useConfig();
  }

  initMap(map) {
    this.map = map;
  }

  get url() {
    return `/static/sfi_mockup/Bonndorf/${this.config.sri}/${this.config.duration}/${this.config.soilMoisture}/${this.file}`
  }

  get style() {
    if (this._style.hasOwnProperty("colorscale")) {
      let opts = this._style.colorscale;
      return getColorscaleTileLayerStyle(
        opts.min, opts.max, opts.colorbar, opts.continous, opts.reverse);
    } else {
      return this._style;
    }
  }

  get visible() {
    return this.hasOwnProperty("_olLayer") ? this.olLayer.getVisible() : false;
  }

  set visible(value) {
    if (this.hasOwnProperty("_olLayer")) {
      this.olLayer.setVisible(value);
    }
  }

  get olLayer() {
    if (!this._olLayer) {
      this._olLayer = new TileLayer({
        source: new GeoTIFF({
          sources: [{ url: this.url }],
          sourceOptions: {
            allowFullFile: true,
          },
          interpolate: false,
          normalize: false
        }),
        visible: false
      });
      this._olLayer.setStyle(this.style);
      this._olLayer.setOpacity(this.config.opacity);
    }
    return this._olLayer;
  }

  setOpacity(value) {
    if (this.hasOwnProperty("_olLayer")) {
      this.olLayer.setOpacity(value);
    }
  }

  checkOrAddToMap() {
    if (!this.onMap) {
      if (this.map == null) {
        new Error("Map not initialized");
      }
      this.map.addLayer(this.olLayer);
      this.onMap = true;
    }
  }

  select() {
    this.checkOrAddToMap(this.map);
    this.visible = true;
    console.info(`Layer "${this.id}" got activated`);
  }

  unselect() {
    this.visible = false;
    console.info(`Layer "${this.id}" got deactivated`);
  }
}