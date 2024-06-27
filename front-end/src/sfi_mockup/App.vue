<script setup>
  import FullscreenAble from '~/common/components/FullscreenAble.vue';
  import Map from './components/Map.vue';
  import Menu from './components/Menu.vue';
</script>
<template>
  <FullscreenAble>
    <div class="container p-0">
      <div class="col-4"><Menu /></div>
      <div class="col-8"><Map /></div>
    </div>
  </FullscreenAble>
</template>