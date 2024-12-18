export const minZoom = function (map, extent) {
  let view = map.getView();
  return view.getZoomForResolution(
    view.getResolutionForExtent(
      extent,
      map.getSize()
    )
  )
}