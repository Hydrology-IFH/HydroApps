<script setup>
  import { onMounted, ref } from 'vue'
  const selected = defineModel({ type: String, required: true })
  const props = defineProps({
    options: { type: Array[String], required: true },
    name: { type: String, required: true },
    tooltipMsg: { type: String, required: true }
  })
  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  onMounted(() => {
    new window.bootstrap.Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group mb-3">
    <span
      :id="`label_Select${id}`"
      ref="label_dom"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="tooltipMsg"
    >
      {{ name }}
    </span>
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
  </div>
</template>