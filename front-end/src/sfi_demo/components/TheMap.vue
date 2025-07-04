<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { Map, MapControls } from "vue3-openlayers";
  import { buffer, getCenter } from 'ol/extent';
  import View from 'ol/View';

  import MapHoverOverlay from "~~/components/MapHoverOverlay.vue";
  import ErrorFrame from '~~/components/ErrorFrame.vue';
  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~/stores/layerLib.js';
  import "./map/projections";
  import TheBasemaps from './map/TheBasemaps.vue';
  import TheMapLegend from "./map/TheMapLegend.vue";
  import TheRegionSelector from './map/TheRegionSelector.vue';
  import { flyTo } from "./map/animations";
  import { regions } from "./map/regions";

  // calculate total extent
  var total_extent = [Infinity, Infinity, -Infinity, -Infinity];
  for (let region of Object.keys(regions)) {
    total_extent = [
      Math.min(total_extent[0], regions[region].extent[0]),
      Math.min(total_extent[1], regions[region].extent[1]),
      Math.max(total_extent[2], regions[region].extent[2]),
      Math.max(total_extent[3], regions[region].extent[3])];
  }
  total_extent = buffer(total_extent, 150000);

  // setup
  const config = useConfig();
  const layerLib = useLayerLib();
  const mapRef = ref(null);
  const map = ref(null);
  const last_region = ref(config.region)
  const last_region_selection_active = ref(config.region_selection_active)

  // define view, vue3-openlayers imnplementation of View did produce many problems with the flyTo method and extent
  var view = new View({
    projection: 'EPSG:25832',
    smoothExtentConstraint: false,
    smoothResolutionConstraint: false,
  });

  //  functions for manipulating the map extent
  const get_extent = (addBuffer = false) => {
    let extent = config.region_selection_active ? total_extent : regions[config.region].extent;
    return addBuffer && !config.region_selection_active? buffer(extent, 20000) : extent;
  }
  const set_extent = function (extent, moveToExtent = false) {
    let view_props = view.getProperties();
    view_props.extent = extent;
    if (moveToExtent) {
      view_props.center = getCenter(extent);
      view_props.resolution = view.getResolutionForExtent(extent);
    }

    view = new View(view_props);
    if (map.value) {
      map.value.setView(view);
    }
  }
  const update_extent = function (moveToExtent = false) {
    set_extent(get_extent(true), moveToExtent);
  }

  // layers
  const layer = computed(() => layerLib.selectedLayer)
  const layerError = computed(() => {
    return config.region_selection_active? false : layer.value ? layer.value.hasError: false
  })
  const layerAvailable = computed(() => {
    return layer.value ? layer.value.layerAvailable : false
  })

  // change map extent on region change
  config.$subscribe((mutation, state) => {
    if ((state.region_selection_active !== last_region_selection_active.value) ||
      (state.region !== last_region.value)) {
      // fly to next region/total_extent
      set_extent(undefined, false);
      flyTo(map.value,
        { extent: get_extent(false) },
        () => update_extent(false),
        3000);

      // store last region
      last_region.value = state.region;
      last_region_selection_active.value = state.region_selection_active;
    }
  })

  // change layer if the current layer isn't available anymore
  config.$subscribe((mutation, state) => {
    if (!layerLib.selectedLayer?.condition?.({ config: state }) && layerLib.selectedLayer.backupLayer !== undefined) {
      layerLib.selectLayer(layerLib.selectedLayer.backupLayer);
    }
  })

  // initiate the map
  onMounted(() => {
    layerLib.initMap(mapRef.value.map)
    layerLib.selectLayer("SFI")
    map.value = mapRef.value?.map;
    update_extent(true);
    map.value.setView(view);

    // debug allways start with specific settings
    // config.soilMoisture = 10;
    // config.sri = 5;
    // setTimeout(() => {
    //   config.region = "Emmendingen";
    //   config.region_selection_active = false;
    //   layerLib.selectLayer("ai_depth");
    //   update_extent(true);
    // }, 1000);
    // end debug

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
  <div
    class="map-container"
    @wheel="(event) => event.preventDefault()"
  >
    <Map.OlMap
      id="map"
      ref="mapRef"
    >
      <TheBasemaps />
      <TheRegionSelector
        v-if="map != null"
        :map="map"
      />
      <MapHoverOverlay
        v-if="map != null && layer != null && layer.layerAvailable && !config.region_selection_active"
        :map="map"
        :layer="layer.olLayer"
        :unit="layer.unit"
        :decimals="layer.decimals"
        :value-converter="layer.valueConverter"
        :property-name="layer.propertyName"
      />
      <TheMapLegend
        v-if="map != null && layer != null"
        :map="map"
        :layer-name="layer.name"
        :style="layer.legendStyle"
        :unit="layer.unit"
        :visible="!config.region_selection_active"
        :opacity="config.opacity/100"
      />

      <MapControls.OlFullscreenControl />
    </Map.OlMap>
    <ErrorFrame
      v-if="layerError && layerAvailable"
      type="danger"
      :header="$t('map_popup_error_header')"
      :msg="$t('map_popup_error_msg')"
    />
    <ErrorFrame
      v-if="!layerAvailable"
      type="warning"
      :header="$t('map_popup_not_available_header')"
      :msg="$t('map_popup_not_available_msg')"
    />
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
