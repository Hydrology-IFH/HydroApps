// import { gridFormPara } from './forms.mjs';
import colormap from 'colormap';

const MIN_STEPS = 9;
const MAX_STEPS = 40;

// helper functions for colorbars
const getColorscale = function (min, max, colorbar, continous=true, reverse=false) {
  let length = max - min + 1;
  let step = 1;
  let fact = 1;
  if (length > MAX_STEPS){
    step = Math.floor(length / MAX_STEPS);
    length = Math.ceil(length / step);
  } else if (length < MIN_STEPS) {
    fact = (length-1) / (MIN_STEPS-1);
    length = MIN_STEPS;
  }
  let values = Array.from({ length:length }, (value, index) => min + (index * step * fact));
  let colors = colormap({
    colormap: colorbar,
    nshades: length, // duplicat as some colormaps need at least 9 nshades
    format: 'rba',
    alpha: 1
  });
  if (reverse) {
    colors = colors.reverse();
  }
  if (continous) {
    return values.map((value, index) => [value, colors[index]]).flat();
  } else {
    return values.map((value, index) => [["==", ["band", 1], value], colors[Math.round(index)]]).flat();
  }
}

export function getColorscaleTileLayerStyle(min, max, colorbar, continous = true, reverse = false) {
  if (continous) {
    return {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [ 'interpolate',
          ['linear'],
          ["band", 1],
          ...getColorscale(min, max, colorbar, true, reverse),
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
          ...getColorscale(min, max, colorbar, false, reverse),
          ["color", 0, 0, 0, 0]
        ],
        ["color", 0, 0, 0, 0]
      ]
    }
  }
}
