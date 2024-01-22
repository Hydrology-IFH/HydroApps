<script>
import { ref } from 'vue';

export const cell_data = ref([]);

export default {
    data: function () {
        return {
            cell_data: cell_data,
            perc_tab_active: 50
        }
    },
    computed: {
        cell_data_empty: function () {
            return this.cell_data.length === 0;
        },
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
    }
}
</script>

<template>
    <div v-if="!cell_data_empty" class="popup-data">
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
                        <th scope="col">Event rank</th>
                        <th scope="col">Date</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Rain intensity</th>
                        <th scope="col">SRI</th>
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
    <div class="spinner-border text-primary" role="status" v-else>
        <span class="sr-only"></span>
    </div>
</template>




