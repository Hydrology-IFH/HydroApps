<script setup>
  import { ref, onMounted } from 'vue';

  import MenuRegion from './menu/MenuRegion.vue';
  import MenuKind from './menu/MenuKind.vue';
  import MenuPrecipitationForce from './menu/MenuPrecipitationForce.vue';
  import MenuSoilMoisture from './menu/MenuSoilMoisture.vue';
  import MenuDuration from './menu/MenuDuration.vue';
  import MenuDate from './menu/MenuDate.vue';
  import MenuOpacity from './menu/MenuOpacity.vue';
  import MenuColorscale from './menu/MenuColorscale.vue';
  import MenuPreparedness from './menu/MenuPreparedness.vue';

  const fromRef = ref(null);

  onMounted(() => {
    fromRef.value.querySelectorAll('[data-bs-toggle=tooltip]').forEach((input) => {
      new window.bootstrap.Tooltip(input, {html: true, delay: {show: 100, hide: 100}, sanitize: false})
    })
  });
</script>
<template>
  <form class="form-horizontal" action="javascript:void(0);" ref="fromRef" id="menu">
    <h4>{{ $t('menu_header_event') }}</h4>
    <MenuRegion />
    <MenuKind id="menu-kind"/>
    <div id="menu-matrix">
      <MenuSoilMoisture />
      <MenuPrecipitationForce />
      <MenuDuration />
    </div>
    <MenuDate />
    <MenuPreparedness />
    <h4>{{ $t('menu_header_map') }}</h4>
    <div id="menu-map">
      <MenuOpacity />
      <MenuColorscale />
    </div>
  </form>
</template>