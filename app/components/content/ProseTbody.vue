<template>
  <tbody>
    <slot />
  </tbody>
</template>

<script lang="ts" setup>
</script>

<style scoped>
tbody :deep(tr:nth-child(even)) {
  background-color: var(--color-mantle-100);
}

tbody :deep(tr:nth-child(odd)) {
  background-color: var(--color-base-100);
}

tbody :deep(tr:hover) {
  background-color: var(--color-surface-300);
}
</style>