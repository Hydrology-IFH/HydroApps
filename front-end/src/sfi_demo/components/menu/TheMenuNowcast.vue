<script setup>
  import { useConfig } from '~/stores/config.js';
  import TheMenuNowcastEnsemble from './TheMenuNowcastEnsemble.vue';
  import TheMenuNowcastLeadTime from './TheMenuNowcastLeadTime.vue';
  import TheMenuNowcastKind from './TheMenuNowcastKind.vue';

  const config = useConfig();

</script>

<template>
  <template
    v-if="config.kind=='nowcast'"
  >
    <TheMenuNowcastKind />
    <TheMenuNowcastLeadTime />
    <TheMenuNowcastEnsemble />
  </template>
</template>