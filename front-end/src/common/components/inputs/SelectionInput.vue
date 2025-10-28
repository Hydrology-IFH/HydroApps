<script setup>
  import BaseInput from './BaseInput.vue'

  const selected = defineModel({ type: String, required: true })
  const props = defineProps({
    options: { type: Array[String] || Array[Object], required: true },
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
        :key="option.key ? option.key : option"
        :value="option.key ? option.key : option"
        :active="option.key ? option.key == selected : option == selected"
      >
        {{ option.label ? option.label : option }}
      </option>
    </select>
  </BaseInput>
</template>