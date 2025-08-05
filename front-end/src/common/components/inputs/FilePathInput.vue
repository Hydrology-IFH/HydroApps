<script setup>
  import { onMounted, ref } from 'vue'

  const path = defineModel({ type: String, required: true })
  const full_path = defineModel("full_path", { type: String, required: false })
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    tooltipMsg: {
      type: String,
      required: false,
      default: ""
    }
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
      :id="`label_FileInput_${id}`"
      ref="label_dom"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="tooltipMsg"
    >
      {{ name }}
    </span>
    <input
      :id="`input_FileInput_${id}`"
      v-model="path"
      type="text"
      class="form-control"
      :name="`input_${name}`"
    />
    <span
      v-if="full_path"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      data-bs-title="As this setting is a sub path, it is combined with other path settings to become the full path displayed here"
    >
      {{full_path}}
    </span>
  </div>
</template>
