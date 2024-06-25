<script setup>
  import { ref } from 'vue';

  const zoomActive = ref(false);

</script>

<template>
  <div :class="['zoom-container', {'zoom-active': zoomActive}]">

    <div class="zoom-elements">
      <a class="zoom-button" @click="zoomActive = !zoomActive" >
        <i class="bi bi-arrows-fullscreen" :bs-title='$t("common:tooltip_fullscreen_open")' bs-placement="top" v-show="!zoomActive"></i>
        <i class="bi bi-x-lg" :bs-title='$t("common:tooltip_fullscreen_close")' bs-placement="left" v-show="zoomActive"></i>
      </a>
      <slot>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  /* Make map zoom to fullscreen */
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
    display:flex;
    flex-direction: column;
  }
  .zoom-container.zoom-active .zoom-elements>div.container div.row #map{
    flex-grow: 1;
  }

  a.zoom-button{
    position: absolute;
    top: -1rem;
    right: 5px;
    margin: 5px;
    font-size: x-large;
    cursor: pointer;
    color: black;
  }
  a.zoom-button:hover{
    opacity: 1;
    color: var(--bs-primary);
  }
  .zoom-container.zoom-active a.zoom-button{
    top: 0px;
  }
  .tooltip{
    z-index: 2000;
  }
</style>