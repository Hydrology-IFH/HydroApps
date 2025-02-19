<script setup>
  import FullscreenWrapper from '~~/components/fullscreen/Wrapper.vue';
  import FullscreenButton from '~~/components/fullscreen/Button.vue';
  import ScreenshotWrapper from '~~/components/screenshot/Wrapper.vue';
  import ScreenshotButton from '~~/components/screenshot/Button.vue';
  import Map from './components/Map.vue';
  import Flowchart from './components/Flowchart.vue';
  import Menu from './components/Menu.vue';
</script>

<template>
  <FullscreenWrapper>
    <ScreenshotWrapper>
      <div class="wrapper-buttons">
        <ScreenshotButton file-name="SFI_Demonstrator.png"/>
        <FullscreenButton/>
      </div>

      <div class="container p-0 app">
        <div class="row"><Flowchart/></div>
        <div class="row">
          <div class="col-12 col-md-4 order-md-2"><Menu/></div>
          <div class="col-12 col-md-8 order-md-1"><Map/></div>
        </div>
      </div>
    </ScreenshotWrapper>
  </FullscreenWrapper>
</template>

<style>
  div.wrapper-buttons{
    position: absolute;
    top: 0px;
    right: 8px;
    z-index: 500;
    display: flex;
    gap: 10px;
  }
  .fullscreen-container .container.app{
    max-width: 100%!important;
  }
</style>