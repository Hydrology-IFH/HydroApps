<script setup>
  import { ref } from 'vue';

  defineProps({
    label: String,
    min: Number,
    max: Number,
    step: Number,
    ticks: Object,
    getLabel: Function,
    tooltip: String,
    active: { Boolean, default: true },
    getTickTooltips: { Function, default: undefined }
  });
  const model = defineModel();
  const emit = defineEmits(['update:focused']);

  const isFolded = ref(false);

</script>

<template>
  <div class="input-group-vertical mb-3" :disabled="!active">
    <span class="input-group-text" :id="`label_${label}`"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="tooltip">
      {{ label }}
      <button @click.left="isFolded = !isFolded">
        <i class="bi" :class="{ 'bi-chevron-down': isFolded, 'bi-chevron-up': !isFolded}"></i>
      </button>
    </span>
    <div class="form-control" v-if="!isFolded">
      <v-slider
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        :thumb-label="true"
        :persistent-hint="true"
        :elevation="5"
        hide-error
        :ticks="ticks"
        density="compact"
        hide-details="auto"
        show-ticks="always"
        class="menu-slider"
        @update:focused="$emit('update:focused', $event)"
        :disabled="!active"
        >

        <template v-slot:thumb-label="{ modelValue }">
          {{ getLabel(modelValue) }}
        </template>

        <template v-slot:tick-label="{ tick }" v-if="getTickTooltips != undefined">
          <div v-if="getTickTooltips != undefined"
              data-bs-toggle="tooltip" data-bs-placement="bottom"
              data-bs-container="body" data-bs-html="true"
              :data-bs-title="getTickTooltips(tick.value)">
              {{ tick.label }}
          </div>
        </template>

      </v-slider>
    </div>
  </div>
</template>

<style scoped>
  .input-group-vertical{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .input-group-vertical .input-group-text{
    width: 100%;
    position: relative;
  }
  .input-group-vertical>.form-control{
    padding-left: 0.3em;
    padding-bottom: 1em;
  }
  .input-group-vertical>:first-child:not(:last-child){
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .input-group-vertical>div:last-child{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .input-group-vertical>div:not(:first-child){
    border-top: 0;
  }
  .v-slider-thumb__label-container{
    width: 100%
  }
  .input-group-vertical span.input-group-text>button{
    position: absolute;
    right: 0.5em;
    color:black;
    :hover{
      color: var(--bs-primary);
    }
  }
  .input-group-vertical[disabled=true] .input-group-text {
    color: var(--bs-gray-600);
  }
</style>

<style>
  .v-slider-thumb__label{
    width: fit-content;
    height: fit-content;
    text-wrap: nowrap;
  }
  .menu-slider.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-track__ticks>.v-slider-track__tick--first>.v-slider-track__tick-label{
    transform: translateX(-0.5em);
  }
  .menu-slider.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-track__ticks>.v-slider-track__tick--last>.v-slider-track__tick-label{
    transform: translateX(-100%) translateX(1em);
  }
</style>