<script setup>
  import i18next from 'i18next';
  import { computed, onMounted, onUpdated, ref, watch } from 'vue';

  import { useConfig } from '~/stores/config.js';

  // models and props
  const errorMsg = defineModel({
    type: String,
    default: "",
    name: "errorMsg"
  });
  const props = defineProps({
    gridId: {
      type: Number,
      default: undefined
    },
    cellCenter: {
      type: Array,
      default: () => []
    }
  });

  //  refs
  const config = useConfig();
  const cellData = ref([]);
  const loading = ref(true);
  const rootRef = ref(null);
  const tableTooltips = ref([]);

  // fetch kombstra data for the given grid cell
  const fetchData = async () => {
    loading.value = true;
    fetch("/en/kombstra/api/kombstra_data/?grid_id=" + props.gridId)
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched data:", data);
        cellData.value = data;
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
        errorMsg.value = msg;
        console.log(err);
      });
  };

  // watch for changes in the gridId prop to fetch new data
  watch(() => props.gridId, (new_gridId, old_gridId) => {
    if (((new_gridId !== old_gridId) && (new_gridId !== undefined)) || (errorMsg.value) || (props.cell_data.length != 0)) {
      fetchData();
    }
  });

  // function to download the data as csv file
  const downloadData = () => {
    // create the csv content
    let header = [
      "This is the KombStRA data for one raster cell"
      `cell-ID, ${props.gridId}`,
      `The cell center is located at (EPSG:4326): ${props.cellCenter[0]}, ${props.cellCenter[1]}.`,
      "The columns are:",
      "event_rank,The ranking of the event",
      "date,The date of the event",
      "duration,The duration of the event in minutes",
      "pval,The rain amount in mm",
      "pint,The rain intensity in mm/h",
      "sri,The 'Starkregenindex' (SRI) of the event",
      ""
    ];
    let items = cellData.value;
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
    hiddenElement.download = `kombstra_data_${props.gridId}.csv`;
    hiddenElement.click();
  };

  //  highlighting logic
  const highlightedEventRanks = computed(() => {
    switch (config.parameter) {
      case 'event_sri' :
      case 'duration':
      case 'month':
      case 'year':
        return [config.event_rank];
      case 'NEvents_above_SRI':
        return cellData.value
          .filter((data) => data.sri >= config.sri)
          .map((data) => data.event_rank);
      case 'Top_SRI_year':
        let cells_year = cellData.value
          .filter((data) => new Date(data.date).getFullYear() == config.year);
        let max_year_sri = Math.max(...cells_year.map((data) => data.sri));
        return cells_year
          .filter((data) => data.sri == max_year_sri)
          .map((data) => data.event_rank);
      default:
        return [];
    }
  });

  const highlightedParameters = computed(() => {
    switch (config.parameter) {
      case 'event_sri' :
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
  });

  const highlight = (event_rank, parameter) => {
    return (highlightedEventRanks.value.includes(event_rank) &&
            (highlightedParameters.value.includes(parameter)))
  };
  const highlightClass = (event_rank, parameter) => {
    return highlight(event_rank, parameter) ? "highlight" : "";
  };
  const highlightBsToggle = (event_rank, parameter) => {
    return highlight(event_rank, parameter) ? "tooltip" : "";
  };
  const highlightBsTitle = (event_rank, parameter) => {
    return highlight(event_rank, parameter) ? i18next.t('popup_explanation_highlight') : "";
  };

  // tooltips initialization
  onMounted(() => {
    new bootstrap.Tooltip(
      rootRef.value,
      {selector:'button[data-bs-toggle="tooltip"]'});
  });
  onUpdated(() => {
    tableTooltips.value.forEach((tooltip) => {tooltip.dispose()});
    tableTooltips.value = [
      ...rootRef.value.parentElement.querySelectorAll('table [data-bs-toggle="tooltip"]')]
      .map((el) => new bootstrap.Tooltip(el, {placement: "auto"}));
  });

</script>

<template>
  <div ref="rootRef">
    <div
      v-if="loading"
      class="spinner-border text-primary m-2"
      role="status"
    >
      <span class="sr-only" />
    </div>
    <div
      v-else-if="errorMsg"
      class="alert alert-danger m-2"
      role="alert"
      style="max-width:300px;"
    >
      <h4 class="alert-heading">
        <i class="bi bi-exclamation-triangle" />{{ $t('popup_error_header') }}
      </h4>
      <p>{{ errorMsg }}</p>
      <p>{{ $t('popup_error_footer') }}</p>
    </div>
    <div
      v-else
      class="popup-data"
    >
      <div class="popup-header">
        <p>{{ $t('popup_explanation') }}<a href="./method">{{ $t('popup_explanation_method_link') }}</a>.</p>
        <div>
          <button
            class="btn btn-primary"
            role="button"
            data-bs-toggle="tooltip"
            data-bs-container="body"
            data-bs-placement="top"
            :data-bs-title="$t('popup_download_tooltip')"
            @click="downloadData()"
          >
            <i
              class="bi bi-download"
              style="color: white"
            />
          </button>
        </div>
      </div>
      <div class="tab-content">
        <table class="table table-hover table-striped">
          <thead class="table-light ">
            <tr>
              <th colspan="3" />
              <th
                style="text-align:center"
                colspan="2"
              >
                {{ $t('popup_table_header_rain') }}
              </th>
              <th />
            </tr>
            <tr>
              <th scope="col">
                {{ $t('popup_table_header_event_rank') }}
              </th>
              <th scope="col">
                {{ $t('popup_table_header_date') }}
              </th>
              <th scope="col">
                {{ $t('popup_table_header_duration') }}
              </th>
              <th scope="col">
                {{ $t('popup_table_header_pval') }}
              </th>
              <th scope="col">
                {{ $t('popup_table_header_pint') }}
              </th>
              <th scope="col">
                SRI
              </th>
            </tr>
            <tr class="th-units">
              <th scope="col" />
              <th scope="col" />
              <th scope="col">
                min
              </th>
              <th scope="col">
                mm
              </th>
              <th scope="col">
                mm/h
              </th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="data in cellData"
              :key="data.event_rank"
              :class="highlightClass(data.event_rank, 'all')"
              :data-bs-toggle="highlightBsToggle(data.event_rank, 'all')"
              :title="highlightBsTitle(data.event_rank, 'all')"
            >
              <td
                :class="highlightClass(data.event_rank, 'event_rank')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'event_rank')"
                :title="highlightBsTitle(data.event_rank, 'event_rank')"
              >
                {{ data.event_rank }}
              </td>
              <td
                :class="highlightClass(data.event_rank, 'date')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'date')"
                :title="highlightBsTitle(data.event_rank, 'date')"
              >
                {{ data.date }}
              </td>
              <td
                :class="highlightClass(data.event_rank, 'duration')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'duration')"
                :title="highlightBsTitle(data.event_rank, 'duration')"
              >
                {{ data.duration }}
              </td>
              <td
                :class="highlightClass(data.event_rank, 'pval')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'pval')"
                :title="highlightBsTitle(data.event_rank, 'pval')"
              >
                {{ data.pval }}
              </td>
              <td
                :class="highlightClass(data.event_rank, 'pint')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'event_rank')"
                :title="highlightBsTitle(data.event_rank, 'pint')"
              >
                {{ data.pint }}
              </td>
              <td
                :class="highlightClass(data.event_rank, 'sri')"
                :data-bs-toggle="highlightBsToggle(data.event_rank, 'sri')"
                :title="highlightBsTitle(data.event_rank, 'sri')"
              >
                {{ data.sri }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
  /* Popup header */
  .popup-data{
    height: 100%;
    display: flex;
    flex-direction: column;
    width: min-content;
  }
  .popup-data .popup-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    padding-right: 1rem;
  }
  .popup-data .popup-header p {
    margin-bottom: 0;
  }

  /* Table */
  .popup-data div.tab-content {
    overflow-y: scroll;
    max-height: 40vh;
    width: 100%;
    z-index: 999;
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


