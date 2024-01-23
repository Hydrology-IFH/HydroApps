"use strict";

class InputField{
    constructor(name, type="input"){
        this.type = type;
        this.dom_invalid_feedback = document.getElementById("invalid-feedback-" + name);
        this.dom_input = document.querySelector(type + "#" + name);
        this.dom_form = document.getElementById("select_stations_form");
    }

    make_valid(){
        this.dom_input.setCustomValidity('');
        this.dom_invalid_feedback.display = "none";
        this.dom_invalid_feedback.querySelector("ul").innerHTML = "";
    }

    make_invalid(msg){
        this.dom_form.classList.add("was-validated");
        this.dom_invalid_feedback.display = "block";
        this.dom_invalid_feedback.querySelector("ul").innerHTML += "<li>" + msg +"</li>";
        this.dom_input.setCustomValidity(this.dom_invalid_feedback.textContent);
    }

    is_valid(){
        return this.dom_input.checkValidity();
    }

    get_value(){
        if (this.type=="select" && this.dom_input.multiple){
            return [...this.dom_input.selectedOptions].map(option => option.value)
        } else {
            return this.dom_input.value;
        }
    }
}

class KombstraMap{
    constructor(){
        // input fields
        this.input_perc = new InputField("percentile", "select");
        this.input_period = new InputField("event_rank", "select");
        this.input_para =  new InputField("para", "select");

        // buttons
        this.buttons = {
            // colapse_card_map: document.getElementById("btn_collapse_accordion_map"),
            // colapse_card_manualy: document.getElementById("btn_collapse_accordion_manualy"),

            // color_selection: document.getElementById("btn_color_selection"),
            // remove_coloring: document.getElementById("btn_remove_coloring"),
            // filter_stations: document.getElementById("btn_filter_stations"),
            // remove_filter: document.getElementById("btn_remove_filter"),
            // add_plots: document.getElementById("btn_add_plots")
        }

        // create map
        this.create_basemap()
    }

    addButonEventListeners(){
        this.buttons.add_plots.addEventListener(
            "click",
            (event) => {
                this.add_plots();
                event.target.value = gettext("add new plots");
            }
        )
    }

    addInputEventListeners(){
        this.input_stids.dom_input.addEventListener(
            "change",(e)=>{
                this.check_stations_input();
                this.update_coloring();
                this.update_filter();
            });
    }

    addEventListeners(){
        this.addButonEventListeners();
        this.addInputEventListeners();
    }

    create_basemap(){
        // create the map with OSM as background
        this.map = L.map(document.getElementById("map")).setView([51.351, 10.459], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 20,
            tilesextent:[7.5, 47.27, 10.5, 55.06]
        }).addTo(this.map);

        // add a scale to the map
        this.map_scale = L.control.scale();
        this.map_scale.addTo(this.map);
    }

    load_kombstra_grid() {
        let tif_url = location.origin + location.pathname.replace("de", "static").replace("map", "data/kombstra_views/10_1.tif")
        const noDataValue = 99999;
        const projection = "+proj=stere +lat_0=90 +lat_ts=60 +lon_0=10 +x_0=0 +y_0=0 +R=6370040 +units=km +no_defs";
        const xmin = -40;
        const ymax = 14;
        const pixelWidth = 0.00001;
        const pixelHeight = 0.00001;
        const metadata = { noDataValue, projection, xmin, ymax, pixelWidth, pixelHeight };
        fetch(tif_url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                let nodata = 99999;
                let projection = ""
                let metadata = {nodata, }
                parseGeoraster(arrayBuffer).then(georaster => {
                console.log("georaster:", georaster);
                var layer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.7,
                    pixelValuesToColorFn: values => values[0] === 42 ? '#ffffff' : '#000000',
                    resolution: 64 // optional parameter for adjusting display resolution
                });
                layer.addTo(kombstraMap.map);

                // kombstraMap.map.fitBounds(layer.getBounds());

            });
            });

        resp = fetch("http://localhost:8000/de/kombstra/api/kombstra_grid/?percentile=10&event_rank=1&para=YEAR")
            .then(response => response.json())
            .then(response => response[0].rast_wkb)
            .then(parseGeoraster)
    }

    apply_coloring(){
        // make the selected stations green and the other red
        this.coloring_active = true;
        let selected_stids = this.get_selected_stations();

        this.lmarkers.getLayers().forEach((layer) => {
            if (selected_stids.includes(layer.feature.properties.pk)){
                layer.setIcon(new this.IconSelect);
            } else {
                layer.setIcon(new this.IconUnselect);
            }
        });

        this.legend.addTo(this.map);
    }

    remove_coloring(){
        this.coloring_active=false;
        this.lmarkers.getLayers().forEach((layer) => {
            layer.setIcon(new this.IconDefault)
        })
        this.legend.remove();
    }

    update_coloring(){
        if (this.coloring_active){
            this.apply_coloring();
        }
    }

    apply_filter(){
        let selected_stids = this.get_selected_stations();
        this.filtering_active = true;

        let filter_stids = (feature) => {return false};
        if (selected_stids.length > 0){
            filter_stids = (feature) => {
                return selected_stids.includes(feature.properties.pk);
            }
        }

        // create filter of all together
        let filter = (feature) => {
            return filter_stids(feature);
        }

        this.load_stations_to_map(filter=filter);
    }

    remove_filter(){
        this.load_stations_to_map();
        this.filtering_active=false;
    }

    update_filter(){
        if (this.filtering_active){
            this.apply_filter();
        }
    }

    // update_feature_selection(){
    //     this.lmarkers.getLayers().forEach((layer)=>{
    //         layer.feature.properties.is_selected = this.is_selected(layer.feature.properties.pk);
    //     })
    // }

    add_plot(stid, para, period){
        // if (!plotAreaApp.plots_data.some(el=>{return (el.station_id == stid) && (el.para == para) && (el.period == period)})){
        //     plotAreaApp.plots_data.push({
        //         station_id: stid,
        //         para: para,
        //         period: period})
        // }
        // plotAreaApp.
        add_plot(stid, para, period)
    }

    add_plots(){
        let paras = this.get_paras();
        let periods = this.get_periods();
        let stids  = this.get_selected_stations();
        stids.forEach((stid) => {
            paras.forEach((para) =>{
                periods.forEach((period) => {
                    this.add_plot(stid=stid, para=para, period=period);
                })
            })
        });
    }

    get_selected_stations(){
        let stids = this.input_stids.get_value().split(",").map((el) => el.trim());
        if (stids.length == 1 & stids[0] == ""){
            return []
        } else {
            return stids
        }
    }

    get_periods(){
        return this.input_period.get_value();
    }

    get_paras(){
        return this.input_para.get_value();
    }

    is_selected(stid){
        return this.get_selected_stations().includes(String(stid));
    }

    select_station(stid){
        if (this.check_stid(stid) && !this.get_selected_stations().includes(stid)){
            if (this.input_stids.get_value().length == 0){
                this.input_stids.dom_input.value = stid;
            } else {
                this.input_stids.dom_input.value += ", " + stid;
            }
            this.update_coloring();
            this.update_filter();
            this.check_stations_input();
        }
    }

    unselect_station(stid){
        let selected_stids = this.get_selected_stations();
        if (selected_stids.includes(stid)){
            selected_stids.splice(selected_stids.indexOf(stid),1);
            this.input_stids.dom_input.value = selected_stids.join(", ");
            this.update_coloring();
            this.update_filter();
            this.check_stations_input();
        }
    }

    check_stid(stid){
        return this.station_ids.includes(stid)
    }

    check_stations_input(){
        this.input_stids.make_valid();
        // this.form_dom.classList.add("was-validated");
        let in_text = this.input_stids.get_value();
        if (in_text.length == 0) {
            this.input_stids.make_invalid(
                "You didn't select any station. Please enter a comma-seperated list of station IDs.");
            return false;
        } else {
            // check if input has right pattern
            if (!(/^\s*\w+_(\d{1,5})\s*([,;]{1}\s*\w+_\d{1,5})*[\s,;]*$/.test(in_text))){
                this.input_stids.make_invalid(
                    "The given list of stations is not in the right pattern.<br>The Station Ids must be provided as a comma or semmicolon seperated list of IDs.");
                return false;
            }
        }

        // check if given stids are in the meta file
        let in_stids = in_text.trim().replaceAll(";", ",").replaceAll(/[,\s]+$/gm, "").split(",").map((el) => el.trim());
        in_stids = Array.from(new Set(in_stids));
        let valid_stids = [];
        let invalid_stids = [];
        for (let stid of in_stids){
            if (this.check_stid(stid)){
                valid_stids.push(stid);
            } else {
                invalid_stids.push(stid);
            }
        }
        if (invalid_stids.length > 0){
            this.input_stids.make_invalid("The following Station Ids are not valid and should get removed: <br>" + invalid_stids.join(", "));
        }

        this.input_stids.dom_input.value = in_stids.join(", ");

        // block ammount of stations to 10
        if (this.get_selected_stations().length > 10){
            this.input_stids.make_invalid("You are only able to select 10 stations at once. If you want to see more station plots please select them in batches. This means, adding 10 plots and then delete your selection and create a new one. Then add those stations plots.");
        }
        return this.input_stids.is_valid();
    }

}


const kombstraMap = new KombstraMap();

// button functions
// let check_stations_input = function(event){
//     event.stopPropagation();
//     form.check_stations_input()
// }
// form.input_stids.addEventListener("change", check_stations_input)

let button_select_station = (stid, event) => {
    if (event.target.innerText == gettext("select")) {
        kombstraMap.select_station(stid);
        event.target.innerText = gettext("unselect");
    } else {
        kombstraMap.unselect_station(stid);
        event.target.innerText = gettext("select");
    }
}

kombstraMap.addEventListeners()