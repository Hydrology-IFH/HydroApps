<script setup>
import { disable } from 'ol/rotationconstraint';

  const selection = defineModel({ type: [String, null], required: true })
  const props = defineProps({
    options: { type: Array[String], required: true },
    disabled: { type: Boolean, default: false },
    addEmpty: { type: Boolean, default: false },
    id: { type: String, required: true },
    addChevron: { type: Boolean, default: true },
  })
</script>

<template>
  <div
    v-if="options.length > 0"
    class="select-group"
  >
    <i
      v-if="addChevron"
      class="bi bi-chevron-right"
    />
    <select
      :id="`Select_${id}`"
      v-model="selection"
      class="form-select"
      :name="`Select_${id}`"
      :disabled="props.disabled"
    >
      <option
        v-if="addEmpty"
        value=""
        :selected="selection === null || selection === ''"
      />
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :active="option.value === selection"
      >
        {{ option.label ? option.label : option.value }}
      </option>
    </select>
  </div>
</template>

<style scoped>
  .select-group{
    min-width: fit-content;
    flex-wrap: nowrap;
    flex-basis: 1em;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    align-items: center;
  }
  select:disabled{
    background-image: none;
  }
</style>