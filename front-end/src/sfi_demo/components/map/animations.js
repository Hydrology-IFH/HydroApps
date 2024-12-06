import { getCenter } from 'ol/extent';

// function to fly to a given extent
export async function flyToExtent(map, location, callback, duration = 3000) {

  const view = await map.getView();
  const zoom = view.getZoom();

  // animations
  view.animate(
    {
      center: location,
      duration: duration,
    }
  );
  view.animate(
    {
      zoom: zoom - 3,
      duration: duration/2,
    },
    {
      zoom: zoom,
      duration: duration/2,
    }
  );

  // callback
  setTimeout(() => {
    callback();
  }, duration);
}