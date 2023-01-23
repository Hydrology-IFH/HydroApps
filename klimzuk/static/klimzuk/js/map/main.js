import {KlimZukMap} from "./KlimZukMap.js";
import {PlotArea} from "./PlotArea.js";

const klimzukmap = new KlimZukMap();

let select_station = (stid) => {
    klimzukmap.select_station(stid);
}

klimzukmap.addEventListeners()