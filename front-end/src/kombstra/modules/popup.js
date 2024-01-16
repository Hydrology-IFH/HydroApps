import Overlay from 'ol/Overlay.js';
import { map } from './map.js';
import { toggle_hover } from './hover.js';

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


export function create_popup() {
    map.addOverlay(overlay);

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        toggle_hover(true);
        return false;
    };

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function (evt) {
        toggle_hover(false);
        const coordinate = evt.coordinate;

        content.innerHTML = '<p>You clicked here:</p><code>';
        overlay.setPosition(coordinate);
    });

}