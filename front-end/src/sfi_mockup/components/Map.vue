<script setup>
  import { ref, onMounted, watchEffect } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";
  import { getCenter } from 'ol/extent';

  import "./utils/projections";
  import { useConfig } from '../stores/config';
  import Basemaps from './utils/Basemaps.vue';

  const config = useConfig();
  const extent = ref([ 441576.5, 5290318.5, 456351.5, 5300468.5 ]);
  const center = ref(getCenter(extent.value))
  const mapRef = ref(null);

  onMounted(() => {
    config.layerLib.initMap(mapRef.value.map)
    config.layerLib.selectLayer("SFI")

    watchEffect(() => {
      config.layerLib.setOpacity(config.opacity)
    })
  })
</script>

<template>
  <Map.OlMap id="map" ref="mapRef">
    <Map.OlView
      :center="center" zoom="13"
      :extent="extent"
      projection="EPSG:25832" />

      <Basemaps/>

    <MapControls.OlFullscreenControl />
  </Map.OlMap>
</template>

<style>
  #map {
    position: relative;
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    #map {
      /* 100% - navbar - footer - flowchart*/
      height: calc(100vh - 165px - .5em - 100px);
    }
  }
  @media screen and (min-width: 768px){
    #map {
      /* 100% - navbar - h1 - flowchart - body_bottom */
      height: calc(100vh - 165px - .5em - 1.2*2.5em - 100px - 2em);
    }
  }
  .zoom-container.zoom-active #map{
    /* 100vh - 2 * margin+padding of fullscreeen - flowchart*/
    height: calc(100vh - 2*20px - 100px)
  }
</style>