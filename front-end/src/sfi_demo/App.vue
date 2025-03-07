<script setup>
  import FullscreenWrapper from '~~/components/fullscreen/Wrapper.vue';
  import FullscreenButton from '~~/components/fullscreen/Button.vue';
  import ScreenshotWrapper from '~~/components/screenshot/Wrapper.vue';
  import ScreenshotButton from '~~/components/screenshot/Button.vue';
  import Map from './components/Map.vue';
  import Flowchart from './components/Flowchart.vue';
  import Menu from './components/Menu.vue';
  import IntroTour from './components/IntroTour.vue';
</script>

<template>
  <FullscreenWrapper>
    <ScreenshotWrapper>
      <div class="container p-0 app">
        <div class="row top-row">
          <Flowchart id="flow-chart" />
          <div class="wrapper-buttons">
            <IntroTour/>
            <ScreenshotButton file-name="SFI_Demonstrator.png"/>
            <FullscreenButton/>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8"><Map/></div>
          <div class="col-12 col-md-4"><Menu/></div>
        </div>
      </div>
    </ScreenshotWrapper>
  </FullscreenWrapper>
</template>

<style>
  div.wrapper-buttons{
    z-index: 500;
    display: flex;
    gap: 10px;
    justify-items: end;
    margin-left: auto !important;
    flex: 0 0 auto;
    width: auto;
  }
  .fullscreen-container .container.app{
    max-width: 100%!important;
  }
  .fullscreen-container .container.app>.row{
    flex-wrap: wrap-reverse;
  }

  #flow-chart{
    flex: 0 0 auto;
  }
</style>