// import { gridFormPara } from './forms.js';
import { parameter } from './Form.vue';

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
            2001, [13, 8, 135],
            2002, [42, 5, 147],
            2003, [65, 4, 157],
            2004, [86, 1, 164],
            2005, [106, 0, 168],
            2006, [126, 3, 168],
            2007, [143, 13, 164],
            2008, [161, 27, 155],
            2009, [177, 42, 144],
            2010, [191, 57, 132],
            2011, [204, 71, 120],
            2012, [214, 85, 109],
            2013, [225, 100, 98],
            2014, [234, 116, 87],
            2015, [242, 132, 75],
            2016, [248, 149, 64],
            2017, [252, 166, 54],
            2018, [254, 186, 44],
            2019, [252, 206, 37],
            2020, [247, 228, 37],
            2021, [240, 249, 33],
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
        // colorpalette from matplotlib "plasma"
        ["==", ["band", 1], 0], [0, 0, 0],
        ["==", ["band", 1], 1], [13, 8, 135],
        ["==", ["band", 1], 2], [51, 5, 151],
        ["==", ["band", 1], 3], [80, 2, 162],
        ["==", ["band", 1], 4], [106, 0, 168],
        ["==", ["band", 1], 5], [132, 5, 167],
        ["==", ["band", 1], 6], [156, 23, 158],
        ["==", ["band", 1], 7], [177, 42, 144],
        ["==", ["band", 1], 8], [195, 61, 128],
        ["==", ["band", 1], 9], [211, 81, 113],
        ["==", ["band", 1], 10], [225, 100, 98],
        ["==", ["band", 1], 11], [237, 121, 83],
        ["==", ["band", 1], 12], [246, 143, 68],
        ["==", ["band", 1], 13], [252, 166, 54],
        ["==", ["band", 1], 14], [254, 192, 41],
        ["==", ["band", 1], 15], [249, 220, 36],
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