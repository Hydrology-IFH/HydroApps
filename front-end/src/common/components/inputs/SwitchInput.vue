<script setup>
  import { onMounted, ref } from 'vue'

  const model = defineModel({ required: true })
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
    <span class="input-group-text" :id="`label_Select${id}`"
        ref="label_dom"
        data-bs-toggle="tooltip" data-bs-placement="top"
        :data-bs-title="tooltipMsg">
      {{ name }}
    </span>
    <div class="form-control">
      <div class="form-check form-switch">
        <input class="form-check-input " type="checkbox" role="switch" v-model="model" >
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