<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: String,
    options: Object,
    tooltip: String,
    as_buttons: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    }
  });
  const model = defineModel()
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
  <div class="input-group mb-3">
    <span class="input-group-text" :id="`label_${id}`"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="tooltip">
      {{ label }}
    </span>
    <select class="form-select" :aria-label="label" v-model="model" v-if="!as_buttons" :disabled="!active" @change="$emit('change', $event)">
      <option v-for="value, opt_label in options_obj" :value="value">{{opt_label}}</option>
    </select>
    <button class="btn btn-stretch"
      v-if="as_buttons"
      v-for="(obj_label, key) in options_obj"
      :class="[(key == model)? 'btn-primary':'btn-secondary']"
      @click="model = key; $emit('change', $event)"
      :disabled="!active">
      {{obj_label}}
    </button>
    <slot name="after"></slot>
  </div>
</template>

<style scoped>
  .btn-stretch{
    flex: 1 1 auto;
  }
</style>