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
  <a
    class="fullscreen-button"
    data-html2canvas-ignore
    @click="updateActive(!active)"
    @mouseover="updateHighlight(true)"
    @mouseleave="updateHighlight(false)"
  >
    <i
      v-show="!active"
      ref="openIconDom"
      class="bi bi-arrows-fullscreen"
      :class="['bi', active ? 'bi-x-lg' : 'bi-arrows-fullscreen']"
      :data-bs-title="$t('common:tooltip_fullscreen_open')"
      data-bs-placement="top"
    />
    <i
      v-show="active"
      ref="closeIconDom"
      class="bi bi-x-lg"
      :data-bs-title="$t('common:tooltip_fullscreen_close')"
      data-bs-placement="left"
    />
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