<script>
import { ref } from 'vue';

export const parameter = ref('sri');
export const year = ref(2010);
export const sri = ref(6);
export const event_rank = ref(1);
export const opacity = ref(100);
export const basemap = ref('basemap_grey');

export default {
  data: function () {
    return {
      parameter: parameter,
      year: year,
      sri: sri,
      event_rank: event_rank,
      opacity: opacity,
      basemap: basemap,
      spans: spans
    }
  },
  mounted() {
    new bootstrap.Tooltip(this.$el.parentElement, {
      selector: "[data-bs-toggle='tooltip']",
    });
  },
}
</script>

<template>
  <form id="form_select_grid" class="form-horizontal" action="javascript:void(0);">
    <h4>{{ $t('map_form_header_grid') }}</h4>
    <div class="d-flex col-12">
      <p>{{ $t('map_form_explanation') }} <a href="./method">{{ $t('map_form_explanation_method') }}</a>.</p>
    </div>
    <div class="form-group input-group mb-3">
      <span class="input-group-text" id="label_parameter" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="$t('parameter_tooltip')">{{ $t("parameter_label") }}</span>
      <select class="form-select" id="parameter" name="parameter" v-model="parameter">
        <option value="sri" selected>{{ $t("parameter_option_SRI") }}</option>
        <option value="duration">{{ $t("parameter_option_duration") }}</option>
        <option value="year">{{ $t("parameter_option_year") }}</option>
        <option value="month">{{ $t("parameter_option_month") }}</option>
        <option value="Top_SRI_year">{{ $t("parameter_option_Top_SRI_year") }}</option>
        <option value="NEvents_above_SRI">{{ $t("parameter_option_NEvents_above_SRI") }}</option>
      </select>
    </div>

    <div class="form-group input-group mb-3" v-if="parameter === 'Top_SRI_year'">
      <span class="input-group-text" id="label_SliderYear" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="$t('slider_year_tooltip')">{{ $t("slider_year_label") }}</span>
      <span class="form-control">
        <input type="range" class="form-range" name="SliderYearRange" id="SliderYear" :min="spans.min_year" :max="spans.max_year"
          v-model="year" />
      </span>
      <input type="number" class="form-control" name="SliderYearNumber" :min="spans.min_year" :max="spans.max_year" v-model="year"
        style="max-width:90px" />
    </div>

    <div class="form-group input-group mb-3" v-else-if="parameter === 'NEvents_above_SRI'">
      <span class="input-group-text" id="label_SliderSRI" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="$t('slider_sri_tooltip')">SRI</span>
      <span class="form-control">
        <input type="range" class="form-range" name="SliderSRIRange" id="SliderSRI" min="1" max="12" v-model="sri" />
      </span>
      <input type="number" class="form-control" name="SliderSRINumber" min="1" max="12" v-model="sri"
        style="max-width:70px" />
    </div>

    <div class="form-group input-group mb-3" v-else>
      <span class="input-group-text" id="label_eventRank" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="$t('slider_event_rank_tooltip')">{{ $t("slider_event_rank_label") }}</span>
      <span class="form-control">
        <input type="range" class="form-range" name="eventRankRange" id="eventRank" min="1" :max="spans.max_rank"
          v-model="event_rank" />
      </span>
      <input type="number" class="form-control" name="eventRankNumber" min="1" :max="spans.max_rank" v-model="event_rank"
        style="max-width:70px" />
    </div>
  </form>

  <form id="form_map_settings" class="form-horizontal" action="javascript:void(0);">
    <h4>{{ $t("map_form_header_map_settings") }}</h4>
    <div class="form-group input-group mb-3">
      <span class="input-group-text" id="label_basemap" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true"
        :data-bs-title="$t('basemap_tooltip')">{{ $t("basemap_label") }}</span>
      <select class="form-select" id="basemap" name="basemap" v-model="basemap">
        <option value="basemap_grey" selected>{{ $t("basemap_option_basemap_grey") }}</option>
        <option value="basemap_color">{{ $t("basemap_option_basemap_color") }}</option>
        <option value="osm">{{ $t("basemap_option_osm") }}</option>
      </select>
    </div>
    <div class="form-group input-group mb-3">
      <span class="input-group-text" id="label_opacity" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-container="body" data-bs-html="true" :data-bs-title="$t('slider_opactity_tooltip')">{{ $t("slider_opacity_label") }}</span>
      <span class="form-control">
        <input type="range" class="form-range" name="OpacityRange" id="Opacity" min="0" max="100" value="100"
          v-model="opacity" />
      </span>
      <input type="number" class="form-control" name="OpacityNumber" min="0" max="100" value="100" v-model="opacity"
        style="max-width:80px" />
      <span class="input-group-text">%</span>
    </div>
  </form></template>




