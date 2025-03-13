import i18n from 'i18next';
import { Fill, Stroke, Style } from 'ol/style';


// condition functions
export const conditionAI = ({ config }) => {
  return config.kind == "matrix" &&
    (config.region == "Emmendingen" || config.region == "Karlsbad");
}

export const conditionDamage = ({ config }) => {
  return config.kind == "matrix" &&
    (config.region == "Emmendingen" || config.region == "Herrstein" || config.region == "Wieslauf");
}

// revlevant constants
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

const relevantConfigsDefaults = ["region", "kind", "date", "region_selection_active"]

// Layer definitions
export const LAYERS = [
  {
    id: "precipitation",
    file: "N.tif",
    name: i18n.t("label_layer_precipitation"),
    unit: "mm",
    decimals: 0,
    relevantConfigs: [...relevantConfigsDefaults, "sri", "duration",],
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
    relevantConfigs: [...relevantConfigsDefaults, "sri", "duration",],
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
      options: {
        defaultKey: "SRI",
        styles: {
          "SRI": {
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
          },
          "Viridis": {
            color: [
              "case",
              ["!=", ["band", 2], 0],
              ['case',
                ["==", ["band", 1], 1], [253, 231, 36, 1],
                ["==", ["band", 1], 2], [194, 223, 34, 1],
                ["==", ["band", 1], 3], [134, 212, 73, 1],
                ["==", ["band", 1], 4], [81, 196, 104, 1],
                ["==", ["band", 1], 5], [42, 176, 126, 1],
                ["==", ["band", 1], 6], [30, 154, 137, 1],
                ["==", ["band", 1], 7], [36, 133, 141, 1],
                ["==", ["band", 1], 8], [45, 111, 142, 1],
                ["==", ["band", 1], 9], [56, 87, 140, 1],
                ["==", ["band", 1], 10], [66, 61, 132, 1],
                ["==", ["band", 1], 11], [72, 33, 114, 1],
                ["==", ["band", 1], 12], [68, 1, 84, 1],
                ["color", 0, 0, 0, 0]
              ],
              ["color", 0, 0, 0, 0]
            ]
          },
          "Cividis": {
            color: [
              "case",
              ["!=", ["band", 2], 0],
              ['case',
                ["==", ["band", 1], 1], [253, 231, 55, 1],
                ["==", ["band", 1], 2], [230, 208, 79, 1],
                ["==", ["band", 1], 3], [205, 188, 98, 1],
                ["==", ["band", 1], 4], [181, 168, 110, 1],
                ["==", ["band", 1], 5], [157, 149, 117, 1],
                ["==", ["band", 1], 6], [134, 131, 120, 1],
                ["==", ["band", 1], 7], [114, 115, 116, 1],
                ["==", ["band", 1], 8], [94, 98, 110, 1],
                ["==", ["band", 1], 9], [72, 81, 107, 1],
                ["==", ["band", 1], 10], [47, 66, 108, 1],
                ["==", ["band", 1], 11], [0, 49, 112, 1],
                ["==", ["band", 1], 12], [0, 34, 77, 1],
                ["color", 0, 0, 0, 0]
              ],
              ["color", 0, 0, 0, 0]
            ]
          }
        }
      }
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
    relevantConfigs: [...relevantConfigsDefaults, "soil_moisture"],
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
    relevantConfigs: [
      ...relevantConfigsDefaults,
      "soil_moisture", "sri", "duration"],
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
    file: "SFI_circ_A3.tif",
    name: i18n.t("label_layer_sfi"),
    unit: "",
    decimals: Infinity,
    valueConverter: (val) => {
      return sfiCats.filter((cat) => cat.range[0] <= val && val < cat.range[1])[0].sfi;
    },
    relevantConfigs: [
      ...relevantConfigsDefaults,
      "soil_moisture", "sri", "duration"],
    legend: {
      tooltips: [
        { label: "0", message: i18n.t("tooltip_sfi_0") },
        { label: "1", message: i18n.t("tooltip_sfi_1") },
        { label: "2", message: i18n.t("tooltip_sfi_2") },
        { label: "3", message: i18n.t("tooltip_sfi_3") }],
        valueConverter: (val) => sfiLegendLabels[val]
    },
    style: {
      options: {
        defaultKey: "SFI",
        styles: {
          "SFI": {
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
              ["color", 84, 194, 31, 1]
            ]
          },
          "Viridis": {
            color: [
              "case",
              ["!=", ["band", 2], 0],
              [
                "case",
                ["<", ["band", 1], 0.5], [253, 231,  36, 1],
                ["<", ["band", 1], 2], [53, 183, 120, 1],
                ["<", ["band", 1], 5], [48, 103, 141, 1],
                [">=", ["band", 1], 5], [68,  1,  84, 1],
                ["color", 147, 68, 144, 1],
              ],
              ["color", 84, 194, 31, 1]
            ]
          },
          "Cividis": {
            color: [
              "case",
              ["!=", ["band", 2], 0],
              [
                "case",
                ["<", ["band", 1], 0.5], [253, 231,  55, 1],
                ["<", ["band", 1], 2], [165, 155, 115, 1],
                ["<", ["band", 1], 5], [87, 93, 109, 1],
                [">=", ["band", 1], 5], [0, 34, 77, 1],
                ["color", 147, 68, 144, 1],
              ],
              ["color", 84, 194, 31, 1]
            ]
          }
        }
      }
    },
    child_layer: {
      id: "SFGF",
      file: "SFGF.tif",
      name: i18n.t("label_layer_sfgf"),
      unit: "",
      decimals: 0,
      relevantConfigs: [
        ...relevantConfigsDefaults,
        "soil_moisture", "sri", "duration", "show_sfgf"],
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
    relevantConfigs: [
      ...relevantConfigsDefaults,
      "soil_moisture", "sri", "duration"],
    condition: conditionAI,
    backupLayer: "OA",
    style: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [
          "case",
          // colors from https://sgx.geodatenzentrum.de/wms_starkregen
          ["<", ["band", 1], 5], [160, 160, 160, 0.5],
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
    relevantConfigs: [
      ...relevantConfigsDefaults,
      "soil_moisture", "sri", "duration"],
    condition: conditionAI,
    backupLayer: "OA",
    style: {
      color: [
        "case",
        ["!=", ["band", 2], 0],
        [
          "case",
          ["<", ["band", 1], 0.2], [160, 160, 160, 0.5],
          ["<", ["band", 1], 0.5], [255, 255, 178, 1],
          ["<", ["band", 1], 1], [254, 204, 92, 1],
          ["<", ["band", 1], 2], [253, 141, 60, 1],
          [">=", ["band", 1], 2], [227, 26, 28, 1],
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
  },
  {
    id: "damage",
    url: ({ region }) => {
      return `/static/sfi_demo/${region}/damage.geojson`
    },
    name: i18n.t("label_layer_damage"),
    type: "GeoJSON",
    unit: (config) => config.damagePerHoushold? `€/100 ${i18n.t('layer_damage_unit_housholds')}`:"€",
    decimals: 0,
    relevantConfigs: [
      ...relevantConfigsDefaults,
      "soil_moisture", "sri", "duration", "damageKind", "preparedness", "damagePerHoushold"],
    condition: conditionDamage,
    backupLayer: "SFI",
    style: {
      options: {
        defaultKey: "YlOrRd",
        defaultColormapsOpts: {
          ranges: (config) => {
            if (config.damagePerHoushold) {
              return [
                [0, 500],
                [500, 5_000],
                [5_000, 25_000],
                [25_000, 50_000],
                [50_000, 100_000],
                [100_000, 250_000],
                [250_000, 500_000],
                [500_000, 750_000],
                [750_000, 1_000_000],
                [1_000_000, Infinity]]
            } else {
              return [
                [0, 5_000],
                [5_000, 50_000],
                [50_000, 250_000],
                [250_000, 500_000],
                [500_000, 1_000_000],
                [1_000_000, 2_500_000],
                [2_500_000, 5_000_000],
                [5_000_000, 10_000_000],
                [10_000_000, 25_000_000],
                [25_000_000, Infinity]]
            }
          },
        },
        colormaps: {
          "YlOrRd": {
            "colors": [
              [255, 255, 204],
              [255, 239, 165],
              [254, 221, 128],
              [254, 191, 90],
              [253, 157, 67],
              [252, 112, 51],
              [243, 60, 37],
              [217, 19, 30],
              [181, 0, 38],
              [128, 0, 38],
            ],
          },
          "inferno": {
            "colors": [
              [0, 0, 3],
              [26, 11, 64],
              [74, 11, 106],
              [120, 28, 109],
              [164, 44, 96],
              [207, 68, 70],
              [237, 104, 37],
              [251, 155, 6],
              [247, 209, 60],
              [252, 254, 164],
            ],
          },
          "plasma": {
            "colors": [
              [12, 7, 134],
              [69, 3, 158],
              [114, 0, 168],
              [155, 23, 158],
              [188, 54, 133],
              [215, 87, 107],
              [236, 120, 83],
              [250, 159, 58],
              [252, 201, 38],
              [239, 248, 33],
            ],
          },
          "viridis": {
            "colors": [
              [68, 1, 84],
              [71, 39, 119],
              [62, 73, 137],
              [48, 103, 141],
              [37, 130, 142],
              [30, 157, 136],
              [53, 183, 120],
              [109, 206, 88],
              [181, 221, 43],
              [253, 231, 36],
            ],
          },
          "magma": {
            "colors": [
              [0, 0, 3],
              [23, 15, 60],
              [67, 15, 117],
              [113, 31, 129],
              [158, 46, 126],
              [205, 63, 112],
              [240, 96, 93],
              [253, 149, 103],
              [254, 201, 141],
              [251, 252, 191],
            ],
          },
          "cividis": {
            "colors": [
              [0, 34, 77],
              [17, 53, 111],
              [58, 72, 107],
              [87, 93, 109],
              [111, 112, 115],
              [137, 134, 120],
              [165, 155, 115],
              [195, 179, 104],
              [225, 204, 84],
              [253, 231, 55],
            ],
          },
          "hot": {
            "colors": [
              [10, 0, 0],
              [84, 0, 0],
              [157, 0, 0],
              [233, 0, 0],
              [255, 52, 0],
              [255, 128, 0],
              [255, 201, 0],
              [255, 255, 34],
              [255, 255, 144],
              [255, 255, 255],
            ],
          },
          "afmhot": {
            "colors": [
              [0, 0, 0],
              [56, 0, 0],
              [112, 0, 0],
              [170, 42, 0],
              [226, 98, 0],
              [255, 156, 29],
              [255, 212, 84],
              [255, 255, 143],
              [255, 255, 198],
              [255, 255, 255],
            ],
          },
        }
      },
      function: ({config, cmap}) => {
        var styleCache = {};
        return (feature, resolution) => {
          let val = feature.get("damage")[config.sri][config.duration][config.soilMoisture][config.preparedness][config.damageKind];
          if (config.damagePerHoushold) {
            val = (val / parseInt(feature.get("housholds"))) * 100;
          }
          if (!styleCache[val]) {
            styleCache[val] = new Style({
              fill: new Fill({
                color: cmap(val)
              }),
              stroke: new Stroke({
                color: 'black',
                width: 1
              })
            });
          }
          return styleCache[val];
        }
      }
    },
    propertyName: (config) => ["damage", config.sri, config.duration, config.soilMoisture, config.preparedness, config.damageKind],
    legend: {
      valueConverter: (val) => {
        let [val1, val2] = val.split("-").map((v) => v.trim() != "Infinity" ? parseInt(v.trim()) : "∞")
        for (let [div, unit] of [[1_000_000, "M"], [1_000, "k"]]) {
          [val1, val2] = [val1, val2].map((val) => {
            if ((typeof val == "number") & ((val / div) >= 1)) {
              val = `${val / div}${unit}`
            }
            return val
          })
        }
        if (val1 == "0") {
          return `< ${val2}`
        } else if (val2 == "∞") {
          return `> ${val1}`
        } else {
          return `${val1}-${val2}`
        }
      }
    },
    valueConverterConfig: (config) => {
      if (config.damagePerHoushold) {
        return (val, { features }) => {
          val = (val / parseInt(features[0].get("housholds"))) * 100;
          return (val < 500) ? "<500" : (
            (val < 10_000) ? Math.round(val / 100) * 100 : Math.round(val / 1_000) * 1_000
          )
        }
      } else {
        return (val) => (val < 5_000) ? "<5k" : (
          (val < 100_000)? Math.round(val / 1_000) * 1_000 : Math.round(val / 10_000) * 10_000
        )
      }
    }
  }
];