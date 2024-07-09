<script setup>
  import { BezierEdge } from '@vue-flow/core';
  import { Position } from '@vue-flow/core'

  // props are passed from the slot using `v-bind="customEdgeProps"`
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    sourceX: {
      type: Number,
      required: true,
    },
    sourceY: {
      type: Number,
      required: true,
    },
    targetX: {
      type: Number,
      required: true,
    },
    targetY: {
      type: Number,
      required: true,
    },
    sourcePosition: {
      type: String,
      default: Position.Right,
    },
    targetPosition: {
      type: String,
      default: Position.Left,
    },
  })

</script>

<template>
  <BezierEdge
      :source-x="sourceX"
      :source-y="sourceY"
      :target-x="targetX"
      :target-y="targetY"
      :source-position="sourcePosition"
      :target-position="targetPosition"
      class="flow-edge"
  />
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
</style>