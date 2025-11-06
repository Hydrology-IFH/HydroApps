<script setup>
  import { computed } from 'vue';

  import BaseInput from './BaseInput.vue';

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    options: {
      type: Array[Object] || Object,
      default: () => ([])
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

  const optionsCleaned = computed(() => {
    if (Array.isArray(props.options)) {
      return props.options.map((option) => {
        return {
          key: option.key ? option.key : option,
          label: option.label ? option.label : option
        };
      });
    } else if (typeof props.options === 'object') {
        return Object.keys(props.options).map((key) => {
          return {
            key: key,
            label: props.options[key]
          };
        });
      }
    return [];
  });

</script>

<template>
  <BaseInput :label="label">
    <select
      v-if="!asButtons"
      v-model="model"
      class="form-select"
      :aria-label="label"
      :disabled="!active"
      @change="$emit('change', $event)"
    >
      <option
        v-for="option in optionsCleaned"
        :key="option.key"
        :value="option.key"
        :selected="option.key == model"
      >
        {{ option.label }}
      </option>
    </select>
    <template
      v-if="asButtons"
    >
      <button
        v-for="option in optionsCleaned"
        :key="option.key"
        class="btn btn-stretch"
        :class="[(option.key == model) ? 'btn-primary':'btn-secondary']"
        :disabled="!active"
        @click="model = option.key; $emit('change', $event)"
      >
        {{ option.label ? option.label : option }}
      </button>
    </template>
    <slot name="after" />
  </BaseInput>
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