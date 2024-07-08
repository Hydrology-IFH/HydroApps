<script setup>
  import { ref, onMounted } from 'vue';
  import { useConfig } from '../stores/config';
  import MenuPrecipitationForce from './menu/MenuPrecipitationForce.vue';
  import MenuSoilMoisture from './menu/MenuSoilMoisture.vue';
  import MenuDuration from './menu/MenuDuration.vue';

  const fromRef = ref(null);
  const config = useConfig();

  onMounted(() => {
    fromRef.value.querySelectorAll('[data-bs-toggle=tooltip]').forEach((input) => {
      new window.bootstrap.Tooltip(input, {html: true, delay: {show: 100, hide: 100}, sanitize: false})
    })
  });
</script>
<template>
  <form class="form-horizontal" action="javascript:void(0);" ref="fromRef">
    <h4>{{ $t('menu_header_map') }}</h4>
    <MenuSoilMoisture />
    <MenuPrecipitationForce />
    <MenuDuration />
  </form>
</template>