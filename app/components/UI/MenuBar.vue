<template>
  <nav>
    <AnimateScrollLag v-if="loaded" :active="!!props.scrollLag" :reverse="props.scrollLag === 'reverse'">
      <div />
    </AnimateScrollLag>
  </nav>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { useConstants } from '@/composables/constants';

const { COLORS: _COLORS } = useConstants();

const props = withDefaults(defineProps<{
  type?: 'micro' | 'simple' | 'full',
  featuredText?: string,
  featuredAction?: (() => void) | string,
  primaryColor?: keyof typeof _COLORS,
  secondaryColor?: keyof typeof _COLORS,
  startPosition?: 'start' | 'final',
  animateOnMount?: boolean,
  duration?: number,
  initialDelay?: number,
  delayBetweenItems?: number,
  pin?: boolean,
  scrollLag?: boolean | 'reverse' 
}>(), {
  type: 'micro',
  featuredText: 'Featured',
  featuredAction: () => {},
  primaryColor: 'lavender-100',
  secondaryColor: 'mauve-100',
  startPosition: 'final',
  animateOnMount: false,
  duration: 1,
  initialDelay: 0,
  delayBetweenItems: 0,
  pin: false,
  scrollLag: false
});

const loaded = ref(false);

</script>