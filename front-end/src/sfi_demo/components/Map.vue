<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";
  import { getCenter } from 'ol/extent';

  import MapHoverOverlay from "~~/components/MapHoverOverlay.vue";
  import ErrorFrame from '~~/components/ErrorFrame.vue';
  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~/stores/layerLib.js';
  import "./map/projections";
  import Basemaps from './map/Basemaps.vue';
  import MapLegend from "./map/MapLegend.vue";

  const config = useConfig();
  const layerLib = useLayerLib();
  const extents = {
    Bonndorf: [441576.5, 5290318.5, 456351.5, 5300468.5],
    Wieslauf: [536286.5, 5406178.5, 545986.5, 5420628.5]
  }
  const mapRef = ref(null);
  const map = ref(null);

  const extent = computed(() => extents[config.region])
  const center = computed(() => getCenter(extent.value))
  const layer = computed(() => layerLib.selectedLayer)
  const layerError = computed(() => {
    return layer.value ? layer.value.hasError : false
  })

  onMounted(() => {
    layerLib.initMap(mapRef.value.map)
    layerLib.selectLayer("SFI")
    map.value = mapRef.value?.map;
  })

  if (import.meta.env !== undefined) {
    window.map = map;
    window.layer = layer;
    window.layerLib = layerLib;
    window.config = config;
  }
</script>

<template>
  <div class="map-container">
    <Map.OlMap id="map" ref="mapRef">
      <Map.OlView
        :center="center" zoom="13"
        :extent="extent"
        projection="EPSG:25832" />

        <Basemaps/>
        <MapHoverOverlay
            v-if="map != null && layer != null"
            :map="map"
            :layer="layer.olLayer"
            :unit="layer.unit"
            :decimals="layer.decimals"
            :valueConverter="layer.valueConverter"/>
        <MapLegend
            v-if="map != null && layer != null"
            :map="map"
            :layerName="layer.name"
            :style="layer.style"
            :unit="layer.unit"/>

      <MapControls.OlFullscreenControl />

    </Map.OlMap>
    <ErrorFrame v-if="layerError" class="map-error" :header="$t('map_error_header')" :msg="$t('map_error_msg')"/>
  </div>

</template>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
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
  /* loading spinner */
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .ol-map-loading:after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 5px solid rgba(180, 180, 180, 0.6);
    border-top-color: rgba(0, 0, 0, 0.6);
    animation: spinner 0.6s linear infinite;
  }
</style>
