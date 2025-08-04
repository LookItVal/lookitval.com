<template>
  <div>
    <template v-if="props.glare">
      <AnimationsGlareHover 
        class="shimmering-button relative overflow-hidden rounded-full z-1"
        :width="'max-content'"
        :height="'100%'"
        :border-radius="'50em'" 
      >
        <slot class="z-1"/>
      </AnimationsGlareHover>
    </template>
    <template v-else>
      <button
        class="shimmering-button relative overflow-hidden rounded-full z-1"
      >
        <slot class="z-1"/>
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';

const { COLORS } = useConstants();
const allowedColors = Object.keys(COLORS) as (keyof typeof COLORS)[];

const props = withDefaults(defineProps<{
  color?: typeof allowedColors[number],
  glare?: boolean
}>(), {
  color: 'mauve',
  glare: true
})
</script>

<style scoped>
.shimmering-button {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  width: max-content;
  height: max-content;

  &::before {
    will-change: transform rotate;
    contain: layout, style, paint;

    content: '';
    position: absolute;
    width: 400%;
    aspect-ratio: 1 / 1;
    left: -150%;
    top: -175%;
    z-index: -1;
    border-radius: 50%;
    background: v-bind('`var(--${props.color ?? "purple"}-shimmer)`');
    animation: rotate 5s linear infinite;
    transform-origin: center center;
    pointer-events: none;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>