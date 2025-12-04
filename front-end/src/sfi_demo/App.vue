<script setup>
  import FullscreenWrapper from '~~/components/fullscreen/FullscreenWrapper.vue';
  import FullscreenButton from '~~/components/fullscreen/FullscreenButton.vue';
  import ScreenshotWrapper from '~~/components/screenshot/ScreenshotWrapper.vue';
  import ScreenshotButton from '~~/components/screenshot/ScreenshotButton.vue';
  import TheMap from './components/TheMap.vue';
  import TheFlowchart from './components/TheFlowchart.vue';
  import TheMenu from './components/TheMenu.vue';
  import TheIntroTour from './components/TheIntroTour.vue';
</script>

<template>
  <FullscreenWrapper>
    <ScreenshotWrapper>
      <div class="container p-0 app">
        <div class="row top-row">
          <TheFlowchart id="flow-chart" />
          <div class="wrapper-buttons">
            <TheIntroTour />
            <ScreenshotButton file-name="AVOSS_Demonstrator.png" />
            <FullscreenButton />
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8">
            <TheMap />
          </div>
          <div class="col-12 col-md-4">
            <TheMenu />
          </div>
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