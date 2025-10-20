<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import { useLayerLib } from '~~/stores/layerLib/layerLib.js';

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
    <div class="form-group input-group mb-3">
      <span
        id="label_parameter"
        class="input-group-text"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-container="body"
        data-bs-html="true"
        :data-bs-title="$t('parameter_tooltip')"
      >{{ $t("parameter_label") }}</span>
      <select
        id="parameter"
        v-model="config.parameter"
        class="form-select"
        name="parameter"
        @update="layerLib.selectLayer(config.parameter)"
      >
        <option
          value="sri"
        >
          {{ $t("parameter_option_SRI") }}
        </option>
        <option value="duration">
          {{ $t("parameter_option_duration") }}
        </option>
        <option value="year">
          {{ $t("parameter_option_year") }}
        </option>
        <option value="month">
          {{ $t("parameter_option_month") }}
        </option>
        <option value="Top_SRI_year">
          {{ $t("parameter_option_Top_SRI_year") }}
        </option>
        <option value="NEvents_above_SRI">
          {{ $t("parameter_option_NEvents_above_SRI") }}
        </option>
      </select>
    </div>

    <div
      v-if="config.parameter === 'Top_SRI_year'"
      class="form-group input-group mb-3"
    >
      <span
        id="label_SliderYear"
        class="input-group-text"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-container="body"
        data-bs-html="true"
        :data-bs-title="$t('slider_year_tooltip')"
      >{{ $t("slider_year_label") }}</span>
      <span class="form-control">
        <input
          id="SliderYear"
          v-model.number="config.year"
          type="range"
          class="form-range"
          name="SliderYearRange"
          :min="config.spans.min_year"
          :max="config.spans.max_year"
        >
      </span>
      <input
        v-model.number="config.year"
        type="number"
        class="form-control"
        name="SliderYearNumber"
        :min="config.spans.min_year"
        :max="config.spans.max_year"
        style="max-width:90px"
      >
    </div>

    <div
      v-else-if="config.parameter === 'NEvents_above_SRI'"
      class="form-group input-group mb-3"
    >
      <span
        id="label_SliderSRI"
        class="input-group-text"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-container="body"
        data-bs-html="true"
        :data-bs-title="$t('slider_sri_tooltip')"
      >SRI</span>
      <span class="form-control">
        <input
          id="SliderSRI"
          v-model.number="config.sri"
          type="range"
          class="form-range"
          name="SliderSRIRange"
          min="1"
          max="12"
        >
      </span>
      <input
        v-model.number="config.sri"
        type="number"
        class="form-control"
        name="SliderSRINumber"
        min="1"
        max="12"
        style="max-width:70px"
      >
    </div>

    <div
      v-else
      class="form-group input-group mb-3"
    >
      <span
        id="label_eventRank"
        class="input-group-text"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-container="body"
        data-bs-html="true"
        :data-bs-title="$t('slider_event_rank_tooltip')"
      >{{ $t("slider_event_rank_label") }}</span>
      <span class="form-control">
        <input
          id="eventRank"
          v-model.number="config.event_rank"
          type="range"
          class="form-range"
          name="eventRankRange"
          min="1"
          :max="config.spans.max_rank"
        >
      </span>
      <input
        v-model.number="config.event_rank"
        type="number"
        class="form-control"
        name="eventRankNumber"
        min="1"
        :max="config.spans.max_rank"
        style="max-width:70px"
      >
    </div>
  </form>

  <form
    id="form_map_settings"
    class="form-horizontal"
    action="javascript:void(0);"
  >
    <h4>{{ $t("map_form_header_map_settings") }}</h4>
    <div class="form-group input-group mb-3">
      <span
        id="label_opacity"
        class="input-group-text"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-container="body"
        data-bs-html="true"
        :data-bs-title="$t('slider_opactity_tooltip')"
      >{{ $t("slider_opacity_label") }}</span>
      <span class="form-control">
        <input
          id="Opacity"
          v-model.number="config.opacity"
          type="range"
          class="form-range"
          name="OpacityRange"
          min="0"
          max="100"
          value="100"
        >
      </span>
      <input
        v-model.number="config.opacity"
        type="number"
        class="form-control"
        name="OpacityNumber"
        min="0"
        max="100"
        value="100"
        style="max-width:80px"
      >
      <span class="input-group-text">%</span>
    </div>
  </form>
</template>




