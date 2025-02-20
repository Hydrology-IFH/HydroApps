<script setup>
  import { onMounted, ref, inject } from 'vue';

  const { updateHighlight } = inject('fullscreen-highlight');
  const { active, updateActive } = inject('fullscreen-active');

  const closeIconDom = ref(null);
  const openIconDom = ref(null);

  onMounted(() => {
    new window.bootstrap.Tooltip(openIconDom.value);
    new window.bootstrap.Tooltip(
      closeIconDom.value,
      { container: document.getElementById("fullscreen-wrapper")}
    );
  });

</script>

<template>
  <a class="fullscreen-button" @click="updateActive(!active)"
    @mouseover="updateHighlight(true)" @mouseleave="updateHighlight(false)"
    data-html2canvas-ignore>
    <i  class="bi bi-arrows-fullscreen"
        :class="['bi', active ? 'bi-x-lg' : 'bi-arrows-fullscreen']"
        :data-bs-title='$t("common:tooltip_fullscreen_open")' data-bs-placement="top"
        v-show="!active"
        ref="openIconDom" />
    <i  class="bi bi-x-lg"
        :data-bs-title='$t("common:tooltip_fullscreen_close")' data-bs-placement="left"
        v-show="active"
        ref="closeIconDom" />
  </a>
</template>

<style scoped>
  /* Zoom Button */
  a.fullscreen-button{
    font-size: x-large;
    cursor: pointer;
    color: black;
  }
  a.fullscreen-button:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  .tooltip{
    z-index: 2000;
  }
</style>