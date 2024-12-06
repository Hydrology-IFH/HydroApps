<script setup>
  import { ref, onMounted } from 'vue';
  import {
    Map,
    Layers,
    Sources,
    Geometries,
  } from "vue3-openlayers";
  import { regions } from "./regions";
  import {fromExtent} from 'ol/geom/Polygon';

  import "./projections";

  // DOM references to the layers
  const regionLayer = ref(null);
  const refLayer = ref(null);
  const OverallExtent = ref(null);

  // Function to show only the basemap layers in the layer switcher

  onMounted(() => {
    window.refLayer=refLayer;
  })
</script>

<template>
  <Layers.OlVectorLayer ref="refLayer">
      <Sources.OlSourceVector>
        <Map.OlFeature>
          <Geometries.OlGeomPolygon v-for="(region, name) in regions"
            :coordinates="fromExtent(region.extent)"
          ></Geometries.OlGeomPolygon>
          <Styles.OlStyle>
            <Styles.OlStyleStroke color="red" :width="20"></Styles.OlStyleStroke>
            <Styles.OlStyleFill color="rgba(255,0,0,0.2)"></Styles.OlStyleFill>
          </Styles.OlStyle>
        </Map.OlFeature>
      </Sources.OlSourceVector>
    </Layers.OlVectorLayer>

</template>

<style>
</style>