<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const colorMap = {
  surface: 'var(--color-surface-300)',
  overlay: 'var(--color-surface-200)',
  item: 'var(--color-surface-100)'
}
const radiusMap = {
  item: 1 * 1.618033988749 ** 2
}
radiusMap['overlay'] = radiusMap['item'] * 1.618033988749
radiusMap['surface'] = radiusMap['overlay'] * 1.618033988749

const props = withDefaults(defineProps<{
  depth: 'surface' | 'overlay' | 'item'
  opacity: number
}>(), {
  depth: 'surface',
  opacity: 1
})

const backgroundColor: Computed<string> = computed(() => {
  return colorMap[props.depth] || colorMap['surface']
})
const borderRadius: Computed<string> = computed(() => {
  return radiusMap[props.depth] || radiusMap['surface']
})
</script>

<style scoped>
.ui-card {
  position: relative;
}
.ui-card::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: v-bind(`${borderRadius}rem`);
  background-color: v-bind(backgroundColor);
  opacity: v-bind(props.opacity);
}
</style>