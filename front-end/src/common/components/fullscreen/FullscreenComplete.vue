<script setup>
  import FullscreenButton from './FullscreenButton.vue';
  import FullscreenWrapper from './FullscreenWrapper.vue';
</script>

<template>
  <FullscreenWrapper>
    <div class="wrapper-buttons">
      <FullscreenButton/>
    </div>
    <slot default>
    </slot>
  </FullscreenWrapper>
</template>

<style scoped>
   div.wrapper-buttons{
    position: absolute;
    top: 0px;
    right: 8px;
    z-index: 500;
    display: flex;
    gap: 10px;
  }
</style>