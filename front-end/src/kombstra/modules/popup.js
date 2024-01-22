import Overlay from 'ol/Overlay.js';
import { map } from './map.js';
import { toggle_hover } from './hover.js';
// import Polygon from 'ol/geom/Polygon.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { GeoJSON } from 'ol/format.js';
import proj4 from 'proj4';
import { defineComponent, createApp, ref } from 'vue';
import PopupContent from './PopupContent.vue';
import { cell_data } from './PopupContent.vue';

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
        },
    },
});

const popup_cell_source = new VectorSource({});
const popup_cell_layer = new VectorLayer({
    source: popup_cell_source,
    map: map,
    style: {
        'stroke-color': 'rgba(225, 0, 255, 1)',
        'stroke-width': 2,
    },
    zIndex: 1000,
});

// create PopupContent component
createApp(PopupContent).mount(content);

function get_kombstra_data(long, lat) {
    console.log(long,lat);
    fetch("/kombstra/api/kombstra_polygon/?long=" + long + "&lat=" + lat)
        .then((res) => res.json())
        .then((data) => {
            popup_cell_source.addFeatures(
                new GeoJSON().readFeatures(data[0].geometry, {
                    dataProjection: "EPSG:4326",
                    featureProjection: "SR-ORG:97019",
                })
            );
            return data[0].grid_id;
        })
        .then((grid_id) => {
            fetch("/kombstra/api/kombstra_data_all/?grid_id=" + grid_id)
                .then((res) => res.json())
                .then((data) => {cell_data.value.push(...data)})
        })
}

function remove_popup_cell_layer() {
    popup_cell_source.clear();
    cell_data.value.length = 0;
}


export function create_popup() {
    map.addOverlay(overlay);
    map.addLayer(popup_cell_layer);
    container.style.visibility = 'visible';

    // add a click handler to hide the popup.
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        toggle_hover(true);
        remove_popup_cell_layer();
        return false;
    };

    // Add a click handler to the map to render the popup.
    map.on('singleclick', function (evt) {
        toggle_hover(false);
        remove_popup_cell_layer();

        const coordinate = evt.coordinate;
        const coordinate_wgs84 = proj4("SR-ORG:97019", "EPSG:4326", coordinate);
        get_kombstra_data(coordinate_wgs84[0], coordinate_wgs84[1]);
        overlay.setPosition(coordinate);
    });

}