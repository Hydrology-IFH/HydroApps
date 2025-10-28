<script setup>
  import BaseInput from './BaseInput.vue'

  const decimals = defineModel({
    type: Number,
    required: true
  })
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 6
    },
    numFieldWidth: {
      type: String,
      default: '70px'
    },
    unit: {
      type: String,
      default: null
    }
  })

  const id = props.label.replace(/\s/g, '_')

</script>

<template>
  <BaseInput :label="label">
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
      :style="{'max-width': numFieldWidth}"
    >
    <span
      v-if="unit"
      class="input-group-text"
    >
      {{ unit }}
    </span>
  </BaseInput>
</template>
