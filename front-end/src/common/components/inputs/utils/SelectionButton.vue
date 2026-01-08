<script setup>
  import { ref } from 'vue';

  const selection = defineModel({ type: [String, null], required: true })
  const props = defineProps({
    buttonKey: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: true },
  })
  const emit = defineEmits(['select']);
  const buttonRef = ref(null);
  const select = () => {
    selection.value = props.buttonKey;
    buttonRef.value.focus();
    emit('select', props.buttonKey);
  };
</script>

<template>
  <button
    ref="buttonRef"
    class="btn btn-stretch"
    :class="[(buttonKey == selection) ? 'btn-primary':'btn-secondary']"
    :disabled="!active"
    @click="select"
  >
    {{ label }}
  </button>
</template>