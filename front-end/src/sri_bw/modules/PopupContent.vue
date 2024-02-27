<script>
export default {
  data: function () {
    return {
      cell_data: [],
      sri_id: null,
      loading: true,
      error_msg: false,
      cell_lat: null,
      cell_lon: null
    }
  },
  computed: {
    sri_table_name() {
      let grid_str = this.sri_id.toString().padStart(5, '0');
      return `SRI-Events-Combined_KOSTRA-V2020_${grid_str}.pdf`;
    },
    url_sri_table() {
      return `/static/sri_bw/SRI-Tabellen/${this.sri_table_name}`;
    }
  },
  watch: {
    sri_id(new_sri_id, old_sri_id) {
      if (((new_sri_id !== old_sri_id) && (new_sri_id !== undefined)) || (this.error_msg) || (this.cell_data.length != 0)) {
        this.fetchData();
      }
    }
  },
  methods: {
    update_popup_data(sri_id, lat, long) {
      this.cell_lat = lat;
      this.cell_lon = long;
      this.sri_id = sri_id;
    },
    async fetchData() {
      this.loading = true;
      fetch("/en/sri_bw/api/sri_bw_data/?sri_id=" + this.sri_id)
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
    }
  },
  mounted() {
    new bootstrap.Tooltip(this.$el.parentElement, {
      selector: "[data-bs-toggle='tooltip']",
    });
  }
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
      <p>{{ $t('popup_explanation') }}</p>
      <div>
        <button class="btn btn-primary" role="button" :href="url_sri_tabelle" @click="download_data()"
        target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="body"
        :data-bs-title="$t('popup_download_tooltip')">
          <i class="bi bi-download"></i>
        </button>
      </div>
    </div>
    <div class="tab-content">
      <table class="table table-striped table-hover">
        <thead class="table-light ">
          <tr>
            <th colspan="3"></th>
            <th colspan="2">{{ $t('popup_table_header_rain') }}</th>
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
          <tr v-for="data in cell_data" :key="data.data_id">
            <td>{{ data.event_rank }}</td>
            <td>{{ data.date }}</td>
            <td>{{ data.duration }}</td>
            <td>{{ data.pval }}</td>
            <td>{{ data.pint }}</td>
            <td>{{ data.sri }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>




