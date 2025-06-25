<script setup>
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
</script>

<template>
  <div class="form-check form-switch">
    <input
      id="damagePerHousholdSwitch"
      v-model="config.damagePerHoushold"
      class="form-check-input"
      type="checkbox"
    >
    <label
      class="form-check-label"
      for="damagePerHousholdSwitch"
    >{{ $t("popover_damagePerHoushold_switch_label") }}</label>
  </div>
</template>