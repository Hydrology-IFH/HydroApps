<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    tooltip: {
      type: String,
      default: ''
    },
    asButtons: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    }
  });
  const model = defineModel({
    type: [String, Number],
    default: () => []
  });
  defineEmits(['change']);

  const id = computed(() => props.label.replace(/ /g, '_').toLowerCase());

  const options_obj = computed(() => {
    if (Array.isArray(props.options)) {
      return Object.fromEntries(props.options.map((option) => [option, option]));
    }
    return props.options;
  });

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
    <select
      v-if="!asButtons"
      v-model="model"
      class="form-select"
      :aria-label="label"
      :disabled="!active"
      @change="$emit('change', $event)"
    >
      <option
        v-for="value, opt_label in options_obj"
        :key="value"
        :value="value"
      >
        {{ opt_label }}
      </option>
    </select>
    <template
      v-if="asButtons"
    >
      <button
        v-for="(obj_label, key) in options_obj"
        :key="key"
        class="btn btn-stretch"
        :class="[(key == model)? 'btn-primary':'btn-secondary']"
        :disabled="!active"
        @click="model = key; $emit('change', $event)"
      >
        {{ obj_label }}
      </button>
    </template>
    <slot name="after" />
  </div>
</template>

<style scoped>
  .btn-stretch{
    flex: 1 1 auto;
  }
  .input-group[disabled=true] .input-group-text {
    color: var(--bs-gray-600);
  }
  .input-group[disabled=true] select {
    color: var(--bs-gray-600);
  }
</style>