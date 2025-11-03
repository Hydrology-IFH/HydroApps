<script setup>
  import ScreenshotButton from './ScreenshotButton.vue';
  import ScreenshotWrapper from './ScreenshotWrapper.vue';
</script>

<template>
  <ScreenshotWrapper>
    <div class="wrapper-buttons">
      <ScreenshotButton/>
    </div>
    <slot default>
    </slot>
  </ScreenshotWrapper>
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