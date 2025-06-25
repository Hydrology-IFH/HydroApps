<script>
import { parameter, sri, year, event_rank } from './Form.vue';

export default {
  data: function () {
    return {
      cell_data: [],
      grid_id: null,
      loading: true,
      error_msg: false,
      cell_lat: null,
      cell_lon: null,
      parameter: parameter,
      sri: sri,
      year: year,
      event_rank: event_rank,
      table_tooltips: []
    }
  },
  computed: {
    sri_table_name() {
      let grid_str = this.grid_id.toString().padStart(5, '0');
      return `SRI-Events-Combined_KOSTRA-V2020_${grid_str}.pdf`;
    },
    url_sri_table() {
      return `/static/sri_bw/SRI-Tabellen/${this.sri_table_name}`;
    },
    highlighted_event_ranks() {
      switch (this.parameter) {
        case 'sri' :
        case 'duration':
        case 'month':
        case 'year':
          return [this.event_rank];
        case 'NEvents_above_SRI':
          return this.cell_data
            .filter((data) => data.sri >= this.sri)
            .map((data) => data.event_rank);
        case 'Top_SRI_year':
          let cells_year = this.cell_data
            .filter((data) => new Date(data.date).getFullYear() == this.year);
          let max_year_sri = Math.max(...cells_year.map((data) => data.sri));
          return cells_year
            .filter((data) => data.sri == max_year_sri)
            .map((data) => data.event_rank);
        default:
          return [];
      }
    },
    highlighted_parameters() {
      switch (this.parameter) {
        case 'sri' :
          return ["event_rank", "sri"];
        case 'duration':
          return ["event_rank", "duration"];
        case 'month':
        case 'year':
          return ["event_rank", "date"];
        case 'NEvents_above_SRI':
          return ["all"];
        case 'Top_SRI_year':
          return ["date", "sri"];
        default:
          return [];
      }
    }
  },
  watch: {
    grid_id(new_grid_id, old_grid_id) {
      if (((new_grid_id !== old_grid_id) && (new_grid_id !== undefined)) || (this.error_msg) || (this.cell_data.length != 0)) {
        this.fetchData();
      }
    }
  },
  mounted() {
    new bootstrap.Tooltip(
      this.$el.parentElement,
      {selector:'button[data-bs-toggle="tooltip"]'});
  },
  updated() {
    this.table_tooltips.forEach((tooltip) => {tooltip.dispose()});
    this.table_tooltips = [
      ...this.$el.parentElement.querySelectorAll('table [data-bs-toggle="tooltip"]')]
      .map((el) => new bootstrap.Tooltip(el, {placement: "auto"}));
  },
  methods: {
    update_popup_data(grid_id, lat, long) {
      this.cell_lat = lat;
      this.cell_lon = long;
      this.grid_id = grid_id;
    },
    async fetchData() {
      this.loading = true;
      fetch("/en/sri_bw/api/sri_bw_data/?grid_id=" + this.grid_id)
        .then((res) => res.json())
        .then((data) => {
          this.cell_data = data;
          this.loading = false;
        })
        .catch((err) => {
          this.set_error_msg(this.$t('popup_error_msg_data'));
          console.log(err);
        });
    },
    set_error_msg(msg) {
      this.loading = false;
      this.error_msg = msg;
    },
    download_data() {
      // create a hidden element and download the csv file
      let hiddenElement = document.createElement('a');
      hiddenElement.href = this.url_sri_table;
      hiddenElement.target = '_blank';
      hiddenElement.setAttribute("download", this.sri_table_name);
      hiddenElement.click();
    },
    highlight(event_rank, parameter) {
      return (this.highlighted_event_ranks.includes(event_rank) &&
             (this.highlighted_parameters.includes(parameter)))
    },
    highlight_class(event_rank, parameter) {
      return this.highlight(event_rank, parameter) ? "highlight" : "";
    },
    highlight_bs_toggle(event_rank, parameter) {
      return this.highlight(event_rank, parameter) ? "tooltip" : "";
    },
    highlight_bs_title(event_rank, parameter) {
      return this.highlight(event_rank, parameter) ? this.$t('popup_explanation_highlight') : "";
    }
  },
}
</script>

<template>
  <div class="spinner-border text-primary m-2" role="status" v-if="loading">
    <span class="sr-only"></span>
  </div>
  <div v-else-if="error_msg" class="alert alert-danger m-2" role="alert" style="max-width:300px;">
    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> {{ $t('popup_error_header') }}</h4>
    <p>{{ error_msg }}</p>
    <p>{{ $t('popup_error_footer') }}</p>
  </div>
  <div v-else class="popup-data">

    <div class="popup-header">
      <p>{{ $t('popup_explanation') }}<a href="./method">{{ $t('popup_explanation_method_link') }}</a>.</p>
      <div>
        <button class="btn btn-primary" role="button"
            @click="download_data()"
            data-bs-toggle="tooltip"
            data-bs-container="body"
            data-bs-placement="top"
            :data-bs-title="$t('popup_download_tooltip')">
          <i class="bi bi-download"></i>
        </button>
      </div>
    </div>
    <div class="tab-content">
      <table class="table table-hover table-striped">
        <thead class="table-light ">
          <tr>
            <th colspan="3"></th>
            <th style="text-align:center" colspan="2">{{ $t('popup_table_header_rain') }}</th>
            <th></th>
          </tr>
          <tr>
            <th scope="col">{{ $t('popup_table_header_event_rank') }}</th>
            <th scope="col">{{ $t('popup_table_header_date') }}</th>
            <th scope="col">{{ $t('popup_table_header_duration') }}</th>
            <th scope="col">{{ $t('popup_table_header_pval') }}</th>
            <th scope="col">{{ $t('popup_table_header_pint') }}</th>
            <th scope="col">SRI</th>
          </tr>
          <tr class="th-units">
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">min</th>
            <th scope="col">mm</th>
            <th scope="col">mm/h</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in cell_data" :key="data.event_rank"
              :class="highlight_class(data.event_rank, 'all')"
              :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'all')"
              :title="highlight_bs_title(data.event_rank, 'all')"
              >
            <td :class="highlight_class(data.event_rank, 'event_rank')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'event_rank')"
                :title="highlight_bs_title(data.event_rank, 'event_rank')">
              {{ data.event_rank }}
            </td>
            <td :class="highlight_class(data.event_rank, 'date')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'date')"
                :title="highlight_bs_title(data.event_rank, 'date')">
              {{ data.date }}
            </td>
            <td :class="highlight_class(data.event_rank, 'duration')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'duration')"
                :title="highlight_bs_title(data.event_rank, 'duration')">
              {{ data.duration }}
            </td>
            <td :class="highlight_class(data.event_rank, 'pval')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'pval')"
                :title="highlight_bs_title(data.event_rank, 'pval')">
              {{ data.pval }}
            </td>
            <td :class="highlight_class(data.event_rank, 'pint')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'event_rank')"
                :title="highlight_bs_title(data.event_rank, 'pint')">
              {{ data.pint }}
            </td>
            <td :class="highlight_class(data.event_rank, 'sri')"
                :data-bs-toggle="highlight_bs_toggle(data.event_rank, 'sri')"
                :title="highlight_bs_title(data.event_rank, 'sri')">
              {{ data.sri }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
  /* Popup */
  .ol-overlaycontainer-stopevent {
    z-index: revert!important;
  }
  .ol-overlay-popup {
    z-index: 1100;
  }
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    height: max-content;
    width: max-content;
  }


  /* small box-arrow */
  .ol-popup:after{
    border: 1px solid #cccccc;
    content: " ";
    position: absolute;
    pointer-events: none;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    /* left: 50px;
    margin-left: -9px; */
    background-color: white;
  }

  /* common top and bottom */
  .ol-popup.popup-top, .ol-popup.popup-bottom {
    left: -50px;
  }
  .ol-popup.popup-top:after, .ol-popup.popup-bottom:after {
    left: 50px;
    margin-left: -10px;
  }



  /* top arrow */
  .ol-popup.popup-top{
    bottom: 12px;
  }
  .ol-popup.popup-top:after {
    bottom: -10px;
    border-left: none;
    border-top: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  /* bottom arrow */
  .ol-popup.popup-bottom{
    top: 12px;
  }
  .ol-popup.popup-bottom:after{
    top: -10px;
    border-bottom: none;
    border-right: none;
  }

  /* common left and rigth */
  .ol-popup.popup-left, .ol-popup.popup-right {
    top: -200px;
  }
  .ol-popup.popup-left:after, .ol-popup.popup-right:after {
    top: 200px;
    margin-top:-10px;
  }
  /* left arrow */
  .ol-popup.popup-right{
    left: 12px;
    /* top: -200px; */
  }
  .ol-popup.popup-right:after{
    left: -10px;
    /* top: 200px; */
    /* margin-top:-10px; */
    border-right: none;
    border-top: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }

  /* right arrow */
  .ol-popup.popup-left{
    right: 12px;
    /* top: -200px; */
  }
  .ol-popup.popup-left:after{
    right: -10px;
    /* top: 200px; */
    /* margin-top:-10px; */
    border-left: none;
    border-bottom: none;
  }

  /* closer button */
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }
  .ol-popup-closer:after {
    content: "✖";
  }

  .popup-data{
    height: 100%;
    display:flex;
    flex-direction: column;
    width: min-content;
  }
  .popup-data .popup-header {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    padding-right: 1rem;
  }
  .popup-data .popup-header p {
    margin-bottom: 0;
  }
  .popup-data div.tab-content {
    overflow-y: scroll;
    max-height: 40vh;
    width: 100%;
    z-index:999;
    flex-grow: 1;
  }

  .popup-data div.tab-content table thead {
    position: sticky;
    top: 0;
    background-color: white;
  }
  .popup-data div.tab-content table thead th {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .popup-data div.tab-content table {
    margin-bottom: 0px;
  }
  .popup-data div.tab-content table tr.th-units th{
    padding-top: 0px;
  }
  .popup-data div.tab-content table th{
    padding-bottom: 3px;
  }
  .popup-data div.tab-content table .highlight{
    background-color: #4eafffc7;
  }
</style>


