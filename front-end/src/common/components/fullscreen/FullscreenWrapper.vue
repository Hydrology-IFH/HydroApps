<script setup>
  import { provide, ref, watchEffect } from 'vue';

  const active = ref(false);
  function updateActive(value) {
    if (value !== active.value) {
      active.value = value;

      // update bootstrap tooltips to be shown in the container
      let trgtRef = active.value ? wrapperRef.value : document.body;
      let srcref = active.value ? document.body : wrapperRef.value;
      wrapperRef.value.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
        let tltp = window.bootstrap.Tooltip.getInstance(el);
        if (tltp && tltp._config.container === srcref) {
          tltp._config.container = trgtRef;
        }
      });
      window.bootstrap.Tooltip.DefaultType.container = trgtRef;
    }
  }
  provide('fullscreen-active', { active, updateActive });

  const highlight = ref(false);
  function updateHighlight(value){
    highlight.value = active.value? false:value;
  }
  provide('fullscreen-highlight', { highlight, updateHighlight });

  // activate fullscreen mode if possible
  const wrapperRef = ref(null);
  watchEffect(() => {
    if (active.value) {
      if (wrapperRef.value.requestFullscreen) {
        wrapperRef.value.requestFullscreen();
      } else if (wrapperRef.value.webkitRequestFullscreen) { /* Safari */
        wrapperRef.value.webkitRequestFullscreen();
      } else if (wrapperRef.value.msRequestFullscreen) { /* IE11 */
        wrapperRef.value.msRequestFullscreen();
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
        wrapperRef.value.fullscreenElement ||
        wrapperRef.value.webkitFullscreenElement ||
        wrapperRef.value.msFullscreenElement ||
        false);
    };
    window.addEventListener('fullscreenchange', fullscreenListener);
  }

</script>

<template>
  <div
    id="fullscreen-wrapper"
    ref="wrapperRef"
    class="fullscreen-wrapper"
    :class="{'fullscreen-active': active, highlight: highlight}"
  >
    <div class="fullscreen-container">
      <slot default />
    </div>
  </div>
</template>

<style scoped>
  /* Make map zoom to fullscreen */
  .fullscreen-wrapper.highlight{
    box-shadow: var(--bs-gray-400) 0px 0px 5px 5px;
    transition: box-shadow 0.2s;
  }
  .fullscreen-wrapper .fullscreen-container{
      position: relative;
    }
  .fullscreen-wrapper.fullscreen-active{
    background-color: #696969;
    height: 100vh;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2000;
  }
  .fullscreen-wrapper.fullscreen-active .fullscreen-container{
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