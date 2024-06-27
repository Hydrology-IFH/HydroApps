<script setup>
  import { onMounted, ref } from 'vue';

  const zoomActive = ref(false);

  const closeIconDom = ref(null);
  const openIconDom = ref(null);
  const containerDOM = ref(null);
  const highlight = ref(false);

  onMounted(() => {
    new window.bootstrap.Tooltip(openIconDom.value);
    new window.bootstrap.Tooltip(
      closeIconDom.value,
      {container: containerDOM.value});
  });

</script>

<template>
  <div :class="['zoom-container', {'zoom-active': zoomActive}, {'highlight': highlight}]" ref="containerDOM">

    <div class="zoom-elements">
      <a class="zoom-button" @click="zoomActive = !zoomActive" @mouseover="highlight=true" @mouseleave="highlight=false">
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
      <slot>
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
  .zoom-container .zoom-elements{
      position: relative;
    }
  .zoom-container.zoom-active{
    background-color: #696969;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: 2000;
  }
  .zoom-container.zoom-active .zoom-elements{
    background: white;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    min-height: calc(100vh - 20px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .zoom-container.zoom-active .zoom-elements>div.container{
    height: calc(100vh - 40px);
  }
  .zoom-container.zoom-active .zoom-elements>div.container div.row{
    height: 100%;
  }
  .zoom-container.zoom-active .zoom-elements>div.container>div.row div.order-2{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .zoom-container.zoom-active .zoom-elements>div.container div.row #map{
    flex-grow: 1;
  }
  /* Zoom Button */
  a.zoom-button{
    position: absolute;
    top: 0px;
    right: 8px;
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