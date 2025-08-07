<script setup>
  import { VAutocomplete } from 'vuetify/components/VAutocomplete';
  import { mdiTagMultiple } from '@mdi/js';
  import InputBase from './BaseInput.vue';

  // define model for selected tags
  const selectedTags = defineModel({
    type: Array[String],
    default: () => [],
  });

  // define props
  const props = defineProps({
    validTags: { type: Array[String], required: true },
    disabled: { type: Boolean, default: false }
  })

</script>

<template>
  <InputBase>
    <VAutocomplete
      v-model="selectedTags"
      class="form-control"
      style="border-top-left-radius: 0; padding:0;"
      :clearable="!disabled"
      icon-color="#000"
      :closable-chips="!disabled"
      :prepend-inner-icon="mdiTagMultiple"
      chips
      multiple
      :items="validTags"
      density="comfortable"
      hide-details
      variant="filled"
      :disabled="disabled"
    />
  </InputBase>
</template>