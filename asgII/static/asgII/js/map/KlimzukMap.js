import {InputField} from './InputField.js'

class KlimZukMap{
  constructor(){
      this.get_stations_meta()

      // input fields
      this.input_stids = new InputField("station_ids", "textarea");
      this.input_period = new InputField("period", "select");
      this.input_para =  new InputField("parameter", "select");

      // buttons
      this.buttons = {
          colapse_card_map: document.getElementById("btn_collapse_accordion_map"),
          colapse_card_manualy: document.getElementById("btn_collapse_accordion_manualy"),

          color_selection: document.getElementById("btn_color_selection"),
          remove_coloring: document.getElementById("btn_remove_coloring"),
          filter_stations: document.getElementById("btn_filter_stations"),
          remove_filter: document.getElementById("btn_remove_filter"),
          add_plots: document.getElementById("btn_add_plots")
      }

      // icons
      L.Icon.Default.prototype.options.imagePath = location.origin;
      L.Icon.Default.prototype.options.shadowUrl = "/static/img/Leaflet-Marker-shadow.png"; 
      this.IconDefault = L.Icon.Default.extend(
          {options:{iconUrl:"/static/img/marker-icon-blue.png"}});
      this.IconUnselect = L.Icon.Default.extend(
          {options:{iconUrl:"/static/img/marker-icon-red.png"}});
      this.IconSelect = L.Icon.Default.extend(
          {options:{iconUrl:"/static/img/marker-icon-green.png"}});

      // set variables
      this.coloring_active = false;
      this.filtering_active = false;

      //  set legend element
      this.legend = new (L.Control.extend({
          onAdd: (map)=>{
              let div = L.DomUtil.create('div', 'legend container-fluid');
              div.innerHTML = "<h3>Legend</h3>"
              let icons = [this.IconSelect, this.IconUnselect]
              let names = ["selected", "not select"];
              for (let i=0; i <2; i++){
                  let row = L.DomUtil.create('div', "row justify-content-right");
                  let col_icon = L.DomUtil.create('div', "col-auto pr-0");
                  let icon_img = (new icons[i]).createIcon();
                  icon_img.style="";
                  icon_img.classList += "img-fluid";
                  col_icon.appendChild(icon_img);
                  row.appendChild(col_icon);
                  let col_text = L.DomUtil.create('div', "col");
                  col_text.innerHTML += `<b>${names[i]}</b>` ;
                  row.appendChild(col_text);
                  div.appendChild(row);
              }
              return div;
          }
      }))

      // create map
      this.create_basemap()
      this.load_stations_to_map()

      // initialize the station_data
      this.station_data = {}
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
              form.buttons.filter_stations.textContent = "Filter Selection on map";
              event.target.classList.add("invisible");
          });
      this.buttons.add_plots.addEventListener(
          "click",
          (event) => {
              this.add_plots();
              event.target.value = "add new plots";
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
  
  get_stations_meta(){           
      this.stations_meta = JSON.parse(
          document.getElementById("stations_meta").textContent);
      this.station_ids = [];
      for (let feature of this.stations_meta.features){
          this.station_ids.push(feature.properties.pk);
      }
  }

  get_station_data(stat_id){
      if (stat_id in this.station_data){
          return this.station_data[stat_id]
      } else {
          $.ajax
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
          this.stations_meta,
          {filter: filter}));
      this.lmarkers = this.lmarkers.bindPopup(
          (layer) => {
              let props = layer.feature.properties;
              let stid = layer.feature.properties.pk;
              let str_select = this.is_selected(stid)?"unselect":"select";
              let str = `<div class="container gx-0 pb-2" id="popup_stid_${stid}">\
                  <h6 style="float: left">${stid}</h6><br>\
                  <table>\
                  <tr><td><b>Name:</b></td><td> ${props.name}</td><br>\
                  <tr><td><b>Betreiber:</b></td><td> ${props.operator}</td>\
                  </tr></table></div>\
                  <div class="container gx-0"><div class="row justify-content-center"><div class="col">\
                      <button class="btn btn-primary rm-3" onclick="klimzukmap.${str_select}_station('${stid}')" \
                          data-toggle="tooltip" data-placement="top" data-container="body" data-trigger="hover"\
                          title="Add this station to the selected stations list on the right">${str_select}</button></div><div class="col gx-0">\
                      <a class="btn btn-primary" href="/static/PDF/A4_Ann_Trends_${stid}.pdf" download style="color:#FFFFFF" \
                          data-toggle="tooltip" data-placement="top" data-container="body" data-trigger="hover" \
                          title="Download all the plots for this station as PDF."><i class="bi bi-download"></i></a>\
                  </div></div></div>`
              return str
          }
      )
      this.lmarkers.on('click', ()=>{$('.leaflet-popup-content [data-toggle="tooltip"]').tooltip();})
      this.lmarkers.getLayers().forEach((layer) => {
          layer.setIcon(new this.IconDefault);
      })

      this.lmarkers.addTo(this.map);

      // fit map boundaries
      if (this.lmarkers.getLayers().length > 1){
          this.map.fitBounds(this.lmarkers.getBounds(), { padding: [1, 1] });
      } else if (this.lmarkers.getLayers().length == 1){

          let markerBounds = L.latLngBounds([this.lmarkers.getLayers()[0].getLatLng()]);
          this.map.fitBounds(markerBounds.pad(2), { padding: [1, 1] });
      }

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

  add_plot(stid, para=this.get_para(), period=this.get_period()){
      if (!plotAreaApp.plots_data.some(el=>{return (el.station_id == stid) && (el.para == para) && (el.period == period)})){
          plotAreaApp.plots_data.push({
              station_id: stid, 
              para: para, 
              period: period})
      }        
  }

  add_plots(){
      let para = this.get_para();
      let period = this.get_period();
      this.get_selected_stations().forEach((stid) =>{
          this.add_plot(stid=stid, para=para, period=period)})
  }

  get_selected_stations(){
      let stids = this.input_stids.get_value().split(",").map((el) => el.trim());
      if (stids.length == 1 & stids[0] == ""){
          return []
      } else {
          return stids
      }
  }

  get_period(){
      return this.input_period.get_value();
  }

  get_para(){
      return this.input_para.get_value();
  }

  is_selected(stid){
      return stid in this.get_selected_stations()
  }

  select_station(stid){
      if (this.check_stid(stid) && !this.get_selected_stations().includes(stid)){
          if (this.input_stids.get_value().length == 0){
              this.input_stids.dom_input.value = stid; 
          } else {
              this.input_stids.dom_input.value += ", " + stid;
          }            
      }
  }

  unselect_station(stid){
      let selected_stids = this.get_selected_stations()
      if (selected_stids.includes(stid)){
          selected_stids.remove(stid);
          this.input_stids.dom_input.value = ", ".join(selected_stids); 
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
          if (!(/^\s*\w+_(\d{1,5})\s*([,;]{1}\s*\w+_\d{1,5})*[\s,;]$/.test(in_text))){
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

export {KlimZukMap}