import colorScale from 'colormap/colorScale.js';

function registerColormap(key, colormap) {
  if (colormap.every(c => c.index !== undefined && c.rgb?.length == 3)) {
    colorScale[key.toLowerCase()] = colormap;
  } else {
      throw new Error('Invalid colormap');
  }
}

// colormap created online with http://colormaker.org/
// ----------------------------------------------------
registerColormap("cmocean:rain", [
  {"index": 0.0, "rgb": [218, 201, 184]},
  {"index": 0.05, "rgb": [209, 190, 160]},
  {"index": 0.09, "rgb": [192, 182, 143]},
  {"index": 0.14, "rgb": [173, 176, 135]},
  {"index": 0.18, "rgb": [152, 169, 128]},
  {"index": 0.23, "rgb": [131, 163, 121]},
  {"index": 0.27, "rgb": [111, 156, 116]},
  {"index": 0.32, "rgb": [87, 149, 111]},
  {"index": 0.36, "rgb": [61, 142, 110]},
  {"index": 0.41, "rgb": [36, 134, 110]},
  {"index": 0.45, "rgb": [15, 124, 110]},
  {"index": 0.5, "rgb": [5, 115, 110]},
  {"index": 0.55, "rgb": [5, 104, 108]},
  {"index": 0.59, "rgb": [15, 93, 105]},
  {"index": 0.64, "rgb": [25, 82, 100]},
  {"index": 0.68, "rgb": [33, 71, 92]},
  {"index": 0.73, "rgb": [36, 59, 82]},
  {"index": 0.77, "rgb": [37, 49, 73]},
  {"index": 0.82, "rgb": [36, 38, 64]},
  {"index": 0.86, "rgb": [34, 27, 56]},
  {"index": 0.91, "rgb": [34, 27, 56]},
  {"index": 0.95, "rgb": [34, 27, 56]},
  {"index": 1.0, "rgb": [34, 27, 56]},
])
