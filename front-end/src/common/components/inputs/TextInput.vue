<script setup>
  import BaseInput from './BaseInput.vue'
  const model = defineModel({ type: String, required: true })
  const props = defineProps({
    disabled: { type: Boolean, default: false }
  })

</script>

<template>
  <BaseInput>
    <input
      v-model="model"
      class="form-control"
      type="text"
      :disabled="props.disabled"
    >
  </BaseInput>
</template>
