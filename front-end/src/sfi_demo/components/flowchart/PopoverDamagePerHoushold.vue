<script setup>
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
</script>

<template>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="damagePerHousholdSwitch" v-model="config.damagePerHoushold">
    <label class="form-check-label" for="damagePerHousholdSwitch">{{$t("popover_damagePerHoushold_switch_label")}}</label>
  </div>
</template>