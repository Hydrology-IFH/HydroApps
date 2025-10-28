<script setup>
  import { computed, watch, ref } from 'vue'
  import BaseInput from './BaseInput.vue'
  import BaseSelectionPart from './BaseSelectionPart.vue'

  const model = defineModel({ type: Array[String], required: true })
  const props = defineProps({
    options: { type: Array[Object], required: true }, // Objects of type { value: String, label: String, parentValue: String }
    label: { type: String, required: true },
  })
  const id = props.label.replace(/\s/g, '_')
  const newSelection = ref("")

  // const selectionsPlus = ref([...model.value, null])

  // watch(model, (newValue) => {
  //   console.log("model changed:", newValue);
  //   selectionsPlus.value = [...newValue, null]
  // }, { deep: true, immediate: true });

  // watch(selectionsPlus, (newValue) => {
  //   console.log("selectionsPlus changed:", newValue);
  //   if (selectionsPlus.value.slice(-1)[0] !== null) {
  //     selectionsPlus.value.push(null); // Ensure the last element is null
  //   }
  //   model.value = newValue.slice(0, -1);
  // }, { deep: true });
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

  // window.selectionsPlus = selectionsPlus; // For debugging purposes
  window.model = model; // For debugging purposes
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
    <!-- <select
      v-for="(selection, index) in selectionsPlus"
      :id="`Select${id}_${index}`"
      :key="index"
      v-model="selectionsPlus[index]"
      class="form-select form-control"
      :name="`Select${id}`"
    >
      <option
        v-for="option in options.filter((opt) => index==0? opt.parentValue === null : opt.parentValue === selectionsPlus[index-1])"
        :key="option.value"
        :value="option.value"
        :active="option.value === selection"
      >
        {{ option.label ? option.label : option.value }}
      </option>
    </select> -->
  </BaseInput>
</template>