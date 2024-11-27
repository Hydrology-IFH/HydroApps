import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import { getColorscaleTileLayerStyle } from "~~/utils/mapLayerStyles.mjs";
import { useConfig } from "~/stores/config.js";

export class Layer {
  constructor({ id,
                file,
                style,
                decimals = 2,
                unit = "",
                url,
                child_layer,
                z_index = 0,
                condition,
                openlayer_options,
                ...kwargs }) {
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
    this.z_index = z_index;
    this.condition = condition;
    this.openlayer_options = openlayer_options;
    kwargs && Object.entries(kwargs).forEach(([key, value]) => this[key] = value);

    // subscribe to config store
    this.config = useConfig();
    this._config_subscribed = false;
    this._saveConfigState();

    // add child layer
    if (child_layer) {
      this._child_layer = new Layer({...child_layer, z_index:z_index+1});
    }
  }

  initMap(map) {
    this.map = map;
    if (this._child_layer) this._child_layer.initMap(map);
  }

  _saveConfigState() {
    this._lastConfigState = JSON.parse(JSON.stringify(this.config.$state));
  }

  _addConfigSubscription() {
    if (!this._config_subscribed) {
      this.config.$subscribe((mutation, state) => {
        if (state.opacity !== this._lastConfigState?.opacity) {
          this.updateOpacity()
        } else if ( (state.region !== this._lastConfigState?.region) ||
                    (state.kind !== this._lastConfigState?.kind) ||
                    (state.date !== this._lastConfigState?.date) ||
                    (state.soilMoisture !== this._lastConfigState?.soilMoisture) ||
                    (state.sri !== this._lastConfigState?.sri) ||
                    (state.duration !== this._lastConfigState?.duration) ||
                    (state.show_sfgf !== this._lastConfigState?.show_sfgf)) {
          this._updateLayer();
        }
        this._saveConfigState()
      });
      this._config_subscribed = true;
    }
  }

  get url() {
    if (this._url) return this._url({
      region: this.config.region,
      kind: this.config.kind,
      sri: this.config.sri,
      duration: this.config.duration,
      soilMoisture: this.config.soilMoisture,
      date: this.config.date[this.config.region]
    });
    let base_url = `/static/sfi_demo/${this.config.region}/${this.config.kind}`
    if (this.config.kind == "matrix") {
      return `${base_url}/${this.config.sri}/${this.config.duration}/${this.config.soilMoisture}/${this.file}`
    } else if (this.config.kind == "event") {
      return `${base_url}/${this.config.date[this.config.region]}/${this.file}`
    } else {
      console.error("Invalid kind for layer")
      return ""
    }
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
        visible: this.visible,
        style: this.style,
        opacity: this.config.opacity/100
      });

      // set additional options
      if (this.openlayer_options) {
        Object.entries(this.openlayer_options).forEach(([key, value]) => {
          new_layer.set(key, value);
        });
      }

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

      new_layer.setZIndex(this.z_index);
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

  _updateLayer() {
    let olLayer = this.visible? this.olLayer:{}
    Object.entries(this._olLayers).forEach(([key, layer]) => {
      layer.setVisible(this.visible && layer==olLayer);
    });
  }

  select() {
    this.selected = true;
    this._updateLayer();
    if (this._child_layer) this._child_layer.select();
    this._addConfigSubscription();
  }

  unselect() {
    this.selected = false;
    this._updateLayer();
    if (this._child_layer) this._child_layer.unselect();
  }

  get visible() {
    if (this.condition === undefined) {
      return this.selected;
    } else {
      return this.selected && this.condition(this.config);
    }
  }
}