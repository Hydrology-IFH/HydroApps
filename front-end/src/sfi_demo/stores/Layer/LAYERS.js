import { bathymetry } from 'colormap/colorScale';
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

const aiDepthLegendLabels = {
  "< 10": "5-10",
  "< 50": "10-50",
  "< 100": "50-100",
  ">= 100": "≥100",
  "-9": i18n.t("legend_ai_sim_area"),
}

const aiSpeedLegendLabels = {
  "< 0.5": "0.2-0.5",
  "< 1": "0.5-1",
  "< 2": "1-2",
  ">= 2": "≥2",
  "-9": i18n.t("legend_ai_sim_area"),
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
      options: {
        defaultKey: "cmocean:rain",
        defaultColorscaleOpts: {
          min: 0,
          max: 120,
          continous: true
        },
        colorscales: {
          "cmocean:rain": {
            colorbar: "cmocean:rain",
            reverse: false,
          },
          density: {
            colorbar: "density",
            reverse: true,
          },
          "NEO_trmm_rainfall": {
            colorbar: "NEO_trmm_rainfall",
            reverse: true,
          },
          "NEO_soil_moisture": {
            colorbar: "NEO_soil_moisture",
            reverse: true,
          },
          "Yellow-Green-Blue": {
            colorbar: "YiGnBu",
            reverse: true,
          },
          "EO_aura_omi_formal": {
            colorbar: "EO_aura_omi_formal",
            reverse: true,
          },
          "Blue-Purple": {
            colorbar: "BluPu",
            reverse: false,
          },
          "salinity": {
            colorbar: "salinity",
            reverse: true,
          },
          "viridis": {
            colorbar: "viridis",
            reverse: true,
          }
        }
      }
    }
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
      options: {
        defaultKey: "bathymetry",
        defaultColorscaleOpts: {
          min: 0,
          max: 60,
          continous: true,
        },
        colorscales: {
          bathymetry: {
            colorbar: "bathymetry",
            reverse: true,
          },
          salinity : {
            colorbar: "salinity",
            reverse: true,
          },
          NEO_soil_moisture : {
            colorbar: "NEO_soil_moisture",
            reverse: true,
          },
          "Yellow-Green-Blue": {
            colorbar: "YiGnBu",
            reverse: true,
          },
          viridis : {
            colorbar: "viridis",
            reverse: true,
          },
          velocityGreen : {
            colorbar: "velocity-green",
            reverse: true,
          },
          "Orange-Blue": {
            colorbar: "OrBu",
            reverse: false
          },
          temperature : {
            colorbar: "temperature",
            reverse: true,
          },
          EO_soil_moist_div : {
            colorbar: "EO_soil_moist_div",
            reverse: true,
          },
          SVS_soil_moisture : {
            colorbar: "SVS_soil_moisture",
            reverse: true,
          },
          "Plasma reversed" : {
            colorbar: "plasma",
            reverse: true,
          },
          "Plasma" : {
            colorbar: "plasma",
            reverse: false,
          },
          "Red-Blue" : {
            colorbar: "RdBu",
            reverse: true,
          },
          NEO_trmm_rainfall : {
            colorbar: "NEO_trmm_rainfall",
            reverse: true,
          }
        }
      }
    }
  },
  {
    id: "OA",
    file: "OA_Sum.tif",
    name: i18n.t("label_layer_oa"),
    unit: "mm",
    decimals: 1,
    style: {
      options: {
        defaultKey: "density",
        defaultColorscaleOpts: {
          min: 0,
          max: 90,
          continous: true,
        },
        colorscales: {
          density: {
            colorbar: "density",
            reverse: true,
          },
          bathymetry: {
            colorbar: "bathymetry",
            reverse: true,
          },
          salinity: {
            colorbar: "salinity",
            reverse: true,
          },
          viridis: {
            colorbar: "viridis",
            reverse: true,
          },
          "Yellow-Green-Blue": {
            colorbar: "YiGnBu",
            reverse: true,
          },
          "Plasma": {
            colorbar: "plasma",
            reverse: false,
          },
          "Plasma reversed": {
            colorbar: "plasma",
            reverse: true,
          },
          freesurfaceBlue: {
            colorbar: "freesurface-blue",
            reverse: true,
          },
          "cmocean:rain": {
            colorbar: "cmocean:rain",
            reverse: false,
          },
          "NEO_soil_moisture": {
            colorbar: "NEO_soil_moisture",
            reverse: true,
          },
          "NEO_trmm_rainfall": {
            colorbar: "NEO_trmm_rainfall",
            reverse: true,
          }
        }
      }
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
  },
  {
    id: "ai_depth",
    file: "ai_depth.tif",
    name: i18n.t("label_layer_ai_depth"),
    unit: "cm",
    decimals: 0,
    condition: (config) => config.region == "Emmendingen",
    backupLayer: "OA",
    style: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [
          "case",
          // colors from https://sgx.geodatenzentrum.de/wms_starkregen
          ["<", ["band", 1], 5], [160, 160, 160, 0.3],
          ["<", ["band", 1], 10], [204, 236, 255],
          ["<", ["band", 1], 50], [153, 204, 255],
          ["<", ["band", 1], 100], [110, 153, 255],
          [">=", ["band", 1], 100], [61, 102, 255],
          ["==", ["band", 1], -9], [160, 160, 160, .7], // for legend
          ["color", 255, 255, 255, 0]
        ],
        ["color", 255, 255, 255, 0]
      ]
    },
    legend: {
      valueConverter: (val) => aiDepthLegendLabels[val]||val,
      ignoreLabels: ["< 5"]
    },
    valueConverter: (val) => (val == -1) ? undefined:val
  },
  {
    id: "ai_speed",
    file: "ai_speed.tif",
    name: i18n.t("label_layer_ai_speed"),
    unit: "m/s",
    decimals: 1,
    condition: (config) => config.region == "Emmendingen",
    backupLayer: "OA",
    style: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [
          "case",
          ["<", ["band", 1], 0.2], [160, 160, 160, 0.3],
          ["<", ["band", 1], 0.5], [255, 255, 178],
          ["<", ["band", 1], 1], [254, 204, 92],
          ["<", ["band", 1], 2], [253, 141, 60],
          [">=", ["band", 1], 2], [227, 26, 28],
          ["==", ["band", 1], -9], [160, 160, 160, .7], // for legend
          ["color", 255, 255, 255, 0]
        ],
        // this is just a workaround as openlayers case has a problem to check for alpha band
        ["color", 255, 255, 255, 0]
      ]
    },
    legend: {
      valueConverter: (val) => aiSpeedLegendLabels[val] || val,
      ignoreLabels: ["< 0.2"]
    },
    valueConverter: (val) => (val == -1)? undefined:val
  }
];