import i18n from 'i18next';

const sfiCats = [
  { sfi: 0, range: [0, 0.5] },
  { sfi: 1, range: [0.5, 1] },
  { sfi: "1+", range: [1, 2]},
  { sfi: 2, range: [2, 3] },
  { sfi: "2+", range: [3, 4] },
  { sfi: "2++", range: [4, 5]},
  { sfi: 3, range: [5, 10] },
  { sfi: "3+", range: [10, 15] },
  { sfi: "3++", range: [15, 100] },
]

const sriCats = {
  1: { T: "1 - 2" },
  2: { T: ">2 - 5" },
  3: { T: ">5 - 10" },
  4: { T: ">10 - 25" },
  5: { T: ">25 - 30" },
  6: { T: ">30 - 50" },
  7: { T: ">50 - 100" },
  8: { T: ">100", F: "1,20 - 1,39" },
  9: { T: ">100", F: "1,40 - 1,59" },
  10: { T: ">100", F: "1,60 - 2,19" },
  11: { T: ">100", F: "2,20 - 2,79" },
  12: { T: ">100", F: "&GreaterSlantEqual;2,80" }
}

export const LAYERS = [
  {
    id: "precipitation",
    file: "N.tif",
    name: i18n.t("label_layer_precipitation"),
    unit: "mm",
    decimals: 0,
    style: {
      colorscale: {
        min: 0,
        max: 120,
        colorbar: "viridis",
        continous: true,
        reverse: false,
      },
    },
  },
  {
    id: "OA",
    file: "OA_circ_A2.tif",
    name: i18n.t("label_layer_oa"),
    unit: "mm",
    decimals: 1,
    style: {
      colorscale: {
        min: 0,
        max: 90,
        colorbar: "viridis",
        continous: true,
        reverse: false,
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
      ignoreLabels: ["< 1"]
    },
    style: {
      color: [
        "case",
        ["!=",["band",2],0],
        [
          "case",
          ["==", ["band", 1], 0], [84, 194, 31, 1],
          ["<", ["band", 1], 0.5], [84, 194, 31, 1],
          [
            "interpolate",
            ["linear"],
            ["band",1],
            0.5, [255,236,1,1],
            2, [226,35,35,1],
            5, [147, 68, 144, 1]
          ]
        ],
        ["color",0,0,0,0]
      ]
    }
  }
];