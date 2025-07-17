<script setup>
  import { onBeforeMount } from 'vue'

  import { useConfig } from '~/stores/config.js';
  import TagsInput from '../../../common/components/inputs/TagsInput.vue';

  const config = useConfig();

  // Fetch tags before mounting
  onBeforeMount(() => {
    config.fetchTags();
    window.config = config;
  });
</script>

<template>
  <TagsInput
    v-model="config.selectedTags"
    :valid-tags="config.availableTags"
    :name="$t('filter-tags-name')"
    :label="$t('filter-tags-label')"
    :tooltip-msg="$t('filter-tags-tooltip')"
  />
</template>