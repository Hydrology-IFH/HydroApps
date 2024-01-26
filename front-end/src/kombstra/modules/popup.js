import Overlay from 'ol/Overlay.js';
import { map } from './map.js';
import { toggle_hover } from './hover.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { GeoJSON } from 'ol/format.js';
import proj4 from 'proj4';
import { createApp } from 'vue';
import PopupContent from './PopupContent.vue';
// import { cell_data } from './PopupContent.vue';
import { grid_id } from './PopupContent.vue';
import { getCenter, containsCoordinate } from 'ol/extent.js';

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
        'stroke-width': 4,
    },
    zIndex: 9,
});

// create PopupContent component
let popupApp = createApp(PopupContent);
let popupAppInst = popupApp.mount(content);

function set_overlay_position() {
    let ext = popup_cell_source.getExtent();
    overlay.setPosition([(ext[0] + ext[2])/2, ext[3]]);
};

// get kombstra data from api
function update_kombstra_data(long, lat) {
    fetch("/kombstra/api/kombstra_polygon/?long=" + long + "&lat=" + lat)
        .then((res) => res.json())
        .then((data) => {
            popup_cell_source.addFeatures(
                new GeoJSON().readFeatures(data[0].geometry, {
                    dataProjection: "SR-ORG:97019",
                    featureProjection: "SR-ORG:97019",
                }));
            grid_id.value = data[0].grid_id;
            set_overlay_position();
        })
        .catch((err) => {
            console.log(err);
            popupAppInst.set_error_msg("We are sorry, there was an error finding the data for this location.");
        });
}

function remove_popup_cell_layer() {
    popup_cell_source.clear();
}

// create popup and add to map
export function create_popup() {
    // pointermove handler to remove the popup when focus outside map
    let map_view = map.getView();
    function dragging_listener(evt){
        let cell_extent = getCenter(popup_cell_source.getExtent());
        let view_extent = map_view.getViewStateAndExtent().extent;
        if (!containsCoordinate(view_extent, cell_extent)) {
            overlay.setPosition(undefined);
        } else {
            set_overlay_position();
        }
    }
    function add_dragging_handler() {
        map.on('pointerdrag', dragging_listener)
    };
    function remove_dragging_handler() {
        map.un('pointerdrag', dragging_listener)
    };

    //  add popup to map
    map.addOverlay(overlay);
    map.addLayer(popup_cell_layer);
    container.style.visibility = 'visible';

    // add a click handler to hide the popup.
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        toggle_hover(true);
        remove_popup_cell_layer();
        remove_dragging_handler();
        return false;
    };

    // Add a click handler to the map to render the popup.
    map.on('singleclick', function (evt) {
        toggle_hover(false);

        let coordinate = evt.coordinate;
        let cell_features = popup_cell_source.getFeatures();
        if (!((cell_features.length > 0) && cell_features[0].getGeometry().containsXY(...coordinate))) {
            remove_popup_cell_layer();
            update_kombstra_data(coordinate[0], coordinate[1]);
        }

        add_dragging_handler();
    });
}