<script setup>
  import { BezierEdge } from '@vue-flow/core';
</script>

<template>
  <BezierEdge class="flow-edge"/>
</template>

<style>
  path.flow-edge.vue-flow__edge-path {
    stroke-dasharray: 5;
    animation: dashdraw 0.6s linear infinite;
    stroke: var(--uni-blue-80)!important;
    cursor: default;
  }
  .vue-flow__edge-custom .vue-flow__edge-interaction{
    cursor: default;
  }
  .vue-flow__edge-custom .vue-flow__edge-text{
    fill: var(--uni-blue-100)!important;
  }
</style>