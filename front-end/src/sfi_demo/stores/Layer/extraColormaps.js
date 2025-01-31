import colorScale from 'colormap/colorScale.js';

function registerColormap(key, colormap) {
  if (colormap.every(c => c.index !== undefined && c.rgb?.length == 3)) {
    colorScale[key.toLowerCase()] = colormap;
  } else {
      throw new Error('Invalid colormap');
  }
}

// colormap created online with http://colormaker.org/
// ----------------------------------------------------
registerColormap("BluPu", [
  {"index":0, "rgb":[119, 206, 234]},
  {"index":0.0588235294117647, "rgb":[114, 198, 237]},
  {"index":0.117647058823529, "rgb":[107, 190, 242]},
  {"index":0.176470588235294, "rgb":[106, 181, 244]},
  {"index":0.235294117647059, "rgb":[102, 173, 246]},
  {"index":0.294117647058824, "rgb":[102, 164, 248]},
  {"index":0.352941176470588, "rgb":[102, 155, 249]},
  {"index":0.411764705882353, "rgb":[106, 146, 246]},
  {"index":0.470588235294118, "rgb":[108, 137, 246]},
  {"index":0.529411764705882, "rgb":[109, 128, 244]},
  {"index":0.588235294117647, "rgb":[112, 118, 240]},
  {"index":0.647058823529412, "rgb":[115, 108, 235]},
  {"index":0.705882352941177, "rgb":[119, 99, 228]},
  {"index":0.764705882352941, "rgb":[123, 88, 220]},
  {"index":0.823529411764706, "rgb":[127, 76, 214]},
  {"index":0.882352941176471, "rgb":[132, 63, 205]},
  {"index":0.941176470588235, "rgb":[138, 44, 198]},
  {"index":1, "rgb":[145, 2, 191]}
]);

registerColormap("OrBu", [
  {"index":0, "rgb":[253, 136, 4]},
  {"index":0.0416666666666666, "rgb":[231, 141, 8]},
  {"index":0.0833333333333333, "rgb":[212, 144, 12]},
  {"index":0.125, "rgb":[193, 146, 20]},
  {"index":0.166666666666666, "rgb":[174, 147, 31]},
  {"index":0.208333333333333, "rgb":[156, 147, 38]},
  {"index":0.25, "rgb":[139, 146, 49]},
  {"index":0.291666666666666, "rgb":[121, 144, 57]},
  {"index":0.333333333333333, "rgb":[105, 142, 69]},
  {"index":0.375, "rgb":[86, 140, 79]},
  {"index":0.416666666666666, "rgb":[68, 137, 90]},
  {"index":0.458333333333333, "rgb":[55, 132, 102]},
  {"index":0.5, "rgb":[42, 127, 111]},
  {"index":0.541666666666666, "rgb":[38, 122, 119]},
  {"index":0.583333333333333, "rgb":[25, 117, 126]},
  {"index":0.625, "rgb":[33, 110, 131]},
  {"index":0.666666666666666, "rgb":[39, 104, 136]},
  {"index":0.708333333333333, "rgb":[43, 97, 141]},
  {"index":0.75, "rgb":[46, 91, 147]},
  {"index":0.791666666666666, "rgb":[48, 83, 153]},
  {"index":0.833333333333333, "rgb":[48, 76, 162]},
  {"index":0.875, "rgb":[48, 67, 172]},
  {"index":0.916666666666666, "rgb":[49, 56, 184]},
  {"index":0.958333333333333, "rgb":[53, 40, 197]},
  {"index":1, "rgb":[43, 4, 223]},
]);

registerColormap("cmocean:rain", [
  {"index":1/250, "rgb":[238,237,243]},
  {"index":10/250, "rgb":[232,228,229]},
  {"index":20/250, "rgb":[225,217,212]},
  {"index":30/250, "rgb":[220,206,193]},
  {"index":40/250, "rgb":[215,196,174]},
  {"index":50/250, "rgb":[205,188,155]},
  {"index":60/250, "rgb":[190,182,142]},
  {"index":70/250, "rgb":[173,176,135]},
  {"index":80/250, "rgb":[156,170,129]},
  {"index":90/250, "rgb":[138,165,123]},
  {"index":100/250, "rgb":[121,159,118]},
  {"index":110/250, "rgb":[101,154,114]},
  {"index":120/250, "rgb":[81,148,111]},
  {"index":130/250, "rgb":[61,142,110]},
  {"index":140/250, "rgb": [36, 134, 110] },
  {"index":150/250, "rgb": [18, 126, 110] },
  {"index":160/250, "rgb": [6, 117, 110]},
  {"index":170/250, "rgb":[3,108,109]},
  {"index":180/250, "rgb":[8,99,107]},
  {"index":190/250, "rgb":[18,90,103]},
  {"index":200/250, "rgb":[26,80,99]},
  {"index":210/250, "rgb":[33,71,92]},
  {"index":220/250, "rgb":[36,61,84]},
  {"index":230/250, "rgb":[37,52,76]},
  {"index":240/250, "rgb":[37,42,68]},
  {"index":250/250, "rgb":[35,33,61]},
])

// source https://www.giss.nasa.gov/tools/panoply/colorbars/
registerColormap("NEO_soil_moisture", [
  {"index": 0.0, "rgb": [0, 59, 98]},
  {"index": 0.04, "rgb": [0, 63, 104]},
  {"index": 0.08, "rgb": [0, 67, 109]},
  {"index": 0.12, "rgb": [0, 73, 115]},
  {"index": 0.16, "rgb": [0, 78, 121]},
  {"index": 0.2, "rgb": [0, 89, 124]},
  {"index": 0.24, "rgb": [0, 103, 127]},
  {"index": 0.28, "rgb": [0, 117, 129]},
  {"index": 0.32, "rgb": [0, 132, 131]},
  {"index": 0.36, "rgb": [0, 145, 132]},
  {"index": 0.4, "rgb": [0, 157, 135]},
  {"index": 0.44, "rgb": [0, 165, 140]},
  {"index": 0.48, "rgb": [7, 172, 145]},
  {"index": 0.52, "rgb": [56, 183, 150]},
  {"index": 0.56, "rgb": [88, 192, 157]},
  {"index": 0.6, "rgb": [105, 200, 161]},
  {"index": 0.64, "rgb": [118, 204, 161]},
  {"index": 0.68, "rgb": [129, 207, 164]},
  {"index": 0.72, "rgb": [142, 212, 165]},
  {"index": 0.76, "rgb": [162, 216, 170]},
  {"index": 0.8, "rgb": [176, 223, 174]},
  {"index": 0.84, "rgb": [190, 226, 186]},
  {"index": 0.88, "rgb": [202, 227, 196]},
  {"index": 0.92, "rgb": [214, 232, 208]},
  {"index": 0.96, "rgb": [226, 233, 218]},
  {"index": 1.0, "rgb": [236, 237, 229]},
])

registerColormap("NEO_trmm_rainfall", [
  {"index": 0.0, "rgb": [8, 70, 136]},
  {"index": 0.04, "rgb": [8, 83, 149]},
  {"index": 0.08, "rgb": [8, 95, 163]},
  {"index": 0.12, "rgb": [11, 107, 174]},
  {"index": 0.16, "rgb": [22, 119, 179]},
  {"index": 0.2, "rgb": [33, 130, 185]},
  {"index": 0.24, "rgb": [44, 141, 191]},
  {"index": 0.28, "rgb": [55, 153, 197]},
  {"index": 0.32, "rgb": [66, 166, 204]},
  {"index": 0.36, "rgb": [77, 178, 210]},
  {"index": 0.4, "rgb": [91, 186, 207]},
  {"index": 0.44, "rgb": [105, 194, 202]},
  {"index": 0.48, "rgb": [119, 202, 197]},
  {"index": 0.52, "rgb": [133, 208, 193]},
  {"index": 0.56, "rgb": [147, 213, 188]},
  {"index": 0.6, "rgb": [161, 218, 183]},
  {"index": 0.64, "rgb": [174, 223, 184]},
  {"index": 0.68, "rgb": [185, 228, 189]},
  {"index": 0.72, "rgb": [196, 232, 194]},
  {"index": 0.76, "rgb": [206, 236, 199]},
  {"index": 0.8, "rgb": [212, 238, 206]},
  {"index": 0.84, "rgb": [218, 241, 213]},
  {"index": 0.88, "rgb": [225, 243, 220]},
  {"index": 0.92, "rgb": [232, 246, 226]},
  {"index": 0.96, "rgb": [240, 249, 233]},
  {"index": 1.0, "rgb": [247, 252, 240]},
])

registerColormap("EO_soil_moist_div", [
  {"index": 0.0, "rgb": [31, 151, 239]},
  {"index": 0.04, "rgb": [44, 160, 241]},
  {"index": 0.08, "rgb": [56, 166, 240]},
  {"index": 0.12, "rgb": [68, 173, 241]},
  {"index": 0.16, "rgb": [77, 179, 240]},
  {"index": 0.2, "rgb": [88, 187, 242]},
  {"index": 0.24, "rgb": [101, 193, 239]},
  {"index": 0.28, "rgb": [120, 197, 238]},
  {"index": 0.32, "rgb": [136, 201, 235]},
  {"index": 0.36, "rgb": [152, 207, 234]},
  {"index": 0.4, "rgb": [168, 212, 231]},
  {"index": 0.44, "rgb": [185, 215, 229]},
  {"index": 0.48, "rgb": [201, 220, 226]},
  {"index": 0.52, "rgb": [206, 217, 210]},
  {"index": 0.56, "rgb": [209, 212, 190]},
  {"index": 0.6, "rgb": [213, 208, 172]},
  {"index": 0.64, "rgb": [216, 204, 149]},
  {"index": 0.68, "rgb": [219, 199, 129]},
  {"index": 0.72, "rgb": [221, 194, 108]},
  {"index": 0.76, "rgb": [221, 188, 89]},
  {"index": 0.8, "rgb": [215, 180, 77]},
  {"index": 0.84, "rgb": [211, 170, 64]},
  {"index": 0.88, "rgb": [204, 161, 49]},
  {"index": 0.92, "rgb": [200, 151, 35]},
  {"index": 0.96, "rgb": [193, 143, 25]},
  { "index": 1.0, "rgb": [189, 134, 24] },
])

registerColormap("EO_aura_omi_formal", [
  {"index": 0.0, "rgb": [85, 0, 82]},
  {"index": 0.04, "rgb": [100, 2, 93]},
  {"index": 0.08, "rgb": [112, 10, 108]},
  {"index": 0.12, "rgb": [129, 18, 126]},
  {"index": 0.16, "rgb": [132, 33, 139]},
  {"index": 0.2, "rgb": [134, 49, 146]},
  {"index": 0.24, "rgb": [136, 70, 158]},
  {"index": 0.28, "rgb": [141, 86, 164]},
  {"index": 0.32, "rgb": [138, 98, 173]},
  {"index": 0.36, "rgb": [139, 114, 179]},
  {"index": 0.4, "rgb": [141, 122, 185]},
  {"index": 0.44, "rgb": [139, 141, 191]},
  {"index": 0.48, "rgb": [139, 150, 196]},
  {"index": 0.52, "rgb": [144, 158, 201]},
  {"index": 0.56, "rgb": [148, 167, 206]},
  {"index": 0.6, "rgb": [153, 178, 212]},
  {"index": 0.64, "rgb": [161, 189, 218]},
  {"index": 0.68, "rgb": [169, 195, 222]},
  {"index": 0.72, "rgb": [183, 205, 226]},
  {"index": 0.76, "rgb": [189, 211, 232]},
  {"index": 0.8, "rgb": [205, 221, 235]},
  {"index": 0.84, "rgb": [219, 232, 242]},
  {"index": 0.88, "rgb": [225, 238, 245]},
  {"index": 0.92, "rgb": [231, 241, 249]},
  {"index": 0.96, "rgb": [237, 244, 250]},
  { "index": 1.0, "rgb": [255, 255, 255] },
])

registerColormap("SVS_soil_moisture", [
  {"index": 0.0, "rgb": [1, 23, 220]},
  {"index": 0.037037037037037035, "rgb": [0, 33, 206]},
  {"index": 0.07407407407407407, "rgb": [0, 44, 192]},
  {"index": 0.1111111111111111, "rgb": [0, 56, 177]},
  {"index": 0.14814814814814814, "rgb": [0, 66, 162]},
  {"index": 0.18518518518518517, "rgb": [1, 78, 148]},
  {"index": 0.2222222222222222, "rgb": [2, 89, 134]},
  {"index": 0.25925925925925924, "rgb": [3, 100, 119]},
  {"index": 0.2962962962962963, "rgb": [6, 112, 102]},
  {"index": 0.3333333333333333, "rgb": [9, 125, 88]},
  {"index": 0.37037037037037035, "rgb": [10, 140, 66]},
  {"index": 0.4074074074074074, "rgb": [14, 153, 50]},
  {"index": 0.4444444444444444, "rgb": [22, 168, 35]},
  {"index": 0.48148148148148145, "rgb": [30, 181, 18]},
  {"index": 0.5185185185185185, "rgb": [42, 192, 9]},
  {"index": 0.5555555555555556, "rgb": [59, 199, 4]},
  {"index": 0.5925925925925926, "rgb": [76, 208, 0]},
  {"index": 0.6296296296296297, "rgb": [102, 217, 0]},
  {"index": 0.6666666666666666, "rgb": [126, 224, 0]},
  {"index": 0.7037037037037037, "rgb": [146, 229, 0]},
  {"index": 0.7407407407407407, "rgb": [165, 232, 2]},
  {"index": 0.7777777777777778, "rgb": [184, 233, 4]},
  {"index": 0.8148148148148148, "rgb": [200, 227, 10]},
  {"index": 0.8518518518518519, "rgb": [208, 222, 15]},
  {"index": 0.8888888888888888, "rgb": [214, 214, 22]},
  {"index": 0.9259259259259259, "rgb": [221, 204, 28]},
  {"index": 0.9629629629629629, "rgb": [228, 191, 38]},
  {"index": 1.0, "rgb": [234, 180, 46]},
])
