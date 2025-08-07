<script setup>
  defineProps({
    msg: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      default: 'danger'
    },
    header: {
      type: String,
      default: 'Error'
    }
  })
</script>
<template>
  <div
    id="ErrorFrame"
    class="ErrorFrame"
  >
    <div
      class="alert"
      :class="`alert-${type}`"
      role="alert"
    >
      <h4 class="alert-heading">
        {{ header }}
      </h4>
      <slot name="message">
        <p v-html="msg" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
  .ErrorFrame {
    display: grid;
    position: absolute;
    top: 0;
    place-items: center;
    height: 100%;
    width: 100%;
    padding: 1em;
    pointer-events: none;
  }
</style>
