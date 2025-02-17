<script setup>
  import { onMounted, ref, inject } from 'vue';

  const { updateHighlight } = inject('fullscreen-highlight');
  const { zoomActive, updateZoomActive } = inject('fullscreen-zoomActive');

  const closeIconDom = ref(null);
  const openIconDom = ref(null);

  onMounted(() => {
    new window.bootstrap.Tooltip(openIconDom.value);
    new window.bootstrap.Tooltip(
      closeIconDom.value,
      { container: document.getElementById("zoom-container")}
    );
  });

</script>

<template>
  <a class="zoom-button" @click="updateZoomActive(!zoomActive)"
    @mouseover="updateHighlight(true)" @mouseleave="updateHighlight(false)"
    data-html2canvas-ignore>
    <i  class="bi bi-arrows-fullscreen"
        :class="['bi', zoomActive ? 'bi-x-lg' : 'bi-arrows-fullscreen']"
        :data-bs-title='$t("common:tooltip_fullscreen_open")' data-bs-placement="top"
        v-show="!zoomActive"
        ref="openIconDom" />
    <i  class="bi bi-x-lg"
        :data-bs-title='$t("common:tooltip_fullscreen_close")' data-bs-placement="left"
        v-show="zoomActive"
        ref="closeIconDom" />
  </a>
</template>

<style scoped>
  /* Zoom Button */
  a.zoom-button{
    font-size: x-large;
    cursor: pointer;
    color: black;
  }
  a.zoom-button:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  .tooltip{
    z-index: 2000;
  }
</style>