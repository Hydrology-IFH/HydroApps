import { GeoTIFF } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';
import { getColorscaleTileLayerStyle } from "~/common/utils/mapLayerStyles.mjs";

export class Layer {
  constructor(name, {file, style}) {
    this.name = name;
    this.file = file;
    this._style = style;
  }

  get url() {
    return `/static/sfi_mockup/Bonndorf/2015_06_14/${this.file}`
  }

  get style() {
    if (this._style.hasOwnProperty("collorscale")) {
      let opts = this._style.collorscale;
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
      return this._olLayer;
    } else {
      return this._olLayer;
    }
  }
}