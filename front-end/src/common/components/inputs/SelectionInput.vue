<script setup>
  import BaseInput from './BaseInput.vue'

  const selected = defineModel({ type: String, required: true })
  const props = defineProps({
    options: { type: Array[String], required: true },
    label: { type: String, required: true },
  })
  const id = props.label.replace(/\s/g, '_')


</script>

<template>
  <BaseInput :label="label">
    <select
      :id="`Select${id}`"
      v-model="selected"
      class="form-select form-control"
      :name="`Select${id}`"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :active="option == selected"
      >
        {{ option }}
      </option>
    </select>
  </BaseInput>
</template>