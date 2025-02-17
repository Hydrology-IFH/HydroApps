<script setup>
  import { onMounted, provide, ref, watch, watchEffect } from 'vue';

  const zoomActive = ref(false);
  function updateZoomActive(value){
    zoomActive.value = value;
  }
  provide('fullscreen-zoomActive', { zoomActive, updateZoomActive });

  const highlight = ref(false);
  function updateHighlight(value){
    highlight.value = zoomActive.value? false:value;
  }
  provide('fullscreen-highlight', { highlight, updateHighlight });

  // activate fullscreen mode if possible
  const containerRef = ref(null);
  watchEffect(() => {
    if (zoomActive.value) {
      if (containerRef.value.requestFullscreen) {
        containerRef.value.requestFullscreen();
      } else if (containerRef.value.webkitRequestFullscreen) { /* Safari */
        containerRef.value.webkitRequestFullscreen();
      } else if (containerRef.value.msRequestFullscreen) { /* IE11 */
        containerRef.value.msRequestFullscreen();
      }
    } else if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement){
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  });

  // add event listener to exit fullscreen mode
  if (window.fullscreenable) {
    const fullscreenListener = () => {
      updateZoomActive(
        containerRef.value.fullscreenElement ||
        containerRef.value.webkitFullscreenElement ||
        containerRef.value.msFullscreenElement ||
        false);
    };
    window.addEventListener('fullscreenchange', fullscreenListener);
  }


</script>

<template>
  <div class="zoom-container" :class="{'zoom-active': zoomActive, highlight: highlight}" id="zoom-container" ref="containerRef">
    <div class="zoom-containerRefents">
      <slot default>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  /* Make map zoom to fullscreen */
  .zoom-container.highlight{
    box-shadow: var(--bs-gray-400) 0px 0px 5px 5px;
    transition: box-shadow 0.2s;
  }
  .zoom-container .zoom-containerRefents{
      position: relative;
    }
  .zoom-container.zoom-active{
    background-color: #696969;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: 2000;
  }
  .zoom-container.zoom-active .zoom-containerRefents{
    background: white;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    min-height: calc(100vh - 20px);
    height: calc(100% - 20px);
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
<style>
  .zoom-containerRefents .container{
    max-width: 100%!important;
  }
</style>