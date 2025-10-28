<script setup>
  import { ref, computed } from 'vue'
  import { get_reasonable_digits } from '../utils/reasonable_digits'
  import BaseInput from './BaseInput.vue'

  const range = defineModel({type: Array, required: true})
  const props = defineProps({
    label: {type: String, required: true},
    min: {type: Number, default: 0},
    max: {type: Number, default: 100},
  })

  const digits = computed(() => get_reasonable_digits(props.min, props.max))
  const step = computed(() => Math.pow(10, -digits.value))

  const minr = computed(() => Math.min(
    Math.floor(props.min * Math.pow(10, digits.value)) / Math.pow(10, digits.value),
    range.value[0])
  )
  const maxr = computed(() => Math.max(
    Math.ceil(props.max * Math.pow(10, digits.value)) / Math.pow(10, digits.value),
    range.value[1])
  )

</script>

<template>
  <BaseInput :label="label">
    <div class="form-control flex-column d-flex pl-0 pr-0 pb-0">
      <v-range-slider
        v-model="range"
        :min="minr"
        :max="maxr"
        :step="step"
        hide-details
        color="var(--bs-primary)"
        :strict="true"
      />
      <div class="d-flex flex-fill range-numbers">
        <input
          v-model.number.lazy="range[0]"
          type="number"
          class="form-control"
          :min="minr"
          :max="maxr"
        >
        <input
          v-model.number.lazy="range[1]"
          type="number"
          class="form-control"
          :min="minr"
          :max="maxr"
        >
      </div>
    </div>
  </BaseInput>
</template>

<style scoped>
  .input-group {
    height: fit-content;
  }
  .input-group-text{
    text-wrap: pretty;
    width: min-content;
  }
  .v-input{
    padding-right: -8px;
    align-content: end;
    padding-left: 1em;
    padding-right: 1em;
    margin-right: 0;
    overflow: visible;
  }
  .v-slider{
    margin-inline: 0!important;
  }
  .range-numbers>input[type="number"] {
    text-align: center;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .range-numbers>input:first-child {
    border-bottom-right-radius: 0;
  }
  .range-numbers>input:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>