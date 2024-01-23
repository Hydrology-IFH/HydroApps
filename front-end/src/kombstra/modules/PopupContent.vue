<script>
import { ref } from 'vue';

// export const cell_data = ref([]);
export const grid_id = ref(null);

export default {
    data: function () {
        return {
            cell_data: [],
            grid_id: grid_id,
            perc_tab_active: 50,
            loading: true,
            error_msg: false
        }
    },
    computed: {
        percs: function () {
            let percs = [];
            this.cell_data.forEach((el) => {
                if (!percs.includes(el.percentile)) {
                    percs.push(el.percentile)
                }
            });
            return percs;
        },
        cell_data_regrouped: function () {
            let data = {};
            for (let perc of this.percs) {
                data[perc] = this.cell_data.filter((el) => el.percentile === perc);
            };
            return data;
        },
    },
    watch: {
        grid_id(new_grid_id, old_grid_id) {
            this.loading = true;
            if (((new_grid_id !== old_grid_id) && (new_grid_id !== undefined)) || (this.err_msg)) {
                this.fetchData();
            } else if (this.cell_data.length != 0){
                this.loading = false;
            }
        }
    },
    methods: {
        async fetchData() {
            // this.cell_data = [];
            fetch("/kombstra/api/kombstra_data/?grid_id=" + this.grid_id)
                .then((res) => res.json())
                .then((data) => {
                    this.cell_data = data;
                    this.loading = false;
                    this.error_msg = false;})
                .catch((err) => {
                        this.set_error_msg("We are sorry, there was a problem fetching the data for this cell.");
                        console.log(err);
                });
        },
        set_error_msg(msg) {
            this.loading = false;
            this.error_msg = msg;
        }
    },
}
</script>

<template>
    <div class="spinner-border text-primary m-2" role="status" v-if="loading">
        <span class="sr-only"></span>
    </div>
    <div v-else-if="error_msg" class="alert alert-danger m-2" role="alert" style="max-width:300px;">
        <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Error</h4>
        <p>{{ error_msg }}</p>
        <p>Please try again later.</p>
    </div>
    <div v-else class="popup-data">
        <div class="popup-explanation">These are the events for this cell that got categorized, depending on the percentile.
        </div>
        <ul class="nav nav-tabs" id="popupTabs" role="tablist">
            <li class="nav-item" v-for="perc in percs" :key="`vtab-${perc}`">
                <a class="nav-link" href="#" :id="`${perc}-tab`" :class="{ active: perc_tab_active == perc }"
                    data-toggle="tab" :href="`#${perc}-tableTab`" role="tab" :aria-controls="`${perc}-tableTab`"
                    :aria-selected="`${perc_tab_active == perc}`" @click="this.perc_tab_active = perc">{{ perc }} %</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane fade" v-for="perc in percs" :id="`${perc}-tableTab`" :key="`${perc}-tableTab`"
                role="tabpanel" :aria-labelledby="`${perc}-tab`"
                :class="{ active: perc_tab_active == perc, show: perc_tab_active == perc }">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Event rank</th>
                            <th scope="col">Date</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Rain intensity</th>
                            <th scope="col">SRI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="data in cell_data_regrouped[perc]" :key="data.data_id">
                            <td>{{ data.event_rank }}</td>
                            <td>{{ data.date }}</td>
                            <td>{{ data.duration }}</td>
                            <td>{{ data.pval }}</td>
                            <td>{{ data.sri }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>



