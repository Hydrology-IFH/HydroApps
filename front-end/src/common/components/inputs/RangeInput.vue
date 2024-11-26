<script setup>
  import { onMounted, ref, computed } from 'vue'
  import { get_reasonable_digits } from '../utils/reasonable_digits'

  const range = defineModel({required: true})
  const props = defineProps({
    name: String,
    min: {Number, default: 0},
    max: {Number, default: 100},
    tooltipMsg: String,
  })
  const label_dom = ref(null)

  const digits = computed(() => get_reasonable_digits(props.min, props.max))
  const step = computed(() => Math.pow(10, -digits.value))
  const id = computed(() => props.name.replace(/\s/g, '_'))

  const minr = computed(() => Math.min(
    Math.floor(props.min * Math.pow(10, digits.value)) / Math.pow(10, digits.value),
    range.value[0])
  )
  const maxr = computed(() => Math.max(
    Math.ceil(props.max * Math.pow(10, digits.value)) / Math.pow(10, digits.value),
    range.value[1])
  )

  onMounted(() => {
    new window.bootstrap.Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group mb-3">
    <span class="input-group-text" :id="`label_RangeInput_${id}`" ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <div class="form-control flex-column d-flex pl-0 pr-0 pb-0">
      <v-range-slider v-model="range" :min="minr" :max="maxr" :step="step"
        hide-details color="var(--bs-primary)" :strict="true"
      ></v-range-slider>
      <div class="d-flex flex-fill range-numbers">
        <input type="number" class="form-control" :min="minr" :max="maxr"
          v-model.number.lazy="range[0]"/>
        <input type="number" class="form-control" :min="minr" :max="maxr"
          v-model.number.lazy="range[1]" />
      </div>
    </div>
    </div>
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