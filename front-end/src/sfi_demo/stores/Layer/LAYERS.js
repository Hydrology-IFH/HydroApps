import i18n from 'i18next';

const sfiCats = [
  { sfi: 0, range: [0, 0.5] },
  { sfi: 1, range: [0.5, 2] },
  { sfi: 2, range: [2, 5] },
  { sfi: 3, range: [5, 100] }
]
const sfiLegendLabels = {
  "< 0.5": "0",
  "< 2": "1",
  "< 5": "2",
  ">= 5": "3"
}

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

const sfgfLegendLabels = {
  1: i18n.t("label_sfgf_1")
}

export const LAYERS = [
  {
    id: "precipitation",
    file: "N.tif",
    name: i18n.t("label_layer_precipitation"),
    unit: "mm",
    decimals: 0,
    url: ({ region, kind, sri, duration, date }) => {
      let base_url = `/static/sfi_demo/${region}/${kind}`
      if (kind == "matrix") {
        return `${base_url}/${sri}/${duration}/N.tif`
      } else if (kind == "event") {
        return `${base_url}/${date}/N.tif`
      } else {
        console.error("Invalid kind for precipitation layer")
        return ""
      }
    },
    style: {
      colorscale: {
        min: 0,
        max: 120,
        colorbar: "cmocean:rain",
        continous: true,
        reverse: false,
      },
    },
  },
  {
    id: "SRI",
    url: ({ region, kind, sri, duration, date }) => {
      let base_url = `/static/sfi_demo/${region}/${kind}`
      if (kind == "matrix") {
        return `${base_url}/${sri}/${duration}/SRI.tif`
      } else if (kind == "event") {
        return `${base_url}/${date}/SRI.tif`
      } else {
        console.error("Invalid kind for SRI layer")
        return ""
      }
    },
    name: i18n.t("label_layer_sri"),
    unit: "",
    decimals: 1,
    legend: {
      tooltips: Object.entries(sriCats).map((el) => {
        let i18n_opts = {
          T: `<b>${el[1].T}</b>`,
          F: `<b>${el[1].F}</b>`,
          'interpolation': { 'escapeValue': false }
        }
        let msg = i18n.t('tooltip_sri_return_period', i18n_opts);
        if ("F" in el[1]) { msg += "<br>" + i18n.t('tooltip_sri_factor', i18n_opts) }
        return { label: el[0], message: msg }
      })
    },
    style: {
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
          ["color", 0,0,0,0]
        ],
        ["color", 0, 0, 0, 0]
      ]
    }
  },
  {
    id: "soil_moisture",
    url: ({ region, kind, soilMoisture, date }) => {
      let base_url = `/static/sfi_demo/${region}/${kind}`
      if (kind == "matrix") {
        return `${base_url}/theta/${soilMoisture}/theta_wrzl.tif`
      } else if (kind == "event") {
        return `${base_url}/${date}/theta_wrzl.tif`
      } else {
        console.error("Invalid kind for soil moisture layer")
        return ""
      }
    },
    name: i18n.t("label_layer_soil_moisture"),
    unit: "% vol",
    decimals: 1,
    style: {
      colorscale: {
        min: 0,
        max: 60,
        colorbar: "bathymetry",
        continous: true,
        reverse: true
      },
    },
  },
  {
    id: "OA",
    file: "OA_Sum.tif",
    name: i18n.t("label_layer_oa"),
    unit: "mm",
    decimals: 1,
    style: {
      colorscale: {
        min: 0,
        max: 90,
        colorbar: "density",
        continous: true,
        reverse: true,
      },
    },
  },
  {
    id: "SFI",
    file: "SFI_circ_A2.tif",
    name: i18n.t("label_layer_sfi"),
    unit: "",
    decimals: 1,
    valueConverter: (val) => {
      return sfiCats.filter((cat) => cat.range[0] <= val && val < cat.range[1])[0].sfi;
    },
    legend: {
      tooltips: [
        { label: "0", message: i18n.t("tooltip_sfi_0") },
        { label: "1", message: i18n.t("tooltip_sfi_1") },
        { label: "2", message: i18n.t("tooltip_sfi_2") },
        { label: "3", message: i18n.t("tooltip_sfi_3") }],
        valueConverter: (val) => sfiLegendLabels[val]
    },
    style: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [
          "case",
          ["<", ["band", 1], 0.5], [84, 194, 31, 1],
          ["<", ["band", 1], 2], [255, 236, 1, 1],
          ["<", ["band", 1], 5], [226, 35, 35, 1],
          [">=", ["band", 1], 5], [147, 68, 144, 1],
          ["color", 147, 68, 144, 1],
        ],
        // this is just a workaround as openlayers case has a problem to check for alpha band
        ["color", 84, 194, 31, 1]
      ]
    },
    child_layer: {
      id: "SFGF",
      file: "SFGF.tif",
      name: i18n.t("label_layer_sfgf"),
      unit: "",
      decimals: 0,
      legend: {
        tooltips: [
          { label: "1", message: i18n.t("tooltip_sfgf_1") }
        ],
        valueConverter: (val) => sfgfLegendLabels[val]
      },
      style: {
        color: [
          "case",
          ["!=", ["band", 2], 0],
          [
            "case",
            ["==", ["band", 1], 1], [95, 95, 95, 0.8],
            ["color", 0, 0, 0, 0],
          ],
          // this is just a workaround as openlayers case has a problem to check for alpha band
          ["color", 0, 0, 0, 0]
        ]
      },
      condition: (config) => config.show_sfgf,
      openlayer_options: {
        maxZoom: 16,
      }
    }
  }
];