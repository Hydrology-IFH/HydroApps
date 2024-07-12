<script setup>
  defineProps({
    label: String,
    min: Number,
    max: Number,
    step: Number,
    ticks: Object,
    getLabel: Function,
    tooltip: String,
    getTickTooltips: {Function, default: undefined}
  });
  const model = defineModel()
</script>
<template>
  <div class="input-group-vertical mb-3">
    <span class="input-group-text" id="label_SoilMoisture"
        data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="tooltip">{{ label }}</span>
    <div class="form-control">
      <v-slider
        v-model="model"
        :min="min"
        :max="max"
        :step="step"
        :thumb-label="true"
        :hint="true"
        :persistent-hint="true"
        :elevation="5"
        hide-error
        :ticks="ticks"
        density="compact"
        hide-details="auto"
        show-ticks="always"
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
  }
  .input-group-vertical>.form-control{
    padding-left: 0.3em;
    padding-bottom: 1em;
  }
  .input-group-vertical>:first-child{
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
</style>
<style>
  .v-slider-thumb__label{
    width: fit-content;
    height: fit-content;
    text-wrap: nowrap;
  }
</style>