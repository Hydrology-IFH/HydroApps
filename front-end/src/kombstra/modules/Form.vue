<script>
import { ref } from 'vue';

export const parameter = ref('sri');
export const year = ref(2010);
export const sri = ref(1);
export const event_rank = ref(1);
export const opacity = ref(100);

export default {
    data: function () {
        return {
            parameter: parameter,
            year: year,
            sri: sri,
            event_rank: event_rank,
            opacity: opacity,
        }
    }
}
</script>

<template>
    <form id="form_select_grid" class="form-horizontal" action="javascript:void(0);">
        <h4>Select a KombStRA grid</h4>
        <div class="d-flex col-12">
            <p>Select the KombStRA data to show on the map. To get more information on single fields, just click on the
                raster cell on the map.</p>
        </div>
        <div class="form-group input-group mb-3">
            <span class="input-group-text" id="label_parameter" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-container="body" data-bs-html="true"
                data-bs-title='Choose the Parameters you would like to see on the map.'>Parameter</span>
            <select class="form-select" id="parameter" name="parameter" v-model="parameter">
                <option value="sri" selected>{{ $t("heavy rain index (SRI)") }} </option>
                <option value="duration" selected>duration</option>
                <option value="year">year</option>
                <option value="month">month</option>
                <option value="Top_SRI_year">Top SRI per year</option>
                <option value="NEvents_above_SRI">Number events above SRI</option>
            </select>
            <div class="bs-component" id="agg_alert_box"></div>
        </div>

        <div class="form-group input-group mb-3" v-if="parameter === 'Top_SRI_year'">
            <span class="input-group-text" id="label_SliderYear" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-container="body" data-bs-html="true"
                data-bs-title='Choose the year for which to get the Top event.'>Year</span>
            <span class="form-control">
                <input type="range" class="form-range" name="SliderYearRange" id="SliderYear" min="2001" max="2021" v-model="year" />
            </span>
            <input type="number" class="form-control" name="SliderYearNumber" min="2001" max="2021" v-model="year" style="max-width:90px"/>
        </div>

        <div class="form-group input-group mb-3" v-else-if="parameter === 'NEvents_above_SRI'">
            <span class="input-group-text" id="label_SliderSRI" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-container="body" data-bs-html="true"
                data-bs-title='Choose the SRI to get number of events > SRI.'>SRI</span>
            <span class="form-control">
                <input type="range" class="form-range" name="SliderSRIRange" id="SliderSRI" min="1" max="12" v-model="sri" />
            </span>
            <input type="number" class="form-control" name="SliderSRINumber" min="1" max="12" v-model="sri" style="max-width:70px"/>
        </div>

        <div class="form-group input-group mb-3" v-else>
            <span class="input-group-text" id="label_eventRank" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-container="body" data-bs-html="true"
                data-bs-title='Choose the rank of the event. E.g. the Top 1 event per grid cell.'>Event rank</span>
            <span class="form-control">
                <input type="range" class="form-range" name="eventRankRange" id="eventRank" min="1" max="15" v-model="event_rank" />
            </span>
            <input type="number" class="form-control" name="eventRankNumber" min="1" max="15" v-model="event_rank" style="max-width:70px" />
        </div>
    </form>

    <form id="form_map_settings" class="form-horizontal" action="javascript:void(0);">
        <h4>Update map settings</h4>
        <div class="form-group input-group mb-3">
            <span class="input-group-text" id="label_opacity" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-container="body" data-bs-html="true"
                data-bs-title='Set the transperency of the layer'>Opacity</span>
            <span class="form-control">
                <input type="range" class="form-range" name="OpacityRange" id="Opacity" min="0" max="100" value="100" v-model="opacity" />
            </span>
            <input type="number" class="form-control" name="OpacityNumber" min="0" max="100" value="100" v-model="opacity" style="max-width:70px" />
        <span class="input-group-text">%</span>
    </div>
</form></template>




