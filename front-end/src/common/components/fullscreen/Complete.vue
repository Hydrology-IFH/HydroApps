<script setup>
  import Button from './Button.vue';
  import Wrapper from './Wrapper.vue';
</script>

<template>
  <Wrapper>
    <div class="wrapper-buttons">
      <Button/>
    </div>
    <slot default>
    </slot>
  </Wrapper>
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