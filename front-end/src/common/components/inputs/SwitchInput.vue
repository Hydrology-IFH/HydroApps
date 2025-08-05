<script setup>
  import { onMounted, ref } from 'vue'

  const model = defineModel({ type: Boolean, required: true })
  const props = defineProps({
    name: { type: String, required: true },
    tooltipMsg: { type: String, default: "" }
  })
  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  onMounted(() => {
    if (props.tooltipMsg != "") {
      new window.bootstrap.Tooltip(label_dom.value)
    }
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
    <div class="form-control">
      <div class="form-check form-switch">
        <input
          v-model="model"
          class="form-check-input "
          type="checkbox"
          role="switch"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
 div.form-check{
  justify-content: center;
  display: grid;
 }
</style>