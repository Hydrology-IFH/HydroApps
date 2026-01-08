<script setup>
  import { computed, ref, onMounted } from 'vue';

  import BaseInput from './BaseInput.vue';
  import SelectionButton from './utils/SelectionButton.vue';

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
  const emits = defineEmits(['change']);

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

  // add arrow listener
  const selectRef = ref(null);
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      let currentIndex = optionsCleaned.value.map(option => option.key).indexOf(model.value);
      let nextIndex;
      if (props.asButtons) {
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % optionsCleaned.value.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + optionsCleaned.value.length) % optionsCleaned.value.length;
        }
      } else {
        if (event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % optionsCleaned.value.length;
        } else if (event.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + optionsCleaned.value.length) % optionsCleaned.value.length;
        }
      }
      if (nextIndex == undefined) {
        console.warn("Unhandled arrow key:", event.key);
        return;
      }
      model.value = optionsCleaned.value[nextIndex].key;
      emits('change', optionsCleaned.value[nextIndex].key);
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const addMouseEventListeners = (event) => {
    window.addEventListener('keydown', handleKeyDown);
    event.target.addEventListener('focusout', () => {
      window.removeEventListener('keydown', handleKeyDown);
    });
  };

</script>

<template>
  <BaseInput :label="label">
    <template
      v-if="asButtons"
    >
      <SelectionButton
        v-for="option in optionsCleaned"
        :key="option.key"
        v-model="model"
        :button-key="option.key"
        :label="option.label"
        :active="active"
        @change="$emit('change', $event)"
        @focus="addMouseEventListeners"
      />
    </template>
    <select
      v-else
      ref="selectRef"
      v-model="model"
      class="form-select"
      :aria-label="label"
      :disabled="!active"
      @change="$emit('change', $event)"
      @focus="addMouseEventListeners"
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