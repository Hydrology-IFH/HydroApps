<script setup>
  import { ref } from 'vue';
  import { VueFlow, useVueFlow  } from '@vue-flow/core'

  import { useLayerLib } from '~/stores/layerLib.js';
  import CustomNode from './flowchart/CustomNode.vue';
  import CustomEdge from './flowchart/CustomEdge.vue';
  import { nodesInit, edgesInit } from './flowchart/flowElements';

  const layerLib = useLayerLib();
  const flowStore = useVueFlow()
  const { onPaneReady } = flowStore

  const nodes = ref(nodesInit)
  const edges = ref(edgesInit)

  onPaneReady((instance) => {
    let fit = () => {
      instance.fitView({ padding: 0.1, includeHiddenNodes: true }).then(() => {
        instance.viewport.value.x = 0
      })
    }
    fit()
    window.addEventListener('resize', fit)
  })

</script>
<template>
  <div class="flow-container" style="height:100px;">
    <VueFlow :nodes="nodes" :edges="edges"
             :nodesDraggable="false"
             :nodesConnectable="false"
             :zoomOnScroll="false"
             :zoomOnDoubleClick="false"
             :zoomOnPinch="false"
             :panOnDrag="false"
             :edgesUpdatable="false">

      <template #node-custom="customNodeProps">
        <CustomNode v-bind="customNodeProps" :layerLib="layerLib"/>
      </template>

      <template #edge-custom="customEdgeProps">
        <CustomEdge v-bind="customEdgeProps" />
      </template>
    </VueFlow>
  </div>
</template>
<style>
  /* import the necessary styles for Vue Flow to work */
  @import '@vue-flow/core/dist/style.css';

  /* import the default theme, this is optional but generally recommended
  @import '@vue-flow/core/dist/theme-default.css'; */
</style>
