<script setup>
  import { computed } from 'vue'

  import BaseInput from './BaseInput.vue'
  import TextPart from './utils/TextPart.vue'

  const model = defineModel({ type: Array[String], required: true })
  const props = defineProps({
    disabled: { type: Boolean, default: false }
  })

  const firstPart = computed({
    get: () => model.value[0] ?? '',
    set: (value) => {
      if (model.value.length === 0) {
        if (value !== '') model.value.push(value);
      } else {
        if (value === '') {
          model.value.shift()
        } else {
         model.value[0] = value
        }
      }
    }
  })

</script>

<template>
  <BaseInput>
    <div class="form-control text-part-input-container">
      <TextPart
        v-model="firstPart"
        :disabled="props.disabled"
        :add-adder-button="(!props.disabled) && (model.length > 0)"
        :add-remover-button="(!props.disabled) && (model.length > 0)"
        @add-part="model.splice(1, 0, '')"
        @remove-part="model.shift()"
      />
      <template
        v-if="model.length > 1"
      >
        <TextPart
          v-for="(textPart, index) in model.slice(1)"
          :key="index"
          v-model="model[index+1]"
          :disabled="props.disabled"
          :add-remover-button="!props.disabled"
          :add-adder-button="!props.disabled"
          @add-part="model.splice(index + 2, 0, '')"
          @remove-part="model.splice(index + 1, 1)"
        />
      </template>
      <!--  -->
    </div>
  </BaseInput>
</template>

<style>
  .text-part-input-container{
    margin: 0;
    padding: 0;
  }
  .text-part-input-container > .input-group{
    border: none;
    box-shadow: none;
    padding: 0;
    margin: -1px;
    width: calc(100% + 2px);
    border-radius: 0;
  }
  .text-part-input-container > .input-group > * {
    border-radius: 0;
  }
  .text-part-input-container > .input-group:first-of-type > :last-child{
    border-top-right-radius: var(--bs-border-radius) ;
  }
  .text-part-input-container > .input-group:last-of-type > :last-child{
    border-bottom-right-radius: var(--bs-border-radius) ;
  }
</style>