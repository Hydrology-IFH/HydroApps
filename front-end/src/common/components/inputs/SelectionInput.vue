<script setup>
  import { computed, ref, onMounted } from 'vue';

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
  const buttonsRef = ref({});
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
        if (!nextIndex) {
          console.warn("Unhandled arrow key:", event.key);
          return;
        }
        model.value = optionsCleaned.value[nextIndex].key;
        emits('change', optionsCleaned.value[nextIndex].key);
        event.preventDefault();
        event.stopPropagation();
      }
    };
  const addEventListeners = (refObj) => {
    refObj.value.addEventListener('focus', () => {
      window.addEventListener('keydown', handleKeyDown);
      refObj.value.addEventListener('focusout', () => {
        window.removeEventListener('keydown', handleKeyDown);
      });
    });
  };

  onMounted(() => {
    window.selectRef = selectRef;
    if (props.asButtons) {
      Object.keys(buttonsRef.value).forEach((key) => {
        addEventListeners(buttonsRef.value[key]);
      });
    } else {
      addEventListeners(selectRef);
    }
  });


</script>

<template>
  <BaseInput :label="label">
    <select
      v-if="!asButtons"
      ref="selectRef"
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
        ref="buttonsRef[option.key]"
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