<script setup>
  import { useConfig } from '~/stores/config.js';
  import MenuSelection from "./utils/MenuSelection.vue";
  import { regions } from "../map/regions.js";

  const config = useConfig();

  const regions_keys = Object.keys(regions);

  const updateRegion = () => {
    config.region_selection_active = false;
  }

</script>

<template>
  <MenuSelection v-model="config.region"
              :label="$t('menu_region_label')"
              :options="regions_keys"
              :tooltip="$t('menu_region_tooltip')"
              @change="updateRegion"
              id="menu-region">
    <template v-slot:after>
      <button class="btn btn-primary text-white" type="button" @click="config.region_selection_active = true"
              data-bs-toggle="tooltip" data-bs-placement="top"
              :data-bs-title="$t('menu_region_map_tooltip')">
        <i class="bi bi-geo"></i>
      </button>
    </template>
  </MenuSelection>
</template>

<style scoped>
  .btn-primary .bi {
    color: inherit;
  }
</style>