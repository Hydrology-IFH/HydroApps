// import { gridFormPara } from './forms.js';
import { parameter } from './Form.vue';
import colormap from 'colormap';

// helper functions for colorbars
let get_colorscale = function (min, max, colorbar, continous=true, reverse=false) {
  let values = Array.from({ length: max - min + 1 }, (value, index) => min + index);
  window.values = values;
  let fact = values.length > 9 ? 1 : 9 / values.length;
  let colors = colormap({
    colormap: colorbar,
    nshades: fact == 1? values.length:9, // duplicat as some colormaps need at least 9 nshades
    format: 'rba',
    alpha: 1
  });
  if (reverse) {
    colors = colors.reverse();
  }
  if (continous) {
    return values.map((value, index) => [value, colors[Math.round(index*fact)]]).flat();
  } else {
    return values.map((value, index) => [["==", ["band", 1], value], colors[Math.round(index*fact)]]).flat();
  }
}

// styles
let styles = {
    duration: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        ['case',
          ["==", ["band", 1], 9998], [200, 200, 200],
          [
            'interpolate',
            ['linear'],
            ["band", 1],
            0, [253, 231, 37],
            30, [200, 224, 32],
            60, [144, 215, 67],
            90, [92, 200, 99],
            120, [53, 183, 121],
            180, [33, 144, 141],
            240, [49, 104, 142],
            300, [68, 57, 131],
            360, [68, 1, 84],
          ],
        ],
        ["color", 0,0,0,0]
      ]
    },
    sri: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [ 'case',
          ["==", ["band", 1], 1], [161, 194, 31],
          ["==", ["band", 1], 2], [178, 207, 129],
          ["==", ["band", 1], 3], [222, 225, 14],
          ["==", ["band", 1], 4], [255, 236, 1],
          ["==", ["band", 1], 5], [241, 144, 6],
          ["==", ["band", 1], 6], [233, 98, 25],
          ["==", ["band", 1], 7], [229, 81, 26],
          ["==", ["band", 1], 8], [226, 35, 35],
          ["==", ["band", 1], 9], [227, 41, 64],
          ["==", ["band", 1], 10], [228, 35, 95],
          ["==", ["band", 1], 11], [224, 64, 141],
          ["==", ["band", 1], 12], [160, 69, 144],
          ["==", ["band", 1], 9998], [200, 200, 200],
          ["color", 0,0,0,0]
        ],
        ["color", 0,0,0,0]
      ]
    },
    month: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [ 'case',
          // colorpalette from cmcrameri "romaO" -> cyclic
          ["==", ["band", 1], 1], [81, 107, 164],
          ["==", ["band", 1], 2], [98, 73, 125],
          ["==", ["band", 1], 3], [114, 57, 89],
          ["==", ["band", 1], 4], [130, 60, 61],
          ["==", ["band", 1], 5], [148, 80, 46],
          ["==", ["band", 1], 6], [170, 117, 47],
          ["==", ["band", 1], 7], [195, 163, 75],
          ["==", ["band", 1], 8], [213, 206, 129],
          ["==", ["band", 1], 9], [203, 225, 179],
          ["==", ["band", 1], 10], [164, 216, 203],
          ["==", ["band", 1], 11], [116, 187, 205],
          ["==", ["band", 1], 12], [83, 147, 191],
          ["==", ["band", 1], 9998], [200, 200, 200],
          ["color", 0,0,0,0]
        ],
        ["color", 0,0,0,0]
      ]
    },
    year: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        ['case',
          ["==", ["band", 1], 9998], [200, 200, 200],
          [ 'interpolate',
            ['linear'],
            ["band", 1],
            ...get_colorscale(spans.min_year, spans.max_year, "portland", true, false),
          ],
        ],
        ["color", 0,0,0,0]
      ]
  },
  NEvents_above_SRI: {
    color: [
      "case",
      ["!=", ['band', 2], 0],
      ['case',
        ...get_colorscale(0, spans.max_nevents, "inferno", false, false),
        ["color", 0,0,0,0]
      ],
      ["color", 0,0,0,0]
    ]
  }
}
styles.Top_SRI_year = styles.sri;

export function get_style() {
  return styles[parameter.value];
}