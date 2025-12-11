<script setup>
  const model = defineModel({ type: String, required: true })
  const props = defineProps({
    addRemoverButton: { type: Boolean },
    addAdderButton: { type: Boolean }
  })
  const emits = defineEmits(['addPart', "removePart"])

</script>

<template>
  <div class="input-group">
    <input
      v-model="model"
      class="form-control"
      type="text"
      :disabled="props.disabled"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:text_part_input-remove_tooltip')"
    >
    <button
      v-if="props.addRemoverButton"
      type="button"
      class="btn btn-outline-secondary"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :data-bs-title="$t('common:text_part_input-add_tooltip')"
      @click="emits('removePart')"
    >
      <i class="btn bi-trash" />
    </button>
    <button
      v-if="props.addAdderButton"
      type="button"
      class="btn btn-outline-secondary"
      @click="emits('addPart')"
    >
      <i class="btn bi-plus" />
    </button>
  </div>
</template>

<style scoped>
  button.btn {
    padding: 0;
  }
</style>
