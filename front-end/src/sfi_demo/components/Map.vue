<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";

  import MapHoverOverlay from "~~/components/MapHoverOverlay.vue";
  import ErrorFrame from '~~/components/ErrorFrame.vue';
  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~/stores/layerLib.js';
  import "./map/projections";
  import Basemaps from './map/Basemaps.vue';
  import MapLegend from "./map/MapLegend.vue";
  import RegionSelection from './map/RegionSelection.vue';
  import { flyToExtent } from "./map/animations";
  import { regions } from "./map/regions";

  const config = useConfig();
  const layerLib = useLayerLib();
  const mapRef = ref(null);
  const map = ref(null);
  const last_region = ref(config.region)
  const extent = ref(undefined);//ref(regions[config.region].extent)
  const center = ref(regions[config.region].center)

  const layer = computed(() => layerLib.selectedLayer)
  const layerError = computed(() => {
    return layer.value ? layer.value.hasError : false
  })

  // change map extent on region change
  config.$subscribe((mutation, state) => {
    if (state.region !== last_region.value) {
      extent.value = undefined;
      let new_center = regions[state.region].center;

      flyToExtent(map.value, new_center, () => {
          extent.value = regions[state.region].extent;
          center.value = new_center;
        },
        3000)
      last_region.value = state.region;
    }
  })

  // initiate the map
  onMounted(() => {
    layerLib.initMap(mapRef.value.map)
    layerLib.selectLayer("SFI")
    map.value = mapRef.value?.map;
  })

  // for debugging
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
        zoom="13"
        :extent="extent"
        :center="center"
        projection="EPSG:25832" />

        <Basemaps/>
        <RegionSelection/>
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
