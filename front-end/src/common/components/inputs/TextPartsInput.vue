<script setup>
  import BaseInput from './BaseInput.vue'
  const model = defineModel({ type: Array[String], required: true })
  const props = defineProps({
    disabled: { type: Boolean, default: false }
  })

</script>

<template>
  <BaseInput>
    <input
      v-for="(textPart, index) in model"
      :key="index"
      v-model="model[index]"
      class="form-control"
      type="text"
      :disabled="props.disabled"
    >
    <input
      v-if="model.length === 0"
      v-model="model[0]"
      class="form-control"
      type="text"
      :disabled="props.disabled"
    >
    <button
      v-if="!props.disabled"
      type="button"
      class="btn btn-secondary mt-2"
      @click="model.push('')"
    >
      <i class="btn bi-plus" />
    </button>
  </BaseInput>
</template>
