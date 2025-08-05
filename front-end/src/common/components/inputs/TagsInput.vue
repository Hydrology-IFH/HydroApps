<script setup>
  import { VAutocomplete } from 'vuetify/components/VAutocomplete';
  import { mdiTagMultiple } from '@mdi/js';
  import InputBase from './BaseInput.vue';

  // define model for selected tags
  const selectedTags = defineModel({
    type: Array[String],
    default: () => []
  });

  // define props
  const props = defineProps({
    validTags: { type: Array[String], required: true }
  })

</script>

<template>
  <InputBase>
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
  </InputBase>
</template>