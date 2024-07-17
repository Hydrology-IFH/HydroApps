import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import { getColorscaleTileLayerStyle } from "~~/utils/mapLayerStyles.mjs";
import { useConfig } from "~/stores/config.js";

export class Layer {
  constructor(id, {file, style, decimals=2, unit="", url, ...kwargs}) {
    this.id = id;
    this.file = file;
    this.decimals = decimals;
    this.unit = unit;
    this._styleInit = style;
    this.selected = false;
    this.map = null;
    this._olLayers = {};
    this._errorLayers = [];
    this._url = url;
    kwargs && Object.entries(kwargs).forEach(([key, value]) => this[key] = value);

    // subscribe to config store
    this.config = useConfig();
    this._config_subscribed = false;
    this._saveConfigState();
  }

  initMap(map) {
    this.map = map;
  }

  _saveConfigState() {
    this._lastConfigState = JSON.parse(JSON.stringify(this.config.$state));
  }

  _addConfigSubscription() {
    if (!this._config_subscribed) {
      this.config.$subscribe((mutation, state) => {
        if (state.opacity !== this._lastConfigState?.opacity) {
          this.updateOpacity()
        } else if ((state.opacity !== this._lastConfigState?.opacity) ||
                    (state.sri !== this._lastConfigState?.sri) ||
                    (state.duration !== this._lastConfigState?.duration)) {
          this.updateLayer();
        }
        this._saveConfigState()
      });
      this._config_subscribed = true;
    }
  }

  get url() {
    if (this._url) return this._url({sri: this.config.sri, duration: this.config.duration, soilMoisture: this.config.soilMoisture});
    return `/static/sfi_demo/Bonndorf/${this.config.sri}/${this.config.duration}/${this.config.soilMoisture}/${this.file}`
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
        visible: this.selected,
        style: this.style,
        opacity: this.config.opacity/100
      });
      // add error handling
      new_layer.on("change", (e) => {
        let src = e.target.getSource();
        if (src.state_ == "error") {
          this._errorLayers.push(src.getKey());
        }
      })
      // add layer to map
      this._olLayers[this.url] = new_layer;
      this.map.addLayer(new_layer);
      this._addConfigSubscription();
    }
    return this._olLayers[this.url];
  }

  get _layerCreated() {
    return this._olLayers[this.url]? true : false;
  }

  get hasError() {
    return this._errorLayers.includes(this.url);
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
    let olLayer = this.selected? this.olLayer:{}
    Object.entries(this._olLayers).forEach(([key, layer]) => {
      layer.setVisible(this.selected && layer==olLayer);
    });
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