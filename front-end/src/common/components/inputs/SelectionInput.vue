<script setup>
  import { onMounted, ref } from 'vue'
  const selected = defineModel({ required: true })
  const props = defineProps({
    options: Array[String],
    name: String,
    tooltipMsg: String
  })
  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  onMounted(() => {
    new window.bootstrap.Tooltip(label_dom.value)
  })
</script>

<template>
  <div class="input-group mb-3">
    <span class="input-group-text" :id="`label_Select${id}`"
        ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <select class="form-select form-control" :name="`Select${id}`" :id="`Select${id}`"
      v-model="selected">
      <option v-for="option in options" :key="option" :value="option" :active="option == selected">{{ option }}</option>
    </select>
  </div>
</template>