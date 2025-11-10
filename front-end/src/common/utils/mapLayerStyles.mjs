import colormap from 'colormap';
import colorscales from 'colormap/colorScale.js';

const MIN_STEPS = 9;
const MAX_STEPS = 40;

// helper functions for colorbars
const getLengthFactStep = function ({min, max, colorbar}) {
  let length = max - min + 1;
  let step = 1;
  let fact = 1;
  let minSteps = colorbar? colorscales[colorbar.toLowerCase()].length: MIN_STEPS;
  if (length > MAX_STEPS){
    length = MAX_STEPS;
    step = (max - min) / (length - 1);
    console.log('adjusting colormap length to', length, fact, step, length / MAX_STEPS);
  } else if (length < minSteps) {
    // duplicate as some colormaps need at least 9 nshades
    fact = (length-1) / (minSteps-1);
    length = minSteps;
  }
  return {length, fact, step};
}

const getValueColors = function ({ min, max, colorbar, reverse = false, exponentialBase }) {
  var values;
  if (exponentialBase) {
    let minExp = Math.log(min)/Math.log(exponentialBase);
    let maxExp = Math.log(max)/Math.log(exponentialBase);
    var { length, fact, step } = getLengthFactStep({ min: minExp, max: maxExp, colorbar });
    values = Array.from({ length: length }, (value, index) => Math.pow(exponentialBase, minExp + (index * step * fact)));
  } else {
    var { length, fact, step } = getLengthFactStep({ min, max, colorbar });
    values = Array.from({ length: length }, (value, index) => min + (index * step * fact));
  }

  let colors = colormap({
    colormap: colorbar,
    nshades: length,
    format: 'rba',
    alpha: 1
  });
  if (reverse) {
    colors = colors.reverse();
  }
  return { values, colors };
}

const getColorscaleTicks = function ({min, max, colorbar, continuous=true, reverse=false, band=1, exponentialBase}) {
  let { values, colors } = getValueColors({ min, max, colorbar, reverse, exponentialBase });
  if (continuous) {
    return values.map((value, index) => [value, colors[index]]).flat();
  } else {
    return values.map((value, index) => [["==", ["band", band], value], colors[Math.round(index)]]).flat();
  }
}

// get a style object for a tile layer
export function getColorscaleTileLayerStyle({ min, max, colorbar, continuous = true, reverse = false, band = 1, nodataBand = 2, exponentialBase, continous }) {
  if (continous !== undefined) {
    console.warn("getColorscaleTileLayerStyle: 'continous' parameter is deprecated, use 'continuous' instead.");
    continuous = continous;
  }
  if (continuous) {
    return {
      color: [
        "case",
        ["!=", ["band", nodataBand], 0],
        [ 'interpolate',
          exponentialBase? ['exponential', exponentialBase]:['linear'],
          ["band", band],
          ...getColorscaleTicks({min, max, colorbar, continuous, reverse, band, exponentialBase}),
        ],
        ["color", 0,0,0,0]
      ]
    }
  } else {
    return {
      color: [
        "case",
        ["!=", ['band', nodataBand], 0],
        ['case',
          ...getColorscaleTicks({min, max, colorbar, continuous, reverse, band, exponentialBase}),
          ["color", 0, 0, 0, 0]
        ],
        ["color", 0, 0, 0, 0]
      ]
    }
  }
}

// get a function that returns a color for a specific value
export const getColormap = function ({ min, max, colorbar, continuous = true, reverse = false, exponentialBase, continous }) {
  if (continuous !== undefined) {
    console.warn("getColormap: 'continous' parameter is deprecated, use 'continuous' instead.");
    continuous = continous;
  }
  let { values, colors } = getValueColors({ min, max, colorbar, length, reverse, exponentialBase });
  if (continuous) {
    var cmap = (val) => {
      if (val > max || val < min) {
        console.error('value out of colormap range', val, min, max);
        return none;
      }
      let i1 = values.findIndex((v, i) => v <= val && values[i + 1] > val);
      let i2 = i1 + 1;

      return colors[i1].map((c, i) => c + (colors[i2][i] - c) * (val - values[i1]) / (values[i2] - values[i1]));
    }
  } else {
    var cmap = (val) => {
      let i = values.findIndex((v, i) => v == val);
      if (i == -1) {
        console.error('value not found in colormap');
        return none;
      }
      return colors[index];
    }
  }

  return cmap;
}
