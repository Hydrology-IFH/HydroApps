<script setup>
  import { ref, onMounted } from 'vue';

  import TheMenuRegion from './menu/TheMenuRegion.vue';
  import TheMenuKind from './menu/TheMenuKind.vue';
  import TheMenuPrecipitationForce from './menu/TheMenuPrecipitationForce.vue';
  import TheMenuSoilMoisture from './menu/TheMenuSoilMoisture.vue';
  import TheMenuDuration from './menu/TheMenuDuration.vue';
  import TheMenuDate from './menu/TheMenuDate.vue';
  import TheMenuOpacity from './menu/TheMenuOpacity.vue';
  import TheMenuColorscale from './menu/TheMenuColorscale.vue';
  import TheMenuPreparedness from './menu/TheMenuPreparedness.vue';

  const fromRef = ref(null);

  onMounted(() => {
    fromRef.value.querySelectorAll('[data-bs-toggle=tooltip]').forEach((input) => {
      new window.bootstrap.Tooltip(input, {html: true, delay: {show: 100, hide: 100}, sanitize: false})
    })
  });
</script>
<template>
  <form
    id="menu"
    ref="fromRef"
    class="form-horizontal"
    action="javascript:void(0);"
  >
    <h4>{{ $t('menu_header_event') }}</h4>
    <TheMenuRegion />
    <TheMenuKind id="menu-kind" />
    <div id="menu-matrix">
      <TheMenuSoilMoisture />
      <TheMenuPrecipitationForce />
      <TheMenuDuration />
    </div>
    <TheMenuDate />
    <TheMenuPreparedness />
    <h4>{{ $t('menu_header_map') }}</h4>
    <div id="menu-map">
      <TheMenuOpacity />
      <TheMenuColorscale />
    </div>
  </form>
</template>