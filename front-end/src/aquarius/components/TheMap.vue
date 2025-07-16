<script setup>
  import { ref, onMounted, computed, onBeforeMount } from 'vue';
  import {
    Map,
    MapControls,
    Layers,
    Sources,
    Styles
  } from "vue3-openlayers";
  import { GeoJSON } from "ol/format";

  import MapHoverOverlay from "~~/components/map/MapHoverOverlay.vue";
  // import ErrorFrame from '~~/components/ErrorFrame.vue';
  import { useConfig } from '~/stores/config.js';
  import MapBasemaps from '~~/components/map/MapBasemaps.vue';

  // setup
  const config = useConfig();
  const mapRef = ref(null);
  const locationLayer = ref(null);
  const locationLayerReady = ref(false);

  // define view
  const view = ref(null)
  const fitViewToLocations = () => {
    view.value.fit(
      locationLayer.value.vectorLayer.getSource().getExtent(),
    {
      padding: [20, 20, 20, 20], // optional padding around the extent
    });
  }

  // compute features from config.locations
  const geoJson = new GeoJSON();
  const features = computed(() => {
    return geoJson.readFeatures(config.locations, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  });

  // trigger function for when the locations layer is ready
  const onLocationLayerReady = () => {
    locationLayerReady.value = true;
    fitViewToLocations();
  }

  onBeforeMount(() => {
    config.fetchLocations()
  });

  // for debugging
  if (import.meta.env !== undefined) {
    window.config = config;
    window.view = view;
    window.mapRef = mapRef;
    window.locationLayer = locationLayer;
    // provide("ol-options", {debug: true,});
  }
</script>

<template>
  <div
    class="map-container"
    @wheel="(event) => event.preventDefault()"
  >
    <Map.OlMap
      id="map"
      ref="mapRef"
    >
      <Map.OlView
        ref="view"
        projection="EPSG:3857"
      />

      <Layers.OlVectorLayer
        v-if="config.locations !== undefined"
        ref="locationLayer"
        @sourceready="onLocationLayerReady"
      >
        <Sources.OlSourceVector
          :features="features"
          :format="geoJson"
        >
          <Styles.OlStyle>
            <Styles.OlStyleCircle
              :radius="6"
            >
              <Styles.OlStyleFill
                color="rgba(255,255,255,0.6)"
              />
              <Styles.OlStyleStroke
                color="#3399CC"
                width="3"
              />
            </Styles.OlStyleCircle>
          </Styles.OlStyle>
        </Sources.OlSourceVector>
      </Layers.OlVectorLayer>

      <MapBasemaps
        projection="EPSG:3857"
        :layers="['OSM']"
      />

      <MapControls.OlFullscreenControl />
      <MapHoverOverlay
        v-if="locationLayerReady && (mapRef !== null)"
        :map="mapRef?.map"
        :layer="locationLayer.vectorLayer"
        unit=""
        dtype="string"
        property-name="name"
      />
    </Map.OlMap>
    <!-- <ErrorFrame
      v-if="layerError && layerAvailable"
      type="danger"
      :header="$t('map_popup_error_header')"
      :msg="$t('map_popup_error_msg')"
    /> -->
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
