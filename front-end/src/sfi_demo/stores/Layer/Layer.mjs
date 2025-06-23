import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { getColorscaleTileLayerStyle, getColormap } from "~~/utils/mapLayerStyles.mjs";
import { useConfig } from "~/stores/config.js";
import "./extraColormaps.js";

class BaseLayer {
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
                valueConverter,
                valueConverterConfig,
                ...kwargs }) {

    if (this.constructor === BaseLayer) {
      throw new TypeError('Abstract class "BaseLayer" can\'t be instantiated directly');
    }

    this.id = id;
    this.file = file;
    this.decimals = decimals;
    this._unit = unit;
    this._styleInit = style;
    this.selected = false;
    this.map = null;
    this._olLayers = {};
    this._errorLayers = [];
    this._url = url;
    this.z_index = z_index;
    this.condition = condition;
    this.openlayer_options = openlayer_options;
    this._valueConverter = valueConverter;
    this.valueConverterConfig = valueConverterConfig;
    this.relevantConfigs = [
      'region', 'kind', 'date', 'sri', 'duration', 'soilMoisture',
      "preparedness", "damageKind", "show_sfgf", "region_selection_active"];
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
        }
        if (this.relevantConfigs.some(key => state[key] !== this._lastConfigState?.[key])) {
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

  get unit() {
    if (this._unit instanceof Function) {
      return this._unit(this.config);
    }
    return this._unit;
  }

  get valueConverter() {
    if (this.valueConverterConfig instanceof Function) {
      return this.valueConverterConfig(this.config);
    }
    return this._valueConverter;
  }

  get styles() {
    if (!this._styles) {
      if (this._styleInit.hasOwnProperty("options")) {
        //  create all colorscales with default options
        var defaultColorscaleOpts = this._styleInit.options.defaultColorscaleOpts || {};
        this._styles = {};
        Object.entries(this._styleInit.options.colorscales||{}).forEach(([key, opts]) => {
          this._styles[key] = {
            colorscale: { ...defaultColorscaleOpts, ...opts }
          };
        });

        // create all colormaps with default options, only used for Vector layers
        var defaultColormapsOpts = this._styleInit.options.defaultColormapsOpts || {};
        Object.entries(this._styleInit.options.colormaps||{}).forEach(([key, opts]) => {
          this._styles[key] = {
            colormap: { ...defaultColormapsOpts, ...opts }
          };
        });

        //  add styles
        Object.entries(this._styleInit.options.styles||{}).forEach(([key, style]) => {
          this._styles[key] = style;
        });

        // set default style
        this.selectedStyle = this._styleInit.options.defaultKey;
      } else {
        this._styles = { main: this._styleInit };
      }
    }
    return this._styles;
  }

  get selectedStyle() {
    return this._selectedStyle || "main";
  }

  set selectedStyle(value) {
    if (Object.keys(this.styles).includes(value)) {
      this._selectedStyle = value;
    } else {
      console.error(`Selected style ${value} not found in available styles`);
    }
    this.restyle(this.style);
  }

  get style() {
    return this.styles[this.selectedStyle];
  }

  get legendStyle(){
    return this.styles[this.selectedStyle];
  }

  createOlLayer() {
    // implement in supclasses
  }

  get olLayer() {
    if (!this._layerCreated) {
      let new_layer = this.createOlLayer();

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

  restyle(style) {
    delete this._style
    this._styleInit = style;
    Object.entries(this._olLayers).forEach(([key, layer]) => {
      layer.setStyle(this.style);
    });
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
    if (this.config.region_selection_active) {
      return false;
    }
    if (this.condition === undefined) {
      return this.selected;
    } else {
      return this.selected && this.condition({ config: this.config });
    }
  }
}

class GeoTiffLayer extends BaseLayer {
  constructor({ ...kwargs }) {
    super({ ...kwargs });
  }

  createOlLayer() {
    return new TileLayer({
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
      opacity: this.config.opacity / 100
    });
  }

  get style(){
    if (this.styles[this.selectedStyle].hasOwnProperty("colorscale")) {
      this.styles[this.selectedStyle] = getColorscaleTileLayerStyle(this.styles[this.selectedStyle].colorscale);
    }
    return super.style;
  }
}

class GeoJSONLayer extends BaseLayer {
  constructor({ propertyName, ...kwargs }) {
    super({ ...kwargs });

    if (this._styleInit.function){
      this._styleFunction = this._styleInit.function;
    }

    this._propertyName = propertyName;
  }

  get propertyName() {
    if (this._propertyName) {
      if (this._propertyName instanceof Function) {
        return this._propertyName(this.config);
      } else {
        return this._propertyName;
      }
    }
    return undefined;
  }

  createOlLayer() {
    return new VectorLayer({
      source: new VectorSource({
        url: this.url,
        format: new GeoJSON({dataProjection: "EPSG:25832", featureProjection: "EPSG:25832" })
      }),
      visible: this.visible,
      style: this.style,
      opacity: this.config.opacity / 100,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      className: "geojson-layer"
    });
  }

  get style() {
    if (this._styleFunction) {
      return this._styleFunction({ config, cmap: this.cmap });
    }
    return super.style;
  }

  get cmap() {
    if (this.styles[this.selectedStyle].hasOwnProperty("colormap")) {
      let colors = this.styles[this.selectedStyle].colormap.colors;
      let ranges = this.styles[this.selectedStyle].colormap.ranges;
      if (ranges instanceof Function) {
        ranges = ranges(this.config);
      }
      return (val) => {
        let index = ranges.findIndex(range => val >= range[0] && val < range[1]);
        return colors[index];
      }
    } else if (this.styles[this.selectedStyle].hasOwnProperty("colorscale")) {
      return getColormap(this.styles[this.selectedStyle].colorscale);
    }
  }

  get legendStyle() {
    if (this.styles[this.selectedStyle].hasOwnProperty("colorscale")) {
      return getColorscaleTileLayerStyle(this.styles[this.selectedStyle].colorscale);
    } else if (this.styles[this.selectedStyle].hasOwnProperty("colormap")) {
      let colors = this.styles[this.selectedStyle].colormap.colors;
      let ranges = this.styles[this.selectedStyle].colormap.ranges;
      if (ranges instanceof Function) {
        ranges = ranges(this.config);
      }
      return {
        color: [
          "case",
          ["!=", ["band", 2], 0],
          ["case",
            ...ranges.map((range, index) => [["between", ["band", 1], range[0], range[1]], colors[index]]).flat(),
            ["color", 0, 0, 0, 0],
          ]
        ]
      }
    }
    return this.styles[this.selectedStyle];
  }

  _updateLayer() {
    super._updateLayer();
    if (this._styleFunction) {
      this.restyle(this.style);
    }
  }
}

export class Layer extends BaseLayer {
  constructor({ type = "GeoTiff", ...kwargs }) {
    if (type == "GeoTiff") {
      return new GeoTiffLayer({ ...kwargs });
    } else if (type == "GeoJSON") {
      return new GeoJSONLayer({ ...kwargs });
    } else {
      console.error("Invalid layer type");
    }
  }
}