<template>
  <NuxtLink :to="to" :class="`navigationButton h-10 w-10 bg-surface-300 rounded-full ${!to ? 'invisible pointer-events-none' : 'visible pointer-events-auto'}`">
    <Icon :name="direction === 'back' ? 'material-symbols:arrow-back-ios-rounded' : 'material-symbols:arrow-forward-ios-rounded'" class="pl-[1.5em]" />
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{
  direction: 'back' | 'forward'
  to: string
  label?: string
}>();
</script>

<style scoped>
.navigationButton {
  color: var(--color-subtext-100) !important;
}
.navigationButton:hover {
  color: var(--color-text-100) !important;
}
</style>