<script setup>
  import { onMounted, ref } from 'vue'

  const decimals = defineModel({ required: true })
  const props = defineProps({
    name: { type: String, required: true },
    tooltipMsg: { type: String, required: false , default: "" },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 6
    }
  })

  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  onMounted(() => {
    if (props.tooltipMsg != "") {
      new window.bootstrap.Tooltip(label_dom.value)
    }
  })
</script>

<template>
  <div class="input-group mb-3">
    <span
      :id="`label_SliderDecimals_${id}`"
      ref="label_dom"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="tooltipMsg"
    >
      {{ name}}
    </span>
    <span class="form-control">
      <input
        :id="`SliderDecimals_${id}`"
        v-model.number="decimals"
        type="range"
        class="form-range"
        name="SliderDecimals"
        :min="min"
        :max="max"
      >
    </span>
    <input
      v-model.number="decimals"
      type="number"
      class="form-control"
      name="SliderDecimalsNumber"
      :min="min"
      :max="max"
      style="max-width:70px"
    >
  </div>
</template>
