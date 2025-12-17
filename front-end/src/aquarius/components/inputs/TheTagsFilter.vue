<script setup>
  import { onBeforeMount } from 'vue'

  import { useConfig } from '~/stores/config.js';
  import TagsInput from '~~/components/inputs/TagsInput.vue';

  const config = useConfig();

  // Fetch tags before mounting
  onBeforeMount(() => {
    config.fetchTags();
  });
</script>

<template>
  <TagsInput
    v-model="config.filter.tagKeys"
    :valid-tags="config.availableTagKeys"
    :label="$t('filter_tags_label')"
    :tooltip-msg="$t('filter_tags_tooltip')"
  />
</template>