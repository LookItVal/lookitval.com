<template>
  <div class="overflow-auto">
    <slot />
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
div {
  /* Customize scrollbar for WebKit browsers */
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 100, 100, 0.5) transparent;
}
</style>