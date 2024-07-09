<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { Position, Handle } from '@vue-flow/core';

  // props were passed from the slot using `v-bind="customNodeProps"`
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    sourcePosition: {
      type: String,
    },
    targetPosition: {
      type: String,
    },
    config: {
      type: Object,
    },
  })

  const nodeRef = ref(null)
  const layer = ref(props.config.layerLib.getLayer(props.data.layerID) ?? null)
  const hasLayer = computed(() => {
    return layer.value != null
  })

  // select Layer on Click
  const onClick = (event) => {
    if (hasLayer.value){
      props.config.layerLib.selectLayer(layer.value)
    }
  }

  // node classes
  const nodeClasses = computed(() => {
    return {
      selected: layer.value?.selected,
      "not-available": !hasLayer.value,
      left: layer.value?.selected_side == 'left',
      right: layer.value?.selected_side == 'right',
    }
  })

  // set Tooltip
  onMounted(() => {
    if (props.data.tooltip) {
      new window.bootstrap.Tooltip(
        nodeRef.value,
        { title: props.data.tooltip, trigger: "hover", html: true, placement: "top" })
    }
  })
</script>

<template>
  <div class="custom-node bs-primary-bg-subtle"
       ref="nodeRef"
       :class="nodeClasses"
       :data-bs-custom-class="props.data.tooltip?.length > 120? 'fn-tooltip-l': props.data.tooltip?.length > 80? 'fn-tooltip-md':null"
       @click="onClick">
    {{ data.label }}
    <i v-if="data.icon" class="bi" :class="`${data.icon}`"></i>
    <Handle type="source" :position="Position.Right" />
    <Handle type="target" :position="Position.Left" />
  </div>
</template>

<style scoped>
  .custom-node {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 10px;
    width: 100%;
    height: 2em;
    border: 0;
    background-color: var(--uni-blue-40);
    cursor: pointer;
  }
  .custom-node.selected {
    border: 3px solid var(--uni-green-80);
    background-color: var(--uni-green-60);
  }
  .custom-node.left {
    border: 3px solid var(--uni-green-80);
    background-color: var(--uni-green-60);
  }
  .custom-node.right {
    border: 3px solid var(--uni-rose-80);
    background-color: var(--uni-rose-40);
  }
  .custom-node.not-available {
    background-color: var(--uni-brown-40);
    cursor: default;
  }

  .custom-node i {
    margin-left: 5px;
  }

  .custom-node .vue-flow__handle {
    border: none;
    height: unset;
    width: unset;
    background: transparent;
    font-size: 12px;
  }
</style>

<style>
  .fn-tooltip-md{
    --bs-tooltip-max-width: 250px;
  }
  .fn-tooltip-l{
    --bs-tooltip-max-width: 300px;
  }
</style>