<script setup>
  import { provide, ref } from 'vue';

  // define variable to highlight screenshot container
  const highlight = ref(false);
  function updateHighlight(value){
    highlight.value = value;
  }
  provide('screenshot-highlight', { highlight, updateHighlight });

  // define variable to trigger spinner of wrapper
  const spinnerActive = ref(false);
  const updateSpinnerActive = (value) => {
    spinnerActive.value = value;
  };
  provide('screenshot-spinner-active', { spinnerActive, updateSpinnerActive });

</script>

<template>
  <div class="screenshot-container" :class="{highlight: highlight}" id="screenshot-container">
    <slot default>
    </slot>
    <div id="screenshot-spinner" class="spinner-grow text-info" role="status"
        v-if="spinnerActive" data-html2canvas-ignore >
      <span class="visually-hidden">Creating Screenshot...</span>
    </div>
  </div>
</template>

<style scoped>
  .screenshot-container.highlight{
    box-shadow: var(--bs-gray-400) 0px 0px 5px 5px;
    transition: box-shadow 0.2s;
  }
  .screenshot-container #screenshot-spinner{
    position:absolute;
    top: 50%;
    left: 50%;
    width: 5rem;
    height: 5rem;
  }
</style>