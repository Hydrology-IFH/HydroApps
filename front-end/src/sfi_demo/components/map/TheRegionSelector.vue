<script setup>
  import { ref, onMounted, watchEffect } from 'vue';
  import { OlFeature } from "vue3-openlayers/map";
  import { OlStyle, OlStyleStroke, OlStyleFill } from "vue3-openlayers/styles";
  import { OlVectorLayer } from "vue3-openlayers/layers";
  import { OlSourceVector } from "vue3-openlayers/sources";
  import { OlInteractionSelect } from "vue3-openlayers/interactions";
  import { OlGeomPolygon } from "vue3-openlayers/geometries";
  import { useTranslation } from "i18next-vue";
  import { fromExtent } from 'ol/geom/Polygon';
  import { click } from 'ol/events/condition.js';
  import Notification from 'ol-ext/control/Notification';

  import { regions } from "./regions";
  import { useConfig } from "~/stores/config.js";
  import "./projections";
  import MapHoverOverlay from "~~/components/map/MapHoverOverlay.vue";

  const props = defineProps({
    map: {
      type: Object,
      required: true
    }
  });

  const config = useConfig();
  const { i18next } = useTranslation();

  // DOM references to the layers
  const refLayer = ref(null);
  const selectRef = ref(null);
  const layerVisible = ref(config.region_selection_active);
  const notification = new Notification({ className:'select-region-notification' });

  // Function to show only the basemap layers in the layer switcher
  const featureSelected = (e) => {
    let feature = e.selected[0];
    config.region = feature.get('name');
    config.region_selection_active = false;
  }
  const selectInteractionFilter = (feature) => {
    return feature.values_.name != undefined;
  };
  onMounted(() => {
    // Add notification to the map
    props.map.addControl(notification);

    // Change cursor on hover
    props.map.on('pointermove', function(e){
      var pixel = props.map.getEventPixel(e.originalEvent);
      var hit = props.map.hasFeatureAtPixel(pixel);
      props.map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  })

  // show or hide notifications and layers
  watchEffect(() => {
    if (config.region_selection_active) {
      notification.show(i18next.t("map_notification_select_region"), -1);
      layerVisible.value = true;

      // unselect all features
      selectRef.value?.select.getFeatures().clear();
    } else {
      notification.hide();
      setTimeout(() => {
        layerVisible.value = config.region_selection_active;
      }, 3000);
    }
  })
</script>

<template>
  <OlVectorLayer
    ref="refLayer"
    :visible="layerVisible"
    class-name="regionLayer"
    :update-while-animating="true"
  >
    <OlSourceVector>
      <OlFeature
        v-for="(region, name) in regions"
        :key="name"
        :properties="{ name }"
      >
        <OlGeomPolygon
          :coordinates="fromExtent(region.extent).getCoordinates()"
          :geometry-name_="name"
        />
        <OlStyle>
          <OlStyleStroke
            :color="config.region===name?'#00a082':'#344A9A'"
            :width="4"
          />
          <OlStyleFill :color="config.region===name ? !config.region_selection_active? '#00000000':'#7bc6b480' : '#868DC260'" />
        </OlStyle>
      </OlFeature>
    </OlSourceVector>
  </OlVectorLayer>
  <OlInteractionSelect
    v-if="config.region_selection_active"
    ref="selectRef"
    :condition="click"
    :filter="selectInteractionFilter"
    @select="featureSelected"
  />
  <MapHoverOverlay
    v-if="map != null && refLayer != null && config.region_selection_active"
    :map="map"
    :layer="refLayer.vectorLayer"
    unit=""
    property-name="name"
    dtype="string"
  />
</template>

<style>
  .ol-notification.select-region-notification {
    font-size: 16px;
    top:0;
    bottom: auto;
  }
  .ol-notification.select-region-notification > div {
      border-radius: 0 0 4px 4px;
      bottom: auto
    }
</style>