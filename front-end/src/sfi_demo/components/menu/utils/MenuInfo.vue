<script setup>
  import { ref, computed } from 'vue';

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true
    },
    tooltip: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    active: {
      type: Boolean,
      default: true
    }
  });

  const id = computed(() => props.label.replace(/ /g, '_').toLowerCase());

</script>

<template>
  <div
    class="input-group mb-3"
    :disabled="!active"
  >
    <span
      :id="`label_${id}`"
      class="input-group-text"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      data-bs-container="body"
      data-bs-html="true"
      :data-bs-title="tooltip"
    >
      {{ label }}
    </span>
    <input
      class="form-control"
      :type="type"
      :value="msg"
      aria-label="readonly input example"
      readonly
      :disabled="!active"
    >
  </div>
</template>

<style scoped>
  .btn-stretch{
    flex: 1 1 auto;
  }
  .input-group[disabled=true] .input-group-text {
    color: var(--bs-gray-600);
  }
</style>