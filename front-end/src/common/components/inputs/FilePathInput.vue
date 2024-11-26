<script setup>
  import { onMounted, ref } from 'vue'

  const path = defineModel({ required: true })
  const full_path = defineModel("full_path", { required: false })
  const props = defineProps({
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
    <span class="input-group-text" :id="`label_FileInput_${id}`" ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <input type="text" class="form-control" :name="`input_${name}`" :id="`input_FileInput_${id}`" v-model="path"/>
    <span class="input-group-text" v-if="full_path"
      data-bs-toggle="tooltip" data-bs-placement="top"
      data-bs-title="As this setting is a sub path, it is combined with other path settings to become the full path displayed here">
      {{full_path}}
    </span>
  </div>
</template>
