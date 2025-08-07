<script setup>
  const selection = defineModel({ type: String || null, required: true })
  const props = defineProps({
    options: { type: Array[String], required: true },
    selectionId: { type: String, required: true },
    index: { type: Number, required: true }
  })
  console.log("SelectionPart props:", props)
</script>

<template>
  <select
    v-if="options.length > 0"
    :id="`Select${selectionId}_${index}`"
    v-model="selection"
    class="form-select form-control"
    :name="`Select${selectionId}`"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :active="option.value === selection"
    >
      {{ option.label ? option.label : option.value }}
    </option>
  </select>
</template>