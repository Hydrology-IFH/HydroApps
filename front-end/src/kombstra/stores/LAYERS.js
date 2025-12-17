import i18n from 'i18next';

import '~/utils/extraColormaps.js';

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

const getSRIStyle = (band, numBands=1) => ({
  color: [
    "case",
    ["!=", ["band", numBands+1], 0],
    [ 'case',
      ["==", ["band", band], 1], [161, 194, 31],
      ["==", ["band", band], 2], [178, 207, 129],
      ["==", ["band", band], 3], [222, 225, 14],
      ["==", ["band", band], 4], [255, 236, 1],
      ["==", ["band", band], 5], [241, 144, 6],
      ["==", ["band", band], 6], [233, 98, 25],
      ["==", ["band", band], 7], [229, 81, 26],
      ["==", ["band", band], 8], [226, 35, 35],
      ["==", ["band", band], 9], [227, 41, 64],
      ["==", ["band", band], 10], [228, 35, 95],
      ["==", ["band", band], 11], [224, 64, 141],
      ["==", ["band", band], 12], [160, 69, 144],
      ["==", ["band", band], 98], [200, 200, 200],
      ["color", 0,0,0,0]
    ],
    ["color", 0,0,0,0]
  ]
});

// Layer definitions
export const LAYERS = [
  {
    id: "Top_SRI_year",
    name: (year) => i18n.t('legend_label_top_sri', { year: year.value }),
    unit: "",
    decimals: 0,
    relevantConfigs: ["year"],
    url: ({ year }) => `/static/kombstra/kombstra_views/Top_SRI_year_${year}.tif`,
    style: getSRIStyle(1, 1),
    valueConverter: (val) => val === "98" ? i18n.t('nodata_98') : val,
  },
  {
    id: "year",
    name: i18n.t('legend_label_year'),
    unit: "",
    decimals: 0,
    relevantConfigs: ["event_rank",],
    valueConverter: (val) => `${val}`,
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
          ["==", ["band", 1], 5], [239, 248, 33, 1],
          ["==", ["band", 1], 6], [247, 147, 65, 1],
          ["==", ["band", 1], 7], [202, 70, 120, 1],
          ["==", ["band", 1], 8], [124, 2, 167, 1],
          ["==", ["band", 1], 9], [12, 7, 134, 1],
          ["color", 0,0,0,0]
        ],
        ["color", 0,0,0,0]
      ]
    },
    valueConverter: (val) => val == 9998 ? i18n.t('nodata_98') : val,
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
        continuous: false,
        reverse: false,
      }
    }),
  },
  {
    id: "duration",
    name: (event_rank) => i18n.t('legend_label_duration', { event_rank: event_rank.value }),
    unit: "min",
    decimals: 0,
    relevantConfigs: ["event_rank",],
    url: ({ event_rank }) => `/static/kombstra/kombstra_views/duration_${event_rank}.tif`,
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
    id: "event_sri",
    name: ({ event_rank }) => i18n.t('legend_label_event_sri', { event_rank }),
    unit: "",
    decimals: 0,
    relevantConfigs: ["event_rank"],
    url: ({ event_rank }) => `/static/kombstra/kombstra_views/sri_${event_rank}.tif`,
    style: getSRIStyle(1,1),
    valueConverter: (val) => val == 98 ? i18n.t('nodata_98') : val,
  },
  {
    id: "daily_sri",
    name: ({ daily_date, daily_duration }) => {
      let date = daily_date.toLocaleDateString(
          i18n.language,
        { year: 'numeric', month: 'long', day: 'numeric' })
      if (daily_duration === "short") {
        return i18n.t(
          'legend_label_daily_sri_short', { date });
      } else {
        return i18n.t(
          'legend_label_daily_sri_long', { date });
      }
    },
    unit: "",
    decimals: 0,
    relevantConfigs: ["daily_date", "daily_duration"],
    url: ({ daily_date }) => {
      let month = (daily_date.getMonth() + 1).toString().padStart(2,"0");
      let day = daily_date.getDate().toString().padStart(2,"0");
      return `/static/kombstra/daily_events/SRI_${daily_date.getFullYear()}${month}${day}.tif`;
    },
    style: ({ daily_duration }) => getSRIStyle(daily_duration === "short" ? 1 : 2, 2),
    valueConverter: (val) => val == 98 ? i18n.t('nodata_98') : val,
    // TODO: add legend tooltips
  },
  {
    id: "daily_pval",
    name: ({ daily_date, daily_duration }) => {
      let date = daily_date.toLocaleDateString(
        i18n.language,
        { year: 'numeric', month: 'long', day: 'numeric' });
      if (daily_duration === "short") {
        return i18n.t('legend_label_daily_pval_short', { date });
      } else {
        return i18n.t('legend_label_daily_pval_long', { date });
      }
    },
    unit: "mm",
    decimals: 0,
    relevantConfigs: ["daily_date", "daily_duration"],
    url: ({ daily_date }) => {
      let month = (daily_date.getMonth() + 1).toString().padStart(2,"0");
      let day = daily_date.getDate().toString().padStart(2,"0");
      return `/static/kombstra/daily_events/PVAL_${daily_date.getFullYear()}${month}${day}.tif`;
    },
    style: ({ daily_duration }) => ({
      colorscale: {
        colorbar: "cmocean:rain",
        min: 0,
        max: Math.ceil(spans.max_pval/10)*10,
        continuous: true,
        reverse: false,
        band: daily_duration === "short" ? 1 : 2,
      }
    }),
    valueConverter: (val) => val == 9998 ? i18n.t('nodata_98') : val,
  },
];