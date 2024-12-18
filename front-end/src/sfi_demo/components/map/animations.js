import { getCenter, boundingExtent, containsExtent } from 'ol/extent';
import { inAndOut } from 'ol/easing';


function getFittedViewExtent(viewSize, targetExtent) {
  const [minX, minY, maxX, maxY] = targetExtent;

  // Calculate target extent width and height
  const targetWidth = maxX - minX;
  const targetHeight = maxY - minY;
  const targetAspect = targetWidth / targetHeight;

  // Map's view size (in pixels)
  const [viewWidth, viewHeight] = viewSize;
  const viewAspect = viewWidth / viewHeight;

  // Determine extent that fits view aspect ratio inside target extent
  let fittedExtent;
  if (viewAspect > targetAspect) {
    // Limited by width (map view is "wider" than target)
    const fittedHeight = targetWidth / viewAspect;
    const yOffset = (targetHeight - fittedHeight) / 2;
    fittedExtent = [minX, minY + yOffset, maxX, maxY - yOffset];
  } else {
    // Limited by height (map view is "taller" than target)
    const fittedWidth = targetHeight * viewAspect;
    const xOffset = (targetWidth - fittedWidth) / 2;
    fittedExtent = [minX + xOffset, minY, maxX - xOffset, maxY];
  }

  return fittedExtent;
}

// function to fly to a given extent
export async function flyTo(map, {center, extent, zoom}, callback, duration = 3000) {
  const view = await map.getView();
  const pre_zoom = view.getZoom();
  const size = map.getSize();
  const pre_extent = view.calculateExtent(size);

  //  get extent
  if (extent === undefined) {
    if (center !== undefined && center instanceof Array && center.length == 2 && zoom !== undefined) {
      // get extent for center and zoom
      let res = view.getResolutionForZoom(zoom);
      let halfWidth = (size[0] * res) / 2;
      let halfHeight = (size[1] * res) / 2;

      // Calculate the extent
      extent = [
        center[0] - halfWidth, // minX
        center[1] - halfHeight, // minY
        center[0] + halfWidth, // maxX
        center[1] + halfHeight // maxY
      ];
    } else {
      console.error("either center and zoom or extent must be provided");
    }
  }
  extent = getFittedViewExtent(size, extent);

  // get center
  if (center === undefined) {
    if (extent !== undefined && extent instanceof Array && extent.length == 4) {
      // get center of extent
      center = getCenter(extent);
    } else {
      // get current center
      center = view.getCenter();
    }
  }

  // get zoom
  if (zoom === undefined) {
    if (extent !== undefined && extent instanceof Array && extent.length == 4) {
      // get zoom for extent
      zoom = view.getZoomForResolution(view.getResolutionForExtent(extent, size));
    } else {
      zoom = pre_zoom;
    }
  }
  var resolution = view.getResolutionForZoom(zoom);

  //  get total extent
  var total_extent = boundingExtent([pre_extent, extent]);
  var total_zoom = view.getZoomForResolution(view.getResolutionForExtent(total_extent, size));
  var total_resolution = view.getResolutionForZoom(total_zoom);

  // animations
  view.animate(
    {
      center: center,
      duration: duration ,
      easing: inAndOut,
    }
  );
  if (containsExtent(pre_extent, extent) || containsExtent(extent, pre_extent)) {
    // zoom in
    view.animate(
      {
        resolution: resolution,
        duration: duration,
        easing: inAndOut,
      }
    );
  } else {
    // zoom out and in
    view.animate(
      {
        // zoom: total_zoom,
        resolution: total_resolution,
        duration: duration / 2,
        easing: inAndOut,
      },
      {
        // zoom: zoom,
        resolution: resolution,
        duration: duration / 2,
        easing: inAndOut,
      }
    );
  }

  // callback
  setTimeout(() => {
    callback();
  }, duration);
}