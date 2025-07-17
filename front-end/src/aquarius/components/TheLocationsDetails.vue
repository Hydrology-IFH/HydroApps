<script setup>
  import { ref, onMounted } from 'vue';


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

  </form>
</template>