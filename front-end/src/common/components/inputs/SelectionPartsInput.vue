<script setup>
  import { watch, ref, onMounted } from 'vue'
  import BaseInput from './BaseInput.vue'
  import SelectionPart from './utils/SelectionPart.vue'
import { disable } from 'ol/rotationconstraint'

  const model = defineModel({ type: Array[String], required: true })
  const props = defineProps({
    options: { type: Array[Object], required: true }, // Objects of type { value: String, label: String, parentValue: String }
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    cleareableTooltip: { type: String, default: 'Clear Entry' }
  })
  const id = props.label.replace(/\s/g, '_')
  const newSelection = ref(null)
  const internModel = ref([...model.value]); // Create a reactive copy of the model
  const clearButton = ref(null)

  // Watch for changes in newSelection and update model accordingly
  watch(newSelection, (newValue) => {
    if (newValue !== null && newValue !== "") {
      model.value = [...model.value, newValue];
      newSelection.value = null; // Reset newSelection after adding
    }
  });

  // Keep internModel in sync
  watch(model, (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(internModel.value)) {
      internModel.value = [...newValue];
    }
  }, { deep: true });
  // Keep model in sync with internModel
  watch(internModel, (newValue) => {
    let newModel = [...newValue].filter(item => item !== null && item !== ""); // Filter out null and empty strings
    if (JSON.stringify(newModel) !== JSON.stringify(model.value)) {
      model.value = [...newModel];
    }
  }, { deep: true });

  // Initialize Bootstrap tooltips
  onMounted(() => {
    bootstrap.Tooltip.getInstance(clearButton.value);
  });

</script>

<template>
  <BaseInput :label="label">
    <span class="form-control flex-wrapper">
      <SelectionPart
        v-for="(selection, index) in internModel"
        :id="`${id}_${index}`"
        :key="`existing-${index}`"
        v-model="internModel[index]"
        :disabled="disabled"
        :options="options.filter((opt) => index==0? opt.parentValue === null : opt.parentValue === internModel[index-1])"
        :add-empty="index > 0"
        :add-chevron="index > 0"
      />
      <SelectionPart
        id="new-selection"
        key="new-selection"
        v-model="newSelection"
        :disabled="disabled"
        :options="options.filter((opt) => model.length==0? opt.parentValue === null : opt.parentValue === model[model.length-1])"
        :add-chevron="model.length>0"
        add-empty
      />
    </span>
    <button
      v-show="clearable && model.length > 0"
      ref="clearButton"
      type="button"
      class="btn btn-outline-secondary btn-sm"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="cleareableTooltip"
      @click="model = []"
    >
      <i class="bi bi-x" />
    </button>
  </BaseInput>
</template>

<style scoped>
  .flex-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: start;
  }
</style>