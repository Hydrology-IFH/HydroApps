<script setup>
  import BaseInput from './BaseInput.vue'

  const path = defineModel({ type: String, required: true })
  const full_path = defineModel("full_path", { type: String, required: false })
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
  })
  const id = props.label.replace(/\s/g, '_')

</script>

<template>
  <BaseInput :label="label">
    <input
      :id="`input_FileInput_${id}`"
      v-model="path"
      type="text"
      class="form-control"
      :name="`input_${label}`"
    >
    <span
      v-if="full_path"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      data-bs-title="As this setting is a sub path, it is combined with other path settings to become the full path displayed here"
    >
      {{ full_path }}
    </span>
  </BaseInput>
</template>
