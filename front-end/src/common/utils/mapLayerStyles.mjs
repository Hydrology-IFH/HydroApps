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
    step = length / MAX_STEPS;
    length = Math.ceil(length / step);
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

const getColorscaleTicks = function ({min, max, colorbar, continous=true, reverse=false, exponentialBase}) {
  let { values, colors } = getValueColors({ min, max, colorbar, reverse, exponentialBase });
  if (continous) {
    return values.map((value, index) => [value, colors[index]]).flat();
  } else {
    return values.map((value, index) => [["==", ["band", 1], value], colors[Math.round(index)]]).flat();
  }
}

// get a style object for a tile layer
export function getColorscaleTileLayerStyle({ min, max, colorbar, continous = true, reverse = false, exponentialBase }) {
  if (continous) {
    return {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [ 'interpolate',
          exponentialBase? ['exponential', exponentialBase]:['linear'],
          ["band", 1],
          ...getColorscaleTicks({min, max, colorbar, continous, reverse, exponentialBase}),
        ],
        ["color", 0,0,0,0]
      ]
    }
  } else {
    return {
      color: [
        "case",
        ["!=", ['band', 2], 0],
        ['case',
          ...getColorscaleTicks({min, max, colorbar, continous, reverse, exponentialBase}),
          ["color", 0, 0, 0, 0]
        ],
        ["color", 0, 0, 0, 0]
      ]
    }
  }
}

// get a function that returns a color for a specific value
export const getColormap = function ({ min, max, colorbar, continous = true, reverse = false, exponentialBase}) {
  let { values, colors } = getValueColors({ min, max, colorbar, length, reverse, exponentialBase });
  if (continous) {
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
