<script setup>
  import { useConfig } from '~/stores/config.js';
  import SelectionInput from "~~/components/inputs/SelectionInput.vue";
  import { regions } from "../map/regions.js";

  const config = useConfig();

  const regions_keys = Object.keys(regions);

  const updateRegion = () => {
    config.region_selection_active = false;
  }

</script>

<template>
  <SelectionInput
    id="menu-region"
    v-model="config.region"
    :label="$t('menu_region_label')"
    :options="regions_keys"
    :tooltip-msg="$t('menu_region_tooltip')"
    @change="updateRegion"
  >
    <template #after>
      <button
        class="btn btn-primary text-white"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        :data-bs-title="$t('menu_region_map_tooltip')"
        @click="config.region_selection_active = true"
      >
        <i class="bi bi-geo" />
      </button>
    </template>
  </SelectionInput>
</template>

<style scoped>
  .btn-primary .bi {
    color: inherit;
  }
</style>