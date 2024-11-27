<script setup>
  import { useConfig } from '~/stores/config.js';

  const config = useConfig();
</script>

<template>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="sfgfSwitch" v-model="config.show_sfgf">
    <label class="form-check-label" for="sfgfSwitch">{{$t("popover_SFGF_switch_label")}}</label>
  </div>
</template>