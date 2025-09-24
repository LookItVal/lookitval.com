<template>
  <nav>
    <AnimateScrollLag v-if="loaded" :active="!!props.scrollLag" :reverse="props.scrollLag === 'reverse'">
      <div
        ref="menuBar"
        :class="[
          'h-(--l-em) p-(--xxs-em) flex flex-row justify-between bg-surface-300 text-3xl',
          props.type === 'micro' ? 'w-sm' : 'w-4xl'
        ]"
        style="border-radius: 20em 50em 50em 20em;"
      >
        <UILogo
          ref="logo"
          :animate-on-mount="false"
          start-position="final"
          :primary-color="props.primaryColor"
          :secondary-color="props.secondaryColor"
        />
        <Socials
          v-if="props.type === 'simple'"
          ref="socialsSection"
          class="py-(--xxs-em) rounded-full bg-base-100"
        />
        <UIShimmeringButton
          ref="featuredButton"
          :color1="props.secondaryColor"
          :color2="props.primaryColor"
          :speed="30"
          :click="props.featuredAction"
        >
          <p ref="featuredButtonText" class="text-base-100 font-black px-(--s-em) text-nowrap">{{ props.featuredText }}</p>
        </UIShimmeringButton>
      </div>
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