<script setup>
  import TheParametersForm from './components/menu/TheParametersForm.vue';
  import TheMapHeader from './components/map/TheMapHeader.vue';
  import TheMap from './components/map/TheMap.vue';
  import FullScreenWrapper from '~~/components/fullscreen/FullscreenWrapper.vue';
  import FullscreenButton from '~~/components/fullscreen/FullscreenButton.vue';
  import ScreenshotWrapper from '~~/components/screenshot/ScreenshotWrapper.vue';
  import ScreenshotButton from '~~/components/screenshot/ScreenshotButton.vue';
  import TheDailySRIChart from './components/TheDailySRIChart.vue';
  import { useConfig } from './stores/config';

  const config = useConfig();
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
            <p
              v-if="config.parameter === 'daily'"
              class="explanation-daily-pos-1"
            >
              {{ $t('map_form_explanation_daily') }}
            </p>
          </div>
          <div class="col-md-5 col-12 order-md-2 order-1">
            <TheParametersForm />
            <p
              v-if="config.parameter === 'daily'"
              class="explanation-daily-pos-2"
            >
              {{ $t('map_form_explanation_daily') }}
            </p>
          </div>
          <div
            v-if="config.parameter==='daily'"
            class="col-12"
          >
            <TheDailySRIChart />
          </div>
          <p
            v-if="config.parameter === 'daily'"
            class="explanation-daily-pos-3 col-12"
          >
            {{ $t('map_form_explanation_daily') }}
          </p>
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

  @media (min-width: 0px) and (max-width: 767px) {
    .explanation-daily-pos-1{
      display: none;
    }
    .explanation-daily-pos-2{
      display: none;
    }
    .explanation-daily-pos-3{
      display: block;
    }
  }
  @media (min-width: 768px) and (max-height: 750px) {
    .explanation-daily-pos-1{
      display: block;
    }
    .explanation-daily-pos-2{
      display: none;
    }
    .explanation-daily-pos-3{
      display: none;
    }
  }
  @media (min-width: 768px) and (min-height: 751px) {
    .explanation-daily-pos-1{
      display: none;
    }
    .explanation-daily-pos-2{
      display: block;
    }
    .explanation-daily-pos-3{
      display: none;
    }
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