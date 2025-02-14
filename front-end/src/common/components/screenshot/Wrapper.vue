<script setup>
  import { provide, ref } from 'vue';

  const highlight = ref(false);
  function updateHighlight(value){
    highlight.value = value;
  }
  provide('screenshot-highlight', { highlight, updateHighlight });

</script>

<template>
  <div class="screenshot-container" :class="{highlight: highlight}" id="screenshot-container">
    <slot default>
    </slot>
  </div>
</template>

<style scoped>
  /* Make map screenshot to fullscreen */
  .screenshot-container.highlight{
    box-shadow: var(--bs-gray-400) 0px 0px 5px 5px;
    transition: box-shadow 0.2s;
  }

</style>