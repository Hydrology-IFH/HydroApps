<script setup>
  import { ref, onMounted, watchEffect, computed } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";
  import { getCenter } from 'ol/extent';

  import "./utils/projections";
  import { useConfig } from '../stores/config';
  import Basemaps from './utils/Basemaps.vue';

  const config = useConfig();
  const extent = ref([440776.5, 5289518.5, 457136.5, 5301268.5]);
  const center = ref(getCenter(extent.value))

</script>

<template>
  <Map.OlMap id="map">
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
      /* 100% - navbar - footer*/
      height: calc(100vh - 165px - .5em);
    }
  }
  @media screen and (min-width: 1200px){
    #map {
      /* 100% - navbar - h1 - body_bottom */
      height: calc(100vh - 165px - .5em - 1.2*2.5em - 2em);
    }
  }
  .zoom-container.zoom-active #map{
    /* 100vh - 2 * margin+padding of fullscreeen */
    height: calc(100vh - 2*20px)
  }
</style>