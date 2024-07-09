import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import { getColorscaleTileLayerStyle } from "~~/utils/mapLayerStyles.mjs";
import { useConfig } from "~/stores/config.js";

export class Layer {
  constructor(id, {file, style, decimals=2, unit=""}) {
    this.id = id;
    this.file = file;
    this.decimals = decimals;
    this.unit = unit;
    this._styleInit = style;
    this.selected = false;
    this.map = null;
    this._olLayers = {};

    // subscribe to config store
    this.config = useConfig();
    this._config_subscibed = false;
  }

  initMap(map) {
    this.map = map;
  }

  _addConfigSubscription() {
    if (!this._config_subscibed) {
      this.config.$subscribe((mutation) => {
          if (mutation.events?.key === "opacity") {
            this.updateOpacity()
          } else if (mutation.events?.key === "sri" || mutation.events?.key === "duration" || mutation.events?.key === "soilMoisture") {
            this.updateLayer();
          }
      });
      this._config_subscibed = true;
    }
  }

  get url() {
    return `/static/sfi_mockup/Bonndorf/${this.config.sri}/${this.config.duration}/${this.config.soilMoisture}/${this.file}`
  }

  get style() {
    if (!this._style) {
      if (this._styleInit.hasOwnProperty("colorscale")) {
        let opts = this._styleInit.colorscale;
        this._style = getColorscaleTileLayerStyle(
          opts.min, opts.max, opts.colorbar, opts.continous, opts.reverse);
      } else {
        this._style = this._styleInit;
      }
    }
    return this._style;
  }

  get olLayer() {
    if (!this._layerCreated) {
      let new_layer = new TileLayer({
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
      this._olLayers[this.url] = new_layer;
      new_layer.setStyle(this.style);
      new_layer.setOpacity(this.config.opacity/100);
      new_layer.setVisible(this.selected);
      this.map.addLayer(new_layer);
      this._addConfigSubscription();
    }
    return this._olLayers[this.url];
  }

  get _layerCreated() {
    return this._olLayers[this.url]? true : false;
  }

  setOpacity(value) {
    Object.entries(this._olLayers).forEach(([key, layer]) => {
      layer.setOpacity(value);
    });
  }

  updateOpacity() {
    this.setOpacity(this.config.opacity/100);
  }

  updateLayer() {
    Object.entries(this._olLayers).forEach(([key, layer]) => {
      layer.setVisible(false);
    });
    if (this.selected) {
      this.olLayer.setVisible(this.selected);;
    }
  }

  select() {
    this.selected = true;
    this.updateLayer();
    console.info(`Layer "${this.id}" got activated`);
  }

  unselect() {
    this.selected = false;
    this.updateLayer();
    console.info(`Layer "${this.id}" got deactivated`);
  }
}