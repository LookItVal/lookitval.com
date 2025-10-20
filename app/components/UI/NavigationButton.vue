<template>
  <NuxtLink
    :to="to"
    :class="`navigationButton h-(--m-em) flex ${direction === 'back' ? 'flex-row' : 'flex-row-reverse'} items-center text-nowrap bg-surface-300 rounded-full ${!to ? 'invisible pointer-events-none' : 'visible pointer-events-auto'}`"
    @mouseenter="handleMouseEnter()"
    @mouseleave="handleMouseLeave()"
  >
    <Icon :name="direction === 'back' ? 'material-symbols:arrow-back-ios-new-rounded' : 'material-symbols:arrow-forward-ios-rounded'" :class="`w-(--m-em) flex items-start ${direction === 'back' ? 'translate-x-[-0.05em]' : 'translate-x-[0.05em]'}`" />
    <p ref="labelElement" />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
const props = defineProps<{
  direction: 'back' | 'forward'
  to: string
  label?: string
}>();

const labelElement = ref<HTMLElement | null>(null);
const currentAnimation = ref<GSAPTimeline | null>(null);

function handleMouseEnter() {
  if (currentAnimation.value) {
    currentAnimation.value.kill();
  }
  const timeline = gsap.timeline();
  timeline.to(labelElement.value, {
    text: props.label || (props.direction === 'back' ? 'Previous' : 'Next'),
    paddingLeft: '0.1em',
    paddingRight: '0.1em',
    x: props.direction === 'back' ? '-0.5em' : '0.5em',
    opacity: 1,
    duration: 0.3,
    ease: 'power1.out',
    onComplete: () => {
      currentAnimation.value = null;
    }
  });
  currentAnimation.value = timeline;
}

function handleMouseLeave() {
  if (currentAnimation.value) {
    currentAnimation.value.kill();
  }
  const timeline = gsap.timeline();
  timeline.to(labelElement.value, {
    text: '',
    paddingLeft: '0em',
    paddingRight: '0em',
    x: '0em',
    opacity: 0,
    duration: 0.3,
    ease: 'power1.out',
    onComplete: () => {
      currentAnimation.value = null;
    }
  });
  currentAnimation.value = timeline;
}
</script>

<style scoped>
.navigationButton {
  color: var(--color-subtext-100) !important;
  text-decoration: none;
}
.navigationButton:hover {
  color: var(--color-text-100) !important;
}
</style>