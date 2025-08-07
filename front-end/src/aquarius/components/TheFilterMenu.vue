<template>
  <div
    id="filterMenu"
    class="collapse mb-2"
    style="width: 100%"
  >
    <div class="card card-body">
      <form action="None">
        <h4>{{ $t('filter_menu_header') }}</h4>
        <TheTagsFilter />
        <TheFolderFilter />
      </form>
    </div>
  </div>
</template>

<script setup>
  import TheTagsFilter from './inputs/TheTagsFilter.vue';
  import TheFolderFilter from './inputs/TheFolderFilter.vue';
</script>