<script setup>
  import BaseInput from './BaseInput.vue'
  const model = defineModel({ type: Boolean, required: true })

</script>

<template>
  <BaseInput>
    <div class="form-control">
      <div class="form-check form-switch">
        <input
          v-model="model"
          class="form-check-input "
          type="checkbox"
          role="switch"
        >
      </div>
    </div>
  </BaseInput>
</template>

<style scoped>
 div.form-check{
  justify-content: center;
  display: grid;
 }
</style>