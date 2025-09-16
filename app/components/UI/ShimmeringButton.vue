<template>
  <div>
    <AnimationsGlareHover 
      v-if="props.glare"
      class="shimmering-button relative overflow-hidden rounded-full  z-1"
      style="width: max-content; height: 100%; border-radius: 50em; border-width: 0;"
    >
      <slot class="z-1"/>
    </AnimationsGlareHover>
    <button
      v-else
      class="shimmering-button relative overflow-hidden rounded-full z-1 0"
    >
      <slot class="z-1"/>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';

const { COLORS: _COLORS } = useConstants();

const props = withDefaults(defineProps<{
  color1?: keyof typeof _COLORS,
  color2?: keyof typeof _COLORS,
  glare?: boolean
  speed?: number
}>(), {
  color1: 'lavender-100',
  color2: 'mauve-100',
  glare: true,
  speed: 3
})

const conicGradient: Ref<string> = ref(`conic-gradient(from 90deg at 50% 50%, var(--color-${props.color1}), var(--color-${props.color2}), var(--color-${props.color1}))`);
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
    contain: layout style paint;

    content: '';
    position: absolute;
    width: 400%;
    aspect-ratio: 1 / 1;
    left: -150%;
    top: -175%;
    z-index: -1;
    border-radius: 50%;
    background: v-bind('conicGradient');
    animation-name: rotate;
    animation-duration: v-bind('props.speed + "s"');
    animation-timing-function: linear;
    animation-iteration-count: infinite;
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