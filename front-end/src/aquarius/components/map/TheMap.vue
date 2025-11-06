<script setup>
  import { ref } from 'vue';
  import { OlMap, OlView } from 'vue3-openlayers/map';
  import { OlFullScreenControl } from 'vue3-openlayers/controls';

  import MapBasemaps from '~~/components/map/MapBasemaps.vue';
  import TheLocationsLayer from './TheLocationsLayer.vue';

  // setup
  const mapRef = ref(null);

  // define view
  const view = ref(null)
  const fitViewToLocations = (locationLayer) => {
    view.value.fit(
      locationLayer.vectorLayer.getSource().getExtent(),
    {
      padding: [20, 20, 20, 20], // optional padding around the extent
    });
  }

  // for debugging
  if (import.meta.env === "development") {
    window.view = view;
    window.mapRef = mapRef;
    // provide("ol-options", {debug: true,});
  }
</script>

<template>
  <div
    class="map-container"
    @wheel="(event) => event.preventDefault()"
  >
    <OlMap
      id="map"
      ref="mapRef"
    >
      <OlView
        ref="view"
        projection="EPSG:3857"
      />

      <TheLocationsLayer
        :map="mapRef?.map"
        @layer-ready="fitViewToLocations"
      />

      <MapBasemaps
        projection="EPSG:3857"
        :layers="['OSM']"
      />

      <OlFullScreenControl />
    </OlMap>
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
  .fullscreen-wrapper.fullscreen-active #map{
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

  #map .geojson-layer{
    pointer-events: none;
  }
</style>
