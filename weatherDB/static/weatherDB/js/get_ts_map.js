"use strict";
class InputField{
    constructor(name, type="input"){
        this.dom_invalid_feedback = document.getElementById("invalid-feedback-" + name);
        this.dom_input = document.querySelector(type + "#" + name);
        this.dom_form = document.getElementById("download_form");
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
        return this.dom_input.value;
    }
}


class Form{
    constructor(){
        this.get_stations_data()
        this.max_downloads = max_downloads;

        // hCaptcha
        this.needs_captcha = needs_captcha;
        this.captcha_active_since;

        // input fields
        this.input_stids = new InputField("station_ids", "textarea");
        this.input_period_start = new InputField("period_start");
        this.input_period_end =  new InputField("period_end");
        this.input_kind = new InputField("kind", "select");
        this.input_aggregation = new InputField("aggregation", "select");
        this.input_add_filled_by = new InputField("add_filled_by");
        this.input_add_na_share = new InputField("add_na_share");

        // buttons
        this.buttons = {
            colapse_card_map: document.getElementById("btn_colapse_card_map"),
            colapse_card_manualy: document.getElementById("btn_colapse_card_manualy"),

            color_selection: document.getElementById("btn_color_selection"),
            remove_coloring: document.getElementById("btn_remove_coloring"),
            filter_stations: document.getElementById("btn_filter_stations"),
            remove_filter: document.getElementById("btn_remove_filter"),
            // upload_shape: document.getElementById("btn_upload_shape"),
            // draw_polygon: document.getElementById("btn_draw_polygon"),
            // geoencode: document.getElementById("btn_geoencode"),
            download_ts: document.getElementById("btn_download_ts")
        }

        // get laoding dom
        this.loading_dom = document.getElementById('loading');

        // get form
        this.form_dom = document.getElementById('download_form');

        // icons
        if (typeof base_url !== "undefined"){
            L.Icon.Default.prototype.options.imagePath = base_url;
        }else{
            L.Icon.Default.prototype.options.imagePath = location.origin + "/";
        }
        L.Icon.Default.prototype.options.shadowUrl = "static/weatherDB/img/Leaflet-Marker-shadow.png"; 
        this.IconDefault = L.Icon.Default.extend(
            {options:{iconUrl:"static/weatherDB/img/marker-icon-blue.png"}});
        this.IconUnselect = L.Icon.Default.extend(
            {options:{iconUrl:"static/weatherDB/img/marker-icon-red.png"}});
        this.IconSelect = L.Icon.Default.extend(
            {options:{iconUrl:"static/weatherDB/img/marker-icon-green.png"}});
        this.IconSelectOutPeriod = L.Icon.Default.extend(
            {options:{iconUrl:"static/weatherDB/img/marker-icon-orange.png"}});

        // min and max date
        this.min_tstp = this.geojson_data.features[0].properties.filled_from;
        this.max_tstp = this.geojson_data.features[0].properties.filled_until;
        this.geojson_data.features.forEach((feature)=>{
            if ((feature.properties.filled_from!=null & feature.properties.filled_from < this.min_tstp) | this.min_tstp == null){
                this.min_tstp = feature.properties.filled_from;
            }
            if ((feature.properties.filled_from!=null & feature.properties.filled_until > this.max_tstp) | this.max_tstp == null){
                this.max_tstp = feature.properties.filled_until;
            }
        });
        this.min_tstp = new Date(this.min_tstp);
        this.max_tstp = new Date(this.max_tstp);

        let min_tstp_str = `${this.min_tstp.getFullYear()}-${String(this.min_tstp.getMonth()+1).padStart(2, "0")}-${String(this.min_tstp.getDate()).padStart(2, "0")}`;
        let max_tstp_str = `${this.max_tstp.getFullYear()}-${String(this.max_tstp.getMonth()+1).padStart(2, "0")}-${String(this.max_tstp.getDate()).padStart(2, "0")}`;

        this.input_period_start.dom_input.setAttribute("min", min_tstp_str);
        this.input_period_start.dom_input.setAttribute("max", max_tstp_str);
        this.input_period_end.dom_input.setAttribute("min", min_tstp_str);
        this.input_period_end.dom_input.setAttribute("max", max_tstp_str);

        this.input_period_end.dom_input.value = max_tstp_str;
        this.input_period_start.dom_input.value = min_tstp_str;

        // set variables
        this.coloring_active = false;
        this.filtering_active = false;
        this.agg_to_alerted = false;
        this.add_filled_by_alerted = false;
        this.add_na_share_alerted = false;

        //  set legend element
        this.legend = new (L.Control.extend({
            onAdd: (map)=>{
                let div = L.DomUtil.create('div', 'legend container-fluid');
                div.innerHTML = "<h3>Legend</h3>"
                let icons = [this.IconSelect, this.IconSelectOutPeriod, this.IconUnselect]
                let names = ["selected", "selected, but not in date range", "not select"];
                for (let i=0; i <3; i++){
                    let row = L.DomUtil.create('div', "row justify-content-right");
                    let col_icon = L.DomUtil.create('div', "col-auto pr-0");
                    let icon_img = (new icons[i]).createIcon();
                    icon_img.style="";
                    icon_img.classList += "img-fluid";
                    col_icon.appendChild(icon_img);
                    row.appendChild(col_icon);
                    let col_text = L.DomUtil.create('div', "col");
                    col_text.innerHTML += `<b>${names[i]}</b>`;
                    row.appendChild(col_text);
                    div.appendChild(row);
                }
                return div;
            }
        }))

        // create map
        this.create_basemap()
        this.load_stations_to_map()

        // set default values for additional options
        this.input_add_filled_by.dom_input.checked=false;
        this.input_add_na_share.dom_input.checked=false;
    }

    addButonEventListeners(){
        this.buttons.color_selection.addEventListener(
            "click",
            (event) => {
                this.apply_coloring();
                event.target.textContent = "Update Coloring";
                this.buttons.remove_coloring.classList.remove("invisible");
            });
        this.buttons.remove_coloring.addEventListener(
            "click",
            (event) => {
                this.remove_coloring();
                this.buttons.color_selection.textContent = "Color Selection on map";
                event.target.classList.add("invisible");
            });
        this.buttons.filter_stations.addEventListener(
            "click",
            (event) => {
                this.apply_filter();
                event.target.textContent = "Update Filter";
                this.buttons.remove_filter.classList.remove("invisible");
            });
        this.buttons.remove_filter.addEventListener(
            "click",
            (event) => {
                this.remove_filter();
                this.buttons.filter_stations.textContent = "Filter Selection on map";
                event.target.classList.add("invisible");
            });
        this.buttons.download_ts.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (!this.check_form()) {
                    alert("Please check the input for errors.");
                } else {
                    form.loading_dom.style.display = "block";
                    $.ajax({type: "POST",
                        url: location.origin.concat(download_url),
                        data: $('#download_form').serialize(),
                        success: function(data) {
                            form.loading_dom.style.display = "none";
                            let link = document.createElement("a");
                            link.href = data;
                            link.click();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log("ERROR:");
                            console.log(errorThrown);console.log(textStatus);console.log(jqXHR);
                            if (jqXHR.responseText.search("CSRF verification failed")>=0) {
                                alert("There was an Error, while creating the timeseries. \nProbably your window was opened for too long.\nPlease reload the page and try again.")
                            } else {
                                alert("There was an Error, while creating the timeseries. Sorry!")
                            }
                            
                            form.loading_dom.style.display = "none";
                    }})
                }
            }
        )
    }

    addInputEventListeners(){
        this.input_stids.dom_input.addEventListener(
            "change",(e)=>{
                this.check_form();
                this.update_coloring();
                this.update_filter();
            });
        this.input_period_start.dom_input.addEventListener(
            "change",(e)=>{
                this.check_period();
                this.update_coloring();
            });
        this.input_period_end.dom_input.addEventListener(
            "change",(e)=>{
                this.check_period();
                this.update_coloring();
            });
        this.input_aggregation.dom_input.addEventListener(
            "change",(e)=>{
                this.check_aggregation();
            });
        this.form_dom.addEventListener(
            "keydown", (e) =>{
                e.preventDefault;
                if (e.key == 'Enter'){
                    this.check_form();
                }
            }
        )
        this.input_kind.dom_input.addEventListener(
            "change", (e) =>{
                this.check_add_filled_by();
                this.check_period();
                this.update_coloring();
            }
        )
        this.input_add_filled_by.dom_input.addEventListener(
            "change", (e)=>{
                this.check_add_filled_by();
            }
        )
        this.input_add_na_share.dom_input.addEventListener(
            "change", (e)=>{
                this.check_add_na_share();
            }
        )
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

    get_stations_data(){
        this.geojson_data = JSON.parse(
            document.getElementById("meta_n-data").textContent);
        this.station_ids = [];
        for (let feature of this.geojson_data.features){
            this.station_ids.push(feature.properties.pk);
        }
    }

    load_stations_to_map(filter=(feature) => {return true;}){
        // check if filter was given or set default
        // if (filter == undefined){
        //     filter = (feature) => {return true;}
        // }
        if (this.lmarkers != undefined){
            this.lmarkers.clearLayers();
        }
        // create station markers on map
        this.lmarkers = L.markerClusterGroup();
        this.lmarkers.addLayer(L.geoJSON(
            this.geojson_data,
            {filter: filter}));
        this.lmarkers = this.lmarkers.bindPopup(
            (layer) => {
                let stid = layer.feature.properties.pk;
                let raw_from = new Date(layer.feature.properties.raw_from);
                let raw_until = new Date(layer.feature.properties.raw_until);
                let filled_from = new Date(layer.feature.properties.filled_from);
                let filled_until = new Date(layer.feature.properties.filled_until);
                let richter_class = layer.feature.properties.richter_class;
                let quot_regnie_filled = Math.round(100/layer.feature.properties.quot_filled_regnie*1000)/10;
                let quot_hyras_filled = Math.round(100/layer.feature.properties.quot_filled_hyras*1000)/10;
                let quot_corr_filled = Math.round(layer.feature.properties.quot_corr_filled*10)/10;
                let date_options = {
                    year:'numeric', month:'numeric', day:'numeric',
                    hour:'numeric', minute:'2-digit'};
                let str = `<div class="container pl-0"><div class="row"><div class="col"><h6 style="float: left">Station ID: ${stid}</h6>\
                    <button class="btn btn-primary pr-3" style="float:right" type="button" onclick="button_select_station('${stid}', event)">select</button></div></div></div>\
                    <b>verfügbarer Zeitraum der eigenen Rohdaten:</b>\
                    <br>${raw_from.toLocaleString("de-DE", date_options)} - \
                    ${raw_until.toLocaleString("de-DE", date_options)}\
                    <br><b>verfügbarer Zeitraum der gefüllten Daten:</b>\
                    <br>${filled_from.toLocaleString("de-DE", date_options)} - \
                    ${filled_until.toLocaleString("de-DE", date_options)}
                    <br><b>Expositionsklasse:</b> ${richter_class}
                    <br><b>Faktoren:</b><br>
                    N<sub>corrected</sub> = ${quot_corr_filled}% &#8226; N<sub>filled</sub> <br>
                    N<sub>filled</sub> = ${quot_hyras_filled}% &#8226; N<sub>multi_annual, HYRAS</sub><br>
                    N<sub>filled</sub> = ${quot_regnie_filled}% &#8226; N<sub>multi_annual, REGNIE</sub><br>`
                    ;
                return str
            }
        )
        this.lmarkers.getLayers().forEach((layer) => {
            layer.setIcon(new this.IconDefault);
        })

        this.lmarkers.addTo(this.map);

        // fit map boundaries
        // if (this.lmarkers.getLayers().length > 1){
        //     this.map.fitBounds(this.lmarkers.getBounds(), { padding: [1, 1] });
        // } else if (this.lmarkers.getLayers().length == 1){

        //     let markerBounds = L.latLngBounds([this.lmarkers.getLayers()[0].getLatLng()]);
        //     this.map.fitBounds(markerBounds.pad(2), { padding: [1, 1] });
        // }

        // create a dictionary with the markers and their Station Id as key
        this.markers = {};
        this.lmarkers.getLayers().forEach((layer) => {
            this.markers[layer.feature.properties.pk] = layer
        });

        // should the coloring be done
        if (this.coloring_active){
            this.apply_coloring();
        }
    }

    apply_coloring(){
        // make the selected stations green and the other red
        this.coloring_active = true;
        let selected_stids = this.get_selected_stations();
        let period_start = this.get_period_start();
        let period_end = this.get_period_end();
        let kind = this.get_kind();

        //  create single filters
        let check_period_end = (layer) => {return true};
        if (period_end != null){
            if (["raw", "qc"].includes(kind)){
                check_period_end = (layer) => {
                    return (new Date(layer.feature.properties.raw_until) >= period_end);
                };
            } else {
                check_period_end = (layer) => {
                    return (new Date(layer.feature.properties.filled_until) >= period_end);
                };
            }
        }

        let check_period_start = (layer) => {return true};
        if (period_start != null){
            if (["raw", "qc"].includes(kind)){
                check_period_start = (layer) => {
                    return (new Date(layer.feature.properties.raw_from) <= period_start);
                };
            } else {
                check_period_start = (layer) => {
                    return (new Date(layer.feature.properties.filled_from) <= period_start);
                };
            }
        }

        this.lmarkers.getLayers().forEach((layer) => {
            if (selected_stids.includes(layer.feature.properties.pk)){
                if (check_period_start(layer)&& check_period_end(layer)){
                    layer.setIcon(new this.IconSelect);
                } else {
                    layer.setIcon(new this.IconSelectOutPeriod);
                }
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

    get_period_start(){
        return new Date(this.input_period_start.dom_input.value + "T00:00:00");
    }

    get_period_end(){
        return new Date(this.input_period_end.dom_input.value + "T23:50:00");
    }

    get_aggregation(){
        return this.input_aggregation.dom_input.value;
    }

    get_selected_stations(){
        let stids = this.input_stids.dom_input.value.split(",").map((el) => el.trim());
        if (stids.length == 1 & stids[0] == ""){
            return []
        } else {
            return stids
        }
    }

    get_kind(){
        return this.input_kind.get_value();
    }

    apply_filter(){
        let selected_stids = this.get_selected_stations();
        this.filtering_active = true;
        // let period_start = this.get_period_start();
        // let period_end = this.get_period_end();

        // this.lmarkers.clearLayers();
        // this.lmarkers.remove();

        //  create single filters
        // let filter_period_end = (feature) => {return true};
        // if (period_end != null){
        //     filter_period_end = (feature) => {
        //         return (new Date(feature.properties.filled_until) >= period_end);
        //     }
        // }

        // let filter_period_start = (feature) => {return true};
        // if (period_start != null){
        //     filter_period_start = (feature) => {
        //         return (new Date(feature.properties.filled_from) <= period_start);
        //     }
        // }

        let filter_stids = (feature) => {return false};
        if (selected_stids.length > 0){
            filter_stids = (feature) => {
                return selected_stids.includes(feature.properties.pk);
            }
        }

        // create filter of all together
        let filter = (feature) => {
            return filter_stids(feature);//&& filter_period_start(feature) && filter_period_end(feature);
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

    check_stations_input(){
        this.input_stids.make_valid();        
        this.form_dom.classList.add("was-validated");

        let in_text = this.input_stids.dom_input.value;
        if (in_text.length == 0) {
            this.input_stids.make_invalid(
                "You didn't select any station. Please enter a comma-seperated list of station IDs.");
            return false;
        } else {
            // check if input has right pattern
            if (!(/^\s*(\d{1,5})+(\s*[,;]{1}\s*\d{1,5})*[\s,;]*$/.test(in_text))){
                this.input_stids.make_invalid(
                    "The given list of stations is not in the right pattern.<br>The Station Ids must be provided as a comma or semmicolon seperated list of numbers.");
                return false;
            }
        }
        
        // check if given stids are in the meta file
        let in_stids = in_text.trim().replaceAll(";", ",").replaceAll(/[,\s]+$/gm, "").split(",").map((el) => el.trim());
        in_stids = Array.from(new Set(in_stids));
        let valid_stids = [];
        let invalid_stids = [];
        for (let stid of in_stids){
            if (this.station_ids.includes(stid)){
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
        if (this.get_selected_stations().length > this.max_downloads){
            this.input_stids.make_invalid(`You are only able to download ${this.max_downloads} stations at once. <br>If you want to download more stations please use the <a href='{% url 'package'%}'>Python package</a><br>or register for an account and make an E-mail to request a higher limit.`);
        }
        return this.input_stids.is_valid();
    }

    check_period(){
        this.input_period_end.make_valid();
        this.input_period_start.make_valid();
        // get max period of selected stids
        let selected_stids = this.get_selected_stations();
        let selected_stations = this.geojson_data.features.filter(
            (el)=>{
                return selected_stids.includes(el.properties.pk)
            });
        if (selected_stations.length >0 & ["filled", "best"].includes(this.input_kind.get_value())){
            let min_tstp;
            let max_tstp;
            selected_stations.forEach((feature)=>{
                if (min_tstp === undefined | feature.properties.filled_from < min_tstp){
                    min_tstp = feature.properties.filled_from;
                }
                if (max_tstp === undefined | feature.properties.filled_until > max_tstp){
                    max_tstp = feature.properties.filled_until;
                }
            });
            min_tstp = new Date(min_tstp);
            max_tstp = new Date(max_tstp.split("T")[0] + "T23:59:59");
            // check fields to be in the range
            let msg_invalid_period = `The date must be between ${min_tstp.toLocaleDateString()} and ${max_tstp.toLocaleDateString()} for the selected stations and data kind.`
            if (this.get_period_start()<min_tstp){
                this.input_period_start.make_invalid(msg_invalid_period)
            } 
            if (this.get_period_end()>max_tstp){
                this.input_period_end.make_invalid(msg_invalid_period)
            } 
        }
        
        return this.input_period_start.is_valid() & this.input_period_end.is_valid();
    }

    check_aggregation(skip_when_alerted=false){
        if (!skip_when_alerted & !this.agg_to_alerted){
            let alert_aggregations = ["10 min", "hour"];
            let alert_box = document.getElementById("agg_alert_box");
            if (alert_aggregations.includes(this.get_aggregation())){
                this.agg_to_alerted=true;
                alert_box.innerHTML = '<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">×</button><p class="mb-0">The temperature and evapotranspiration data are only downloaded as daily values.<br>Therefor only the Precipitation values will be in this frequency.</p></div></div>';
            } else {
                alert_box.innerHTML = "";
            }
        }
        return true;
    }

    check_add_filled_by(skip_when_alerted=false){
        if (!(skip_when_alerted & this.add_filled_by_alerted)){
            let add_filled_by = this.input_add_filled_by.dom_input.checked;
            let alert_box = document.getElementById("add_filled_by_alert_box");
            let kind = this.input_kind.get_value();
            if (add_filled_by){
                if (["raw", "qc"].includes(kind)){
                    alert_box.innerHTML =  '<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">×</button><p class="mb-0">The temperature and evapotranspiration data are only downloaded as daily values.<br>Therefor it is not possible to add a filling information.</p></div></div>';
                    this.add_filled_by_alerted = true;
                    return false;
                } else {
                    alert_box.innerHTML = "";
                }
            } else {
                alert_box.innerHTML = "";
                this.input_add_filled_by.dom_input.disabled = ["raw", "qc"].includes(kind);
            }
        }
        return true;
    }

    check_add_na_share(skip_when_alerted=false){
        if (!(skip_when_alerted & this.add_na_share_alerted)){
            let add_na_share = this.input_add_na_share.dom_input.checked;
            let alert_box = document.getElementById("add_na_share_alert_box")
            if (add_na_share){
                let agg_to = this.input_aggregation.get_value();
                let msg = "";
                if ("10 min" == agg_to){
                    msg = "You selected to download the data in 10 minutes resolution.<br>Therefor no column is added, as this column is only added, when the data gets aggregated."
                } else if ("day" == agg_to){
                    msg = "You selected to download the data in daily resolution.<br>Therefor no column is added for T and ET, as this column is only added, when the data gets aggregated."
                } 
                if (msg !=""){
                    alert_box.innerHTML =  `<div class="alert alert-dismissible alert-info"><button type="button" class="close" data-dismiss="alert">×</button><p class="mb-0">${msg}</p></div></div>`;
                    this.add_na_share_alerted = true;
                } else {
                    alert_box.innerHTML = "";
                }
            } else {
                alert_box.innerHTML = "";
            }
        }
        return true;
    }

    check_hcaptcha(is_submit=false){
        if (this.needs_captcha){
            // look for captcha input
            let dom_invalid_feedback = document.getElementById("invalid-feedback-hcaptcha");
            let dom_input = document.querySelector("div#hcaptcha_div");
            // check if captcha is done
            if (hcaptcha.getRespKey() != ""){
                if (is_submit & (this.captcha_active_since < new Date(Date.now()-(1000*60*10)))){ // reset after 10 minutes
                    hcaptcha.reset();
                    this.captcha_active_since = undefined;
                    dom_invalid_feedback.style.display = "block";
                    dom_invalid_feedback.innerHTML = "Your last HCaptcha test was more than 10 minutes ago. Please redo this hCaptcha test.";
                    dom_input.classList.add('border', 'border-danger');
                    return false;
                } else {
                    this.captcha_active_since = new Date();
                    dom_invalid_feedback.style.display = "none";
                    dom_invalid_feedback.innerHTML = "";
                    dom_input.classList.remove('border', 'border-danger');
                    return true;
                }
                
            } else {
                dom_invalid_feedback.style.display = "block";
                dom_invalid_feedback.innerHTML = "Please do this hCaptcha test!";
                dom_input.classList.add('border', 'border-danger');
                return false;
            }
        } else {
            return true;
        }
    }

    check_form(){
        this.form_dom.classList.add("was-validated");
        return (this.check_stations_input() & this.check_period() & this.check_aggregation(true) & this.check_add_na_share(true) & this.check_add_filled_by(true) & this.check_hcaptcha(true));
    }

    select_station(stid){
        if (this.check_stid(stid)){
            let selected_stids = this.get_selected_stations();
            if (selected_stids.length>0){
                this.input_stids.dom_input.value += ", " + stid;
            } else {
                this.input_stids.dom_input.value += stid;
            } 
            this.input_stids.dom_input.dispatchEvent(new Event('change'));
        } else {
            console.log(`The station id ${stid} is not a valid ID`);
        }
        this.check_stations_input();
    }

    unselect_station(stid){
        let selected_stids = this.get_selected_stations();
        if (selected_stids.includes(stid)){
            selected_stids.pop(stid);
            this.input_stids.dom_input.value = ", ".join(selected_stids); 
        }
    }

    check_stid(stid){
        return this.station_ids.includes(String(stid));
    }
}


const form = new Form();

// button functions
// let check_stations_input = function(event){
//     event.stopPropagation();
//     form.check_stations_input()
// }
// form.input_stids.addEventListener("change", check_stations_input)
// document.querySelector("form[name=download_ts]").addEventListener("submit", (event) => {
//     form.check_stations_input()
//     form.input_stids.blur()
// })

let button_select_station = (stid, event) => {
    if (event.target.innerText == "select") {
        form.select_station(stid);
        event.target.innerText = "unselect";
    } else {
        form.unselect_station(stid);
        event.target.innerText = "select";
    }
}

form.addEventListeners()