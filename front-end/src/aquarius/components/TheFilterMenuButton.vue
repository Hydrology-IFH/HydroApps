<template>
  <p style="width:auto">
    <button
      class="btn btn-outline-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#filterMenu"
      aria-expanded="false"
      aria-controls="filterMenu"
    >
      <i class="bi bi-funnel-fill" />
      {{ $t('filter_menu_button') }}
    </button>
  </p>
</template>