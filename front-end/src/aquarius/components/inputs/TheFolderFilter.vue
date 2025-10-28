<script setup>
  import { onBeforeMount } from 'vue'

  import { useConfig } from '~/stores/config.js';
  import SelectionPartsInput from '~~/components/inputs/SelectionPartsInput.vue';

  const config = useConfig();

  // Fetch folders before mounting
  onBeforeMount(() => {
    config.fetchFolders();
    window.config = config;
  });
</script>

<template>
  <SelectionPartsInput
    v-model="config.filter.folders"
    :options="config.availableFolders"
    :label="$t('filter_folders_label')"
    :tooltip-msg="$t('filter_folders_tooltip')"
  />
</template>