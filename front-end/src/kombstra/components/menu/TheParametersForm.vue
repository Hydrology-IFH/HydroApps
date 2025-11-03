<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~~/stores/layerLib/layerLib.js';
  import SliderInput from '~~/components/inputs/SliderInput.vue';
  import SelectionInput from '~~/components/inputs/SelectionInput.vue';
  import TheDailySRIDate from './TheDailySRIDate.vue';
  import TheDailySRIDuration from './TheDailySRIDuration.vue';

  const config = useConfig();
  const layerLib = useLayerLib();
  const formRef = ref(null);

  onMounted(() => {
    watch(
      () => config.parameter,
      (newVal) => {
        layerLib.selectLayer(newVal);
      },
      { immediate: true });

    new bootstrap.Tooltip(formRef.value, {
      selector: "[data-bs-toggle='tooltip']",
    });

    if (import.meta.env.MODE == 'development'){
      window.config = config;
    }
  });
</script>

<template>
  <form
    id="form_select_grid"
    ref="formRef"
    class="form-horizontal"
    action="javascript:void(0);"
  >
    <h4>{{ $t('map_form_header_grid') }}</h4>
    <div class="d-flex col-12">
      <p>{{ $t('map_form_explanation') }} <a href="./method">{{ $t('map_form_explanation_method') }}</a>.</p>
    </div>
    <SelectionInput
      v-model="config.parameter"
      :label="$t('parameter_label')"
      :options="[
        { key: 'event_sri', label: $t('parameter_option_event_SRI') },
        { key: 'duration', label: $t('parameter_option_duration') },
        { key: 'year', label: $t('parameter_option_year') },
        { key: 'month', label: $t('parameter_option_month') },
        { key: 'Top_SRI_year', label: $t('parameter_option_Top_SRI_year') },
        { key: 'NEvents_above_SRI', label: $t('parameter_option_NEvents_above_SRI') },
        { key: 'daily_sri', label: $t('parameter_option_daily_sri') },
      ]"
      :tooltip-msg="$t('parameter_tooltip')"
    />

    <SliderInput
      v-if="config.parameter === 'Top_SRI_year'"
      v-model="config.year"
      :label="$t('slider_year_label')"
      :min="config.spans.min_year"
      :max="config.spans.max_year"
      :tooltip-msg="$t('slider_year_tooltip')"
      num-field-width="90px"
    />
    <SliderInput
      v-else-if="config.parameter === 'NEvents_above_SRI'"
      v-model="config.sri"
      label="SRI"
      :min="1"
      :max="12"
      :tooltip-msg="$t('slider_sri_tooltip')"
      num-field-width="70px"
    />
    <SliderInput
      v-else-if="config.parameter !== 'daily_sri'"
      v-model="config.event_rank"
      :label="$t('slider_event_rank_label')"
      :min="1"
      :max="config.spans.max_rank"
      :tooltip-msg="$t('slider_event_rank_tooltip')"
      num-field-width="70px"
    />
    <span
      v-show="config.parameter === 'daily_sri'"
    >
      <TheDailySRIDate />
      <TheDailySRIDuration />
    </span>
  </form>

  <form
    id="form_map_settings"
    class="form-horizontal"
    action="javascript:void(0);"
  >
    <h4>{{ $t("map_form_header_map_settings") }}</h4>
    <SliderInput
      v-model="config.opacity"
      :label="$t('slider_opacity_label')"
      :min="0"
      :max="100"
      :tooltip-msg="$t('slider_opacity_tooltip')"
      num-field-width="80px"
      unit="%"
    />
  </form>
</template>




