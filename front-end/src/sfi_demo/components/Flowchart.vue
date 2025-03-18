<script setup>
  import { ref, computed, watch } from 'vue';
  import { VueFlow, useVueFlow  } from '@vue-flow/core'

  import { useLayerLib } from '~/stores/layerLib.js';
  import CustomNode from './flowchart/CustomNode.vue';
  import WrapperNode from './flowchart/WrapperNode.vue';
  import CustomEdge from './flowchart/CustomEdge.vue';
  import { nodesInit, edgesInit } from './flowchart/flowElements';
  import { conditionAI, conditionDamage } from '~/stores/Layer/LAYERS.js';
  import { useConfig } from '~/stores/config.js';

  const layerLib = useLayerLib();
  const config = useConfig();
  const flowStore = useVueFlow();
  const { onPaneReady, fitView } = flowStore;

  // set the width of the flowchart
  const nodesWidthRaw = computed(() => {
    if (conditionAI({config}) || conditionDamage({config})) {
      return 750
    } else {
      return 580
    }
  })
  const zoom = ref(1)
  const width = computed(() => `${nodesWidthRaw.value / zoom.value}px`)

  // fit the flowchart view
  const fit = () => {
    fitView({ "padding-top": "5px", includeHiddenNodes: false }).then(() => {
      flowStore.viewport.value.x = 0
      zoom.value = flowStore.viewport._value.zoom
    })
  }
  window.addEventListener('resize', fit)
  onPaneReady(fit)

  // nodes and edges constructor
  const nodes = computed(() => {
    return nodesInit.map(nodeInit => {
      const node = { ...nodeInit }
      if (node.data.tooltipConfig) {
        node.data.tooltip = computed(() => node.data.tooltipConfig({ config }))
      }
      if (node.condition) {
        node.hidden = computed(() => !node.condition({ config }))
        watch(node.hidden , () => setTimeout(fit, 5))
      }
      return node
    })
  })
  const edges = ref(edgesInit)
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
    padding-top: 5px;
    padding-bottom: 5px;;
  }
</style>
