<script setup>
  import { ref, onMounted } from 'vue';
  import { OlTileLayer } from "vue3-openlayers/layers";
  import { OlSourceTileWMS, OlSourceOSM } from "vue3-openlayers/sources";
  import { OlLayerSwitcherImageControl } from "vue3-openlayers/controls";
  import { transform } from 'ol/proj';

  import "./projections";

  // DOM references to the layers
  const osmLayer = ref(null);
  const bsmpGreyLayer = ref(null);
  const bsmpColorLayer = ref(null);

  // Function to show only the basemap layers in the layer switcher
  const showBasemapLayer = (layer) => {
    return layer.values_.baseLayer
  }

  onMounted(() => {
    for (let layer of [bsmpGreyLayer, bsmpColorLayer, osmLayer]) {
      // replace the getPreview method of the tileLayer to handle actual map center instead of fixed values
      layer.value.tileLayer.getPreview_ = layer.value.tileLayer.getPreview;
      layer.value.tileLayer.getPreview = function(lonlat, resolution) {
        let mapView = this.getMapInternal().getView()
        lonlat = lonlat || mapView.getCenter()
        resolution = resolution || mapView.getResolution()

        // If the map and layer projections are different, transform the coordinates and resolution
        let mapProj = mapView.getProjection()
        let layerProj = this.getSource().getProjection()
        if (mapProj.getCode() != layerProj.getCode()){
          // Transform the map central point to the layer projection
          let point1 = lonlat
          let transformedPoint1 = transform(lonlat, mapProj, layerProj)

          // Transform a second point, one resolution unit to the right
          let point2 = [point1[0] + resolution, point1[1] + resolution];
          let transformedPoint2 = transform(point2, mapProj, layerProj);

          // Calculate the new resolution as the distance between the transformed points
          let dx = transformedPoint2[0] - transformedPoint1[0];
          let dy = transformedPoint2[1] - transformedPoint1[1];
          resolution = Math.sqrt(dx * dx + dy * dy);

          lonlat = transformedPoint1
          }
        return this.getPreview_(lonlat, resolution)
      }
    }
  })
</script>

<template>
  <OlTileLayer
    ref="bsmpGreyLayer"
    title="Grau basemap.de"
    :visible="true"
    :base-layer="true"
  >
    <OlSourceTileWMS
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions="© GeoBasis-DE  <a href=&quot;https://www.bkg.bund.de&quot; target=&quot;_blank&quot;>BKG</a>  <a href=&quot;https://creativecommons.org/licenses/by/4.0/&quot; target=&quot;_blank&quot;>CC BY 4.0</a>"
      layers="de_basemapde_web_raster_grau"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': 'EPSG:25832', 'SERVICE': 'WMS'}"
      projection="EPSG:25832"
      cross-origin=""
    />
  </OlTileLayer>

  <OlTileLayer
    ref="bsmpColorLayer"
    title="Color basemap.de"
    :visible="false"
    :base-layer="true"
  >
    <OlSourceTileWMS
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions="© GeoBasis-DE  <a href=&quot;https://www.bkg.bund.de&quot; target=&quot;_blank&quot;>BKG</a>  <a href=&quot;https://creativecommons.org/licenses/by/4.0/&quot; target=&quot;_blank&quot;>CC BY 4.0</a>"
      layers="de_basemapde_web_raster_farbe"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': 'EPSG:25832', 'SERVICE': 'WMS'}"
      projection="EPSG:25832"
      cross-origin=""
    />
  </OlTileLayer>

  <OlTileLayer
    ref="osmLayer"
    title="OSM"
    :visible="false"
    :base-layer="true"
  >
    <OlSourceOSM />
  </OlTileLayer>

  <OlLayerSwitcherImageControl
    :mouseover="true"
    :display-in-layer-switcher="showBasemapLayer"
  />
</template>

<style>
  .ol-layerswitcher-image:not(.ol-collapsed) {
    top: 2.5em;
  }
  .ol-layerswitcher-image li.ol-visible{
    opacity: 1!important;
    border-color: red!important;;
  }
  .ol-layerswitcher-image li{
    border-color: #FFF;
    opacity: 0.9;
  }
  .ol-layerswitcher-image li.ol-layer-hidden{
    opacity: 0.9;
    border-color: #FFF;
  }
</style>