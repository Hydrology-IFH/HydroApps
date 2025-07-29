<script setup>
  import { onMounted, ref } from 'vue'
  import { VAutocomplete } from 'vuetify/components/VAutocomplete';
  import { mdiTagMultiple } from '@mdi/js'

  // define model for selected tags
  const selectedTags = defineModel({
    type: Array[String],
    default: () => []
  });

  // define props
  const props = defineProps({
    validTags: { type: Array[String], required: true },
    name: { type: String, required: true },
    label: { type: String, default: 'Select Tags' },
    tooltipMsg: { type: String, required: true }
  })

  const id = props.name.replace(/\s/g, '_')
  const label_dom = ref(null)

  // Initialize Bootstrap tooltip
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
      style="padding: 0;"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="tooltipMsg"
    >
      {{ name }}
    </span>
    <VAutocomplete
      v-model="selectedTags"
      class="form-control"
      style="border-top-left-radius: 0; padding:0;"
      :clearable="true"
      icon-color="#000"
      :closable-chips="true"
      :prepend-inner-icon="mdiTagMultiple"
      chips
      multiple
      :items="validTags"
      density="comfortable"
      hide-details
      variant="filled"
    />
  </div>
</template>