<script setup>
  import { ref, onMounted } from 'vue';
  import OLCesium from 'olcs';
  import Button from 'ol-ext/control/Button.js';

  const props = defineProps({
    map: Object
  })
  const ol3d = new OLCesium({map: props.map});

  const toggle3D = function () {
    ol3d.setEnabled(!ol3d.getEnabled() );
    if (ol3d.getEnabled()){
      const provider = new Cesium.WebMapServiceImageryProvider({
        url : 'https://sgx.geodatenzentrum.de/wms_basemapde?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities',
        layers: "de_basemapde_web_raster_farbe",
            parameters: {
              transparent: true,
              format: "image/png",
            }
        });
      ol3d.getCesiumScene().imageryLayers.addImageryProvider(provider);
    }

  }

  onMounted(()=>{
    // A toggle control to show/hide the menu
    const btnOpen = new Button({
      html: '<i class="bi bi-badge-3d"></i>',
      className: "button-toggle-3d hidden",
      title: "Toggle 3D",
      handleClick: toggle3D
    });
    props.map.addControl(btnOpen);
  })
  window.ol3d = ol3d;

</script>

<template>
  <button class="btn btn-primary" @click="toggle3D">Toogle 3D</button>
</template>

<style scoped>
</style>