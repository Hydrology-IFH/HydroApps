<script setup>
  import FullscreenAble from '~~/components/FullscreenAble.vue';
  import Map from './components/Map.vue';
  import Flowchart from './components/Flowchart.vue';
  import Menu from './components/Menu.vue';
</script>
<template>
  <FullscreenAble>
    <div class="container p-0">
      <div class="row"><Flowchart/></div>
      <div class="row">
        <div class="col-12 col-md-4 order-md-2"><Menu/></div>
        <div class="col-12 col-md-8 order-md-1"><Map/></div>
      </div>
    </div>
  </FullscreenAble>
</template>