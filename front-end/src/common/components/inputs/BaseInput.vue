<script setup>
  import { onMounted, ref } from 'vue'

  // define props
  const props = defineProps({
    label: { type: String, required: true },
    tooltipMsg: { type: String, required: true }
  })

  const id = props.label.replace(/\s/g, '_')
  const label_dom = ref(null)

  // Initialize Bootstrap tooltip
  onMounted(() => {
    if (props.tooltipMsg != "") {
      new window.bootstrap.Tooltip(label_dom.value)
    }
  })
</script>

<template>
  <div class="input-group mb-3">
    <span
      :id="`label_Select${id}`"
      ref="label_dom"
      class="input-group-text px-2"
      style="padding: 0;"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="tooltipMsg"
    >
      {{ label }}
    </span>
    <slot class="form-control">
      <div class="form-control">
        You forgot to add a slot for the input component. InputBase.vue is a base component that should be extended by other input components.
      </div>
    </slot>
  </div>
</template>