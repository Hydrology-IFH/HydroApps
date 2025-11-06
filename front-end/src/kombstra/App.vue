<script setup>
  import TheParametersForm from './components/menu/TheParametersForm.vue';
  import TheMapHeader from './components/map/TheMapHeader.vue';
  import TheMap from './components/map/TheMap.vue';
  import FullScreenWrapper from '~~/components/fullscreen/FullscreenWrapper.vue';
  import FullscreenButton from '~~/components/fullscreen/FullscreenButton.vue';
  import ScreenshotWrapper from '~~/components/screenshot/ScreenshotWrapper.vue';
  import ScreenshotButton from '~~/components/screenshot/ScreenshotButton.vue';
</script>

<template>
  <FullScreenWrapper>
    <ScreenshotWrapper>
      <div class="container p-0 app">
        <div class="row top-row">
          <div class="wrapper-buttons">
            <ScreenshotButton file-name="KombStRA_App.png" />
            <FullscreenButton />
          </div>
        </div>
        <div class="row">
          <div class="col-md-7 col-12 order-md-1 order-2">
            <TheMapHeader />
            <TheMap />
          </div>
          <div class="col-md-5 col-12 order-md-2 order-1">
            <TheParametersForm />
          </div>
        </div>
      </div>
    </ScreenshotWrapper>
  </FullScreenWrapper>
</template>

<style scoped>
  div.wrapper-buttons{
    z-index: 500;
    display: flex;
    gap: 10px;
    justify-items: end;
    margin-left: auto !important;
    flex: 0 0 auto;
    width: auto;
    height: 1em;
  }
</style>

<style>
  .fullscreen-container .container.app{
    max-width: 100%!important;
  }
  .fullscreen-container .container.app>.row{
    flex-wrap: wrap-reverse;
  }
</style>