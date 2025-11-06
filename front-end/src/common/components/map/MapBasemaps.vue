<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { OlTileLayer } from 'vue3-openlayers/layers';
  import { OlSourceTileWMS, OlSourceOSM } from 'vue3-openlayers/sources';
  import { OlLayerSwitcherImageControl } from "vue3-openlayers/controls";

  import { transform } from 'ol/proj';

  const props = defineProps({
    projection: { // as "EPSG: number"
      type: String || Object,
      default: () => 'EPSG:3857',
    },
    layers: {
      // Array of layer names to be displayed, the first one is the default visible layer
      type: Array,
      default: () => ["OSM", "basemap.de grau", "basemap.de farbe"],
      validate: (value) => {
        return Array.isArray(value) && value.every(item => ["OSM", "basemap.de grau", "basemap.de farbe"].includes(item));
      }
    }
  });

  // DOM references to the layers
  const osmLayer = ref(null);
  const bsmpGreyLayer = ref(null);
  const bsmpColorLayer = ref(null);

  const layerRefs = computed(() => {
    return [osmLayer, bsmpGreyLayer, bsmpColorLayer].filter(layer => layer.value !== null);
  });

  // Computed property to determine if the basemap menu should be shown
  const showBasemapMenu = computed(() => {
    return layerRefs.value.length > 1;
  });

  // Function to show only the basemap layers in the layer switcher
  const showBasemapLayer = (layer) => {
    return layer.values_.baseLayer
  }

  onMounted(() => {
    // replace the getPreview method of the tileLayer to handle actual map center instead of fixed values
    for (let layer of layerRefs.value) {
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
    v-if="layers.includes('basemap.de grau')"
    ref="bsmpGreyLayer"
    title="Grau basemap.de"
    :visible="layers[0] === 'basemap.de grau'"
    :base-layer="true"
  >
    <OlSourceTileWMS
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions="© GeoBasis-DE  <a href=&quot;https://www.bkg.bund.de&quot; target=&quot;_blank&quot;>BKG</a>  <a href=&quot;https://creativecommons.org/licenses/by/4.0/&quot; target=&quot;_blank&quot;>CC BY 4.0</a>"
      layers="de_basemapde_web_raster_grau"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': projection, 'SERVICE': 'WMS'}"
      :projection="projection"
      cross-origin=""
    />
  </OlTileLayer>

  <OlTileLayer
    v-if="layers.includes('basemap.de farbe')"
    ref="bsmpColorLayer"
    title="Color basemap.de"
    :visible="layers[0] === 'basemap.de farbe'"
    :base-layer="true"
  >
    <OlSourceTileWMS
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions="© GeoBasis-DE  <a href=&quot;https://www.bkg.bund.de&quot; target=&quot;_blank&quot;>BKG</a>  <a href=&quot;https://creativecommons.org/licenses/by/4.0/&quot; target=&quot;_blank&quot;>CC BY 4.0</a>"
      layers="de_basemapde_web_raster_farbe"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': projection, 'SERVICE': 'WMS'}"
      :projection="projection"
      cross-origin=""
    />
  </OlTileLayer>

  <OlTileLayer
    v-if="layers.includes('OSM')"
    ref="osmLayer"
    title="OSM"
    :visible="layers[0] === 'OSM'"
    :base-layer="true"
  >
    <OlSourceOSM />
  </OlTileLayer>

  <OlLayerSwitcherImageControl
    v-if="showBasemapMenu"
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