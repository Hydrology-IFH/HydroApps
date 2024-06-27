<script setup>
  import { ref } from 'vue';
  import { Layers, Sources, MapControls } from "vue3-openlayers";

  import "./projections";

  const osmLayer = ref(null);
  const bsmpGreyLayer = ref(null);
  const bsmpColorLayer = ref(null);

  const showBasemapLayer = (layer) => {
    return layer.values_.baseLayer
  }
</script>

<template>

  <Layers.OlTileLayer
      ref="bsmpGreyLayer"
      title="Grau basemap.de"
      :visible="true"
      :baseLayer="true" >
    <Sources.OlSourceTileWms
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions='© GeoBasis-DE  <a href="https://www.bkg.bund.de" target="_blank">BKG</a>  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>'
      layers="de_basemapde_web_raster_grau"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': 'EPSG:25832', 'SERVICE': 'WMS'}"
      projection="EPSG:25832"
      crossOrigin=""/>
  </Layers.OlTileLayer>

  <Layers.OlTileLayer
      ref="bsmpColorLayer"
      title="Color basemap.de"
      :visible="false"
      :baseLayer="true" >
    <Sources.OlSourceTileWms
      url="https://sgx.geodatenzentrum.de/wms_basemapde"
      attributions='© GeoBasis-DE  <a href="https://www.bkg.bund.de" target="_blank">BKG</a>  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>'
      layers="de_basemapde_web_raster_farbe"
      :params="{'TILED': false, 'FORMAT': 'image/png', 'VERSION': '1.3.0', 'CRS': 'EPSG:25832', 'SERVICE': 'WMS'}"
      projection="EPSG:25832"
      crossOrigin=""/>
  </Layers.OlTileLayer>

  <Layers.OlTileLayer
      ref="osmLayer"
      title="OSM"
      :visible="false"
      :baseLayer="true">
    <Sources.OlSourceOsm />
  </Layers.OlTileLayer>

  <MapControls.OlLayerswitcherimageControl
      :mouseover="true"
      :displayInLayerSwitcher="showBasemapLayer" />
</template>