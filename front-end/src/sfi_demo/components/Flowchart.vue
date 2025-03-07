<script setup>
  import { ref, computed } from 'vue';
  import { VueFlow, useVueFlow  } from '@vue-flow/core'

  import { useLayerLib } from '~/stores/layerLib.js';
  import CustomNode from './flowchart/CustomNode.vue';
  import WrapperNode from './flowchart/WrapperNode.vue';
  import CustomEdge from './flowchart/CustomEdge.vue';
  import { nodesInit, edgesInit } from './flowchart/flowElements';
  import { useConfig } from '~/stores/config.js';

  const layerLib = useLayerLib();
  const config = useConfig();
  const flowStore = useVueFlow();
  const { onPaneReady } = flowStore

  const nodes = computed(() => {
    return nodesInit.map(node => (
      {
        ...node,
        hidden: node.condition !== undefined ? !node.condition({ config }) : false
      }))
  })
  const edges = ref(edgesInit)

  const nodesWidthRaw = computed(() => {
    if (config.region == "Emmendingen" && config.kind == "matrix") {
      return 750
    } else {
      return 580
    }
  })
  const zoom = ref(1)
  const width = computed(() => `${nodesWidthRaw.value / zoom.value}px`)

  // fit the flowchart view
  onPaneReady((instance) => {
    let fit = () => {
      instance.fitView({ "padding-top": "5px", includeHiddenNodes: false }).then(() => {
        instance.viewport.value.x = 0
        zoom.value = instance.viewport._value.zoom
      })
    }
    fit()
    window.addEventListener('resize', fit)
  })

</script>

<template>
  <div class="flow-container" style="height:100px" :style="{width: width}">
    <VueFlow :nodes="nodes" :edges="edges"
             :nodesDraggable="false"
             :nodesConnectable="false"
             :zoomOnScroll="false"
             :zoomOnDoubleClick="false"
             :zoomOnPinch="false"
             :panOnDrag="false"
             :edgesUpdatable="false">

      <template #node-custom="NodeProps">
        <CustomNode v-bind="NodeProps" :layerLib="layerLib"/>
      </template>

      <template #edge-custom="EdgeProps">
        <CustomEdge v-bind="EdgeProps" />
      </template>

      <template #node-wrapper="NodeProps">
        <WrapperNode v-bind="NodeProps" :layerLib="layerLib"/>
      </template>
    </VueFlow>
  </div>
</template>

<style>
  /* import the necessary styles for Vue Flow to work */
  @import '@vue-flow/core/dist/style.css';

  div.flow-container {
    padding: 5px;
  }
</style>
