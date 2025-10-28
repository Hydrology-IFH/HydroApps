<template>
  <Layers.OlVectorLayer
    v-if="config.locations !== undefined"
    ref="locationLayer"
    :style="defaultStyle"
    @sourceready="onLocationLayerReady"
  >
    <Sources.OlSourceVector
      :features="features"
      :format="geoJson"
    />
  </Layers.OlVectorLayer>

  <Interactions.OlInteractionSelect
    v-if="locationLayerReady && (map !== null)"
    :condition="selectCondition"
    :layers="[locationLayer.vectorLayer]"
    :multi="false"
    @select="featureSelected"
  />

  <MapHoverOverlay
    v-if="locationLayerReady && (map !== null)"
    :map="map"
    :layer="locationLayer.vectorLayer"
    unit=""
    dtype="string"
    property-name="name"
  />

  <ErrorFrame
    v-if="alertEditMode"
    :header="$t('edit_mode_alert_header')"
    :msg="$t('edit_mode_alert_msg')"
    @close="alertEditMode = false"
  />
</template>

<script setup>
  import { ref, computed, onBeforeMount } from 'vue';
  import {
    Layers,
    Sources,
    Interactions
  } from "vue3-openlayers";
  import { GeoJSON } from 'ol/format';
  import { click } from 'ol/events/condition';
  import { Style, Fill, Stroke, Circle } from 'ol/style';

  import { useConfig } from '~/stores/config.js';
  import MapHoverOverlay from "~~/components/map/MapHoverOverlay.vue";
  import ErrorFrame from "~~/components/ErrorFrame.vue";

  //  setup
  const emit = defineEmits(['layer-ready']);
  const props = defineProps({
    map: {
      type: [Object, null],
      default: null
    }
  });

  // define reactive variables
  const locationLayer = ref(null);
  const locationLayerReady = ref(false);
  const config = useConfig();
  const alertEditMode = ref(false);

  // fetch locations before mounting
  onBeforeMount(() => {
    config.fetchLocations()
  });

  // trigger function for when the locations layer is ready
  const onLocationLayerReady = () => {
    locationLayerReady.value = true;
    emit('layer-ready', locationLayer.value);
  }

  // compute features from config.locations
  const geoJson = new GeoJSON();
  const features = computed(() => {
    return geoJson.readFeatures(config.filteredLocations, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  });

  // define styles
  const defaultStyle = new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.6)' }),
      stroke: new Stroke({ color: '#3399CC', width: 3 })
    }),
    zIndex: 0
  })
  const selectedStyle = new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: "#05b00f" }), //"#afdace"
      stroke: new Stroke({ color: "#f0f0f0", width: 3  }),
    }),
    zIndex: 1000
  });

  const selectCondition = (e) => {
    if (click(e)){
      if (config.editMode) {alertEditMode.value = true}
      return !config.editMode;
    }
    return false;
  }
  // handle feature selection
  const featureSelected = (event) => {
    if (event.selected.length > 0) {
      const feature = event.selected[0];
      config.selectedLocation = feature;
      feature.setStyle(selectedStyle);
    }
    if (event.deselected.length > 0) {
      const feature = event.deselected[0];
      if (event.selected.length === 0) {
        config.selectedLocation = null;
      }
      feature.setStyle(defaultStyle);
    }
  }
</script>