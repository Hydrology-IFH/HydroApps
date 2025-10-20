import i18n from 'i18next';
const spans = JSON.parse(document.getElementById('spans').textContent);

// condition functions
const sriCats = {
  1: { T: "2" },
  2: { T: "5" },
  3: { T: "10" },
  4: { T: "25" },
  5: { T: "30" },
  6: { T: "50" },
  7: { T: "100" },
  8: { T: ">100", F: "1,20" },
  9: { T: ">100", F: "1,40" },
  10: { T: ">100", F: "1,60" },
  11: { T: ">100", F: "2,20" },
  12: { T: ">100", F: "2,80" }
}

const sriStyle = {
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
}

// Layer definitions
export const LAYERS = [
  {
    id: "Top_SRI_year",
    name: (year) => i18n.t('legend_label_top_sri', { year: year.value }),
    unit: "",
    decimals: 0,
    relevantConfigs: ["year"],
    url: ({ year }) => `/static/kombstra/kombstra_views/Top_SRI_year_${year}.tif`,
    style: sriStyle,
  },
  {
    id: "year",
    name: i18n.t('legend_label_year'),
    unit: "",
    decimals: 0,
    relevantConfigs: ["event_rank",],
    url: ({ event_rank }) => `/static/kombstra/kombstra_views/year_${event_rank}.tif`,
    style: {
      colorscale: {
        min: spans.min_year,
        max: spans.max_year,
        colorbar: "portland",
        continuous: true,
        invert: false,
      }
    },
  },
  {
    id: "month",
    name: i18n.t('legend_label_month'),
    unit: "",
    decimals: 0,
    relevantConfigs: ["event_rank",],
    url: ({ event_rank }) => `/static/kombstra/kombstra_views/month_${event_rank}.tif`,
    style: {
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
  },
  {
    id: "NEvents_above_SRI",
    name: ({ sri }) =>  `${i18n.t('legend_label_NEvents_above')} SRI ≥ ${ sri }`,
    unit: "",
    decimals: 0,
    relevantConfigs: ["sri",],
    url: ({ sri }) => `/static/kombstra/kombstra_views/NEvents_above_SRI_${sri}.tif`,
    style: ({ sri }) => ({
      colorscale: {
        min: 0,
        max: Math.max(3, spans.max_nevents[sri]),
        step: 1,
        colorbar: "plasma",
        continous: false,
        reverse: false,
      }
    }),
  },
  {
    id: "duration",
    file: "duration.tif",
    name: (sri) => i18n.t('legend_label_duration', { sri: sri.value }),
    unit: "min",
    decimals: 0,
    relevantConfigs: ["sri",],
    url: ({ sri }) => `/static/kombstra/kombstra_views/duration_${sri}.tif`,
    style: {
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
  },
  {
    id: "sri",
    file: "SRI.tif",
    name: (event_rank) => i18n.t('legend_label_sri', { event_rank: event_rank.value }),
    unit: "",
    decimals: 0,
    relevantConfigs: ["event_rank",],
    url: ({ event_rank }) => `/static/kombstra/kombstra_views/SRI_${event_rank}.tif`,
    style: sriStyle,
  },
];