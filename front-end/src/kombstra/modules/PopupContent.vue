<script>
export default {
  data: function () {
    return {
      cell_data: [],
      grid_id: null,
      loading: true,
      error_msg: false,
      cell_lat: null,
      cell_lon: null
    }
  },
  watch: {
    grid_id(new_grid_id, old_grid_id) {
      if (((new_grid_id !== old_grid_id) && (new_grid_id !== undefined)) || (this.error_msg) || (this.cell_data.length != 0)) {
        this.fetchData();
      }
    }
  },
  methods: {
    update_popup_data(grid_id, lat, long) {
      this.cell_lat = lat;
      this.cell_lon = long;
      this.grid_id = grid_id;
    },
    async fetchData() {
      this.loading = true;
      fetch("/en/kombstra/api/kombstra_data/?grid_id=" + this.grid_id)
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
      // create the csv content
      let header = [
        `This is the KombStRA data for the raster cell with the ID ${this.grid_id}`,
        `The cells center is located at ${this.cell_lat}, ${this.cell_lon}.`,
        "The columns are:",
        "event_rank : The ranking of the event",
        "date: The date of the event",
        "duration: The duration of the event in minutes",
        "pval: The rain amount in mm",
        "pint: The rain intensity in mm/h",
        "sri: The 'Starkregenindex' (SRI) of the event",
        ""
      ];
      let items = this.cell_data;
      let col_names = Object.keys(items[0]);
      let csv = [
        ...header,
        col_names.join(','),
        ...items.map(row => {
          return col_names.map(fieldName => {
            return JSON.stringify(row[fieldName])
          }).join(',')
        })
      ].join('\r\n')

      // create a hidden element and download the csv file
      let hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = `kombstra_data_${this.grid_id}.csv`;
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
      <button class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="body"
        :data-bs-title="$t('popup_download_tooltip')"><i class="bi bi-download"
          @click="download_data"></i></button>
    </div>
    <div class="tab-content">
      <table class="table table-striped table-hover">
        <thead class="table-light ">
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




