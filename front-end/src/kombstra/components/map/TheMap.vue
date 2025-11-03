<script setup>
  import { ref, onMounted } from 'vue';
  import { OlMap } from 'vue3-openlayers/map';
  import { OlFullScreenControl } from 'vue3-openlayers/controls';
  import { buffer } from 'ol/extent';
  import View from 'ol/View';

  import MapHoverOverlay from '~~/components/map/MapHoverOverlay.vue';
  import MapLegendFromStyle from '~~/components/map/MapLegendFromStyle.vue';
  import TheBasemaps from './TheBasemaps.vue';
  import TheMapPopup from './TheMapPopup.vue';
  import { useLayerLib } from '~/stores/layerLib.js';

  // refs
  const mapRef = ref(null);
  const map = ref(null);
  const layerLib = useLayerLib();
  const popupActive = ref(false);

  // view definition
  const view = ref(new View({
    projection: 'EPSG:4326',
    center: [10.5, 51],
    zoom: 6,
    smoothExtentConstraint: false,
    smoothResolutionConstraint: false,
  }));

  // initialize map and layer library
  onMounted(() => {
    map.value = mapRef.value?.map;
    map.value.setView(view.value);
    layerLib.initMap(map.value);
    if (layerLib.selectedLayer) {
      view.value.setCenter(layerLib.selectedLayer.olLayer.getView().getCenter());
      view.value.setExtent(buffer(layerLib.selectedLayer.olLayer.getView().calculateExtent(), 1));
    }
    // expose for debugging
    if (import.meta.env.MODE == 'development'){
      window.kombstraMap = map.value;
      window.layerLib = layerLib;
    }
  });
</script>

<template>
  <div class="kombstra-map-wrapper">
    <OlMap
      id="map"
      ref="mapRef"
      :class="{'ol-map-loading': false}"
    >
      <MapHoverOverlay
        v-if="map && layerLib.selectedLayer && !popupActive"
        :map="map"
        :layer="layerLib.selectedLayer.olLayer"
        :unit="layerLib.selectedLayer.unit"
        :decimals="layerLib.selectedLayer.decimals"
        dtype="number"
        :active="!popupActive"
        :band="layerLib.selectedLayer.band"
        :alpha-band="layerLib.selectedLayer.alphaBand"
      />
      <MapLegendFromStyle
        v-if="map && layerLib.selectedLayer"
        :map="map"
        :layer-name="layerLib.selectedLayer.name"
        :style="layerLib.selectedLayer.legendStyle"
        :unit="layerLib.selectedLayer.unit"
        :visible="true"
        title-position="top"
      />
      <TheBasemaps />
      <OlFullScreenControl />
      <TheMapPopup
        v-if="map && layerLib.selectedLayer"
        v-model:active="popupActive"
      />
    </OlMap>
  </div>
</template>

<style scoped>
  #map {
    position: relative;
    width: 100%;
    min-height: min(80vh, 100%, max(70vh, 400px));
  }
  @media screen and (max-width: 768px) {
    #map {
      /* 100vh - navbar - footer */
      height: calc(100vh - 165px - .5em - 100px);
    }
  }
  @media screen and (min-width: 768px){
    #map {
      /* 100vh - navbar - h1 - body_bottom */
      height: calc(100vh - 165px - .5em - 1.2*2.5em - 2em);
    }
  }
  .fullscreen-wrapper.fullscreen-active #map{
    /* 100vh - wrapper buttons - h4 - 2 * margin+padding of fullscreeen */
    height: calc(100vh - 1em - ((1.275rem + .3vw) * 1.2 + .5em) - 2*20px )
  }
</style>
