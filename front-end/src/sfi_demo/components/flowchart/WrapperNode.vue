<script setup>
  import { onMounted, ref } from 'vue';
  import { Position, Handle } from '@vue-flow/core';

  // props were passed from the slot using `v-bind="NodeProps"`
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    }
  })

  const nodeRef = ref(null)
  const tooltip = ref(null)

  // set Tooltip
  onMounted(() => {
    if (props.data.tooltip) {
      tooltip.value = new window.bootstrap.Tooltip(
        nodeRef.value,
        {
          title: props.data.tooltip,
          trigger: "hover",
          html: true,
          placement: "top",
          container: "#fullscreen-wrapper",
        })
    }
  })
</script>

<template>
  <div
    ref="nodeRef"
    class="wrapper-node bs-primary-bg-subtle"
    :data-bs-custom-class="props.data.tooltip?.length > 120? 'fn-tooltip-l': props.data.tooltip?.length > 80? 'fn-tooltip-md':null"
  >
    <i
      v-if="data.icon"
      class="bi"
      :class="`${data.icon}`"
    />
    {{ data.label }}
    <Handle
      type="source"
      :position="Position.Right"
    />
    <Handle
      type="target"
      :position="Position.Left"
    />
    <template
      v-if="data.additionalHandles"
    >
      <Handle
        v-for="handle in data.additionalHandles"
        :id="handle.id"
        :key="handle.type"
        :type="handle.type"
        :position="handle.position"
      />
    </template>
  </div>
</template>

<style scoped>
  .wrapper-node {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 10px;
    margin: -5px;
    height: calc(2em + 10px);
    width: calc(100% + 10px);
    border-radius: 10px;
    border: 0;
    background-color: var(--uni-yellow-60);
    cursor: pointer;
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