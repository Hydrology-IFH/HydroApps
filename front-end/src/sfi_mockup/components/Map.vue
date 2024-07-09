<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";
  import { getCenter } from 'ol/extent';

  import { useConfig } from '~/stores/config.js';
  import "./map/projections";
  import Basemaps from './map/Basemaps.vue';
  import MapHoverOverlay from "~~/components/MapHoverOverlay.vue";
  import MapLegend from "./map/MapLegend.vue";

  const config = useConfig();
  const extent = ref([ 441576.5, 5290318.5, 456351.5, 5300468.5 ]);
  const center = ref(getCenter(extent.value))
  const mapRef = ref(null);
  const map = ref(null);
  const layer = computed(() => config.layerLib.selectedLayer)

  onMounted(() => {
    config.layerLib.initMap(mapRef.value.map)
    config.layerLib.selectLayer("SFI")
    map.value = mapRef.value.map;
  })
</script>

<template>
  <Map.OlMap id="map" ref="mapRef">
    <Map.OlView
      :center="center" zoom="13"
      :extent="extent"
      projection="EPSG:25832" />

      <Basemaps/>
      <MapHover/>
      <MapHoverOverlay
          v-if="map != null && layer != null"
          :map="map"
          :layer="layer.olLayer"
          :unit="layer.unit"
          :decimals="layer.decimals"/>
      <MapLegend
          v-if="map != null && layer != null"
          :map="map"
          :layer_name="layer.name"
          :style="layer.style"
          :unit="layer.unit"/>

    <MapControls.OlFullscreenControl />
  </Map.OlMap>
</template>

<style>
  #map {
    position: relative;
    width: 100%;
    min-height: min(80vh, 100%, max(70vh, 400px));
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