<script setup>
  import { ref, watch } from 'vue';
  import { useConfig } from '~/stores/config.js';
  import SelectionInput from '~~/components/inputs/SelectionInput.vue';

  const config = useConfig();

</script>
<template>
  <SelectionInput v-model="config.region"
              :name="$t('menu_region_label')"
              :options="['Bonndorf']"
              :tooltipMsg="$t('menu_region_tooltip')"/>
</template>