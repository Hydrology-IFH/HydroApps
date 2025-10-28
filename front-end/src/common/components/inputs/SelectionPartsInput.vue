<script setup>
  import { watch, ref } from 'vue'
  import BaseInput from './BaseInput.vue'
  import BaseSelectionPart from './BaseSelectionPart.vue'

  const model = defineModel({ type: Array[String], required: true })
  const props = defineProps({
    options: { type: Array[Object], required: true }, // Objects of type { value: String, label: String, parentValue: String }
    label: { type: String, required: true },
  })
  const id = props.label.replace(/\s/g, '_')
  const newSelection = ref("")

  watch(newSelection, (newValue) => {
    if (newValue !== null && newValue !== "") {
      // Use spread operator to create a new array reference for better reactivity
      model.value = [...model.value, newValue];
      newSelection.value = ""; // Reset newSelection after adding
    }
  });

  // Debug model changes
  watch(model, (newValue) => {
    console.log('Model changed:', newValue);
  }, { deep: true });

</script>

<template>
  <BaseInput :label="label">
    <BaseSelectionPart
      v-for="(selection, index) in model"
      :key="`existing-${index}`"
      v-model="model[index]"
      :options="options.filter((opt) => index==0? opt.parentValue === null : opt.parentValue === model[index-1])"
      :selection-id="id"
      :index="index"
    />
    <BaseSelectionPart
      key="new-selection"
      v-model="newSelection"
      :options="options.filter((opt) => model.length==0? opt.parentValue === null : opt.parentValue === model[model.length-1])"
      :selection-id="id"
      :index="10"
    />
  </BaseInput>
</template>