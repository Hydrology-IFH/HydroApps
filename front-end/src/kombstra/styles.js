import {formPara} from './form.js';

// styles
let styles = {
    duration: {
      color: [
        "case",
        [">", ["band", 2], 0],
        [
          'interpolate',
          ['linear'],
          ["band", 1],
          10, [0, 0, 0],
          360, [255, 255, 255],
        ],
        ["color", 0,0,0,0]
      ]
    },
    pval: {
      color: [
        "case",
        [">", ["band", 2], 0],
        [
          'interpolate',
          ['linear'],
          ["band", 1],
          0, [0, 0, 0],
          200, [255, 5, 5],
        ],
        ["color", 0,0,0,0]
      ]
    },
    sri: {
      color: [
        "case",
        [">", ["band", 2], 0],
        [ 'interpolate',
          ['linear'],
          ["band", 1],
          1, [161, 194, 31],
          2, [178, 207, 129],
          3, [222, 225, 14],
          4, [255, 236, 1],
          5, [241, 144, 6],
          6, [233, 98, 25],
          7, [229, 81, 26],
          8, [226, 35, 35],
          9, [227, 41, 64],
          10, [228, 35, 95],
          11, [224, 64, 141],
          12, [160, 69, 144],
        ],
        ["color", 0,0,0,0]
      ]
    },
    month: {
      color: [
        "case",
        [">", ["band", 2], 0],
        [ 'interpolate',
          ['linear'],
          ["band", 1],
          // colorpalette from matplotlib "twilight_reversed -> cyclic"
          0, [48, 20, 55],
          1, [78, 24, 111],
          2, [94, 69, 166],
          3, [98, 118, 186],
          4, [124, 162, 194],
          5, [179, 198, 206],
          6, [226, 217, 226],
          7, [212, 188, 172],
          8, [198, 137, 108],
          9, [178, 86, 82],
          10, [141, 43, 80],
          11, [88, 22, 71],
          12, [47, 20, 54],
        ],
        ["color", 0,0,0,0]
      ]
    },
    year: {
      color: [
        "case",
        [">", ["band", 2], 0],
        [ 'interpolate',
          ['linear'],
          ["band", 1],
          2001, [249, 253, 204],
          2002, [244, 251, 192],
          2003, [238, 248, 179],
          2004, [227, 244, 178],
          2005, [214, 239, 179],
          2006, [202, 234, 180],
          2007, [183, 227, 182],
          2008, [160, 218, 184],
          2009, [135, 208, 186],
          2010, [115, 200, 189],
          2011, [95, 193, 192],
          2012, [76, 186, 194],
          2013, [59, 176, 195],
          2014, [47, 164, 194],
          2015, [36, 152, 193],
          2016, [30, 139, 189],
          2017, [31, 122, 181],
          2018, [33, 106, 173],
          2019, [34, 90, 166],
          2020, [35, 77, 160],
          2021, [36, 63, 153],
          2022, [35, 51, 144],
          2023, [26, 43, 126],
          2024, [17, 36, 107],
          2025, [8, 29, 88],
        ],
        ["color", 0,0,0,0]
      ]
    },
}

const get_style = function () {
    return styles[formPara.value];
}

export default get_style;