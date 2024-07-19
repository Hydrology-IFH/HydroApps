<script setup>
  import { onMounted, ref } from 'vue'

  const decimals = defineModel({ required: true })
  const props = defineProps({
    name: String,
    tooltipMsg: String,
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
    new window.bootstrap.Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group mb-3">
    <span class="input-group-text" :id="`label_SliderDecimals_${id}`" ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name}}
    </span>
    <span class="form-control">
      <input type="range" class="form-range" name="SliderDecimals" :id="`SliderDecimals_{id}`" :min="min" :max="max"
        v-model.number="decimals"/>
    </span>
    <input type="number" class="form-control" name="SliderDecimalsNumber" :min="min" :max="max"
      v-model.number="decimals" style="max-width:70px" />
  </div>
</template>
