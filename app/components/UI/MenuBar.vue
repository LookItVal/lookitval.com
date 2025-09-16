<template>
  <div
    ref="menuBar"
    :class="[
      'fixed left-1/2 transform -translate-x-1/2 h-(--l-em) flex flex-row justify-between bg-surface-300 text-3xl',
      props.position === 'top' ? 'top-(--m-em)' : 'bottom-(--m-em)',
      props.type === 'micro' ? 'w-md' : 'w-4xl',
      loaded ? 'visible' : 'invisible',
    ]"
    style="border-radius: 20em 50em 50em 20em;"
  >
    <UILogo ref="logo" />
    <Socials 
      v-if="props.type === 'simple'"
      ref="socialsSection"
      class="m-(--xxxs-em) py-(--xxs-em) rounded-full bg-base-100 aspect-square"
    />
    <UIShimmeringButton
      ref="featuredButton"
      class="p-(--xxxs-em)"
      color1="mauve-100"
      color2="lavender-100"
      :speed="30"
    >
      <p ref="featuredButtonText" class="text-base-100 font-black px-(--s-em)">{{ props.featuredItemText }}</p>
    </UIShimmeringButton>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import type Logo from '@/components/UI/Logo.vue';
import type Socials from '@/components/Socials/Socials.vue';
import type ShimmeringButton from '@/components/UI/ShimmeringButton.vue';

const props = withDefaults(defineProps<{
  position?: 'top' | 'bottom',
  type?: 'micro' | 'simple' | 'full'
  featuredItemText?: string
}>(), {
  position: 'top',
  type: 'micro',
  featuredItemText: 'Untitled'
});

const loaded = ref(false);

const menuBar = ref<HTMLElement | null>(null);
const logo = ref<InstanceType<typeof Logo> | null>(null);
const socialsSection = ref<InstanceType<typeof Socials> | null>(null);
const featuredButton = ref<InstanceType<typeof ShimmeringButton> | null>(null);
const featuredButtonText = ref<HTMLElement | null>(null);

function animateEntrance() {
  const mainDuration = 1;
  const mainEaseFunction = "power1.inOut";
  const initialDelay = 1;

  const ctx = gsap.context(() => {
    const timeline = gsap.timeline();

    const barWidth = menuBar.value?.offsetWidth || 0;
    const barHeight = menuBar.value?.offsetHeight || 0;
    const barTopLeftRadius = getComputedStyle(menuBar.value || document.documentElement).borderTopLeftRadius || '0px';
    const barTopRightRadius = getComputedStyle(menuBar.value || document.documentElement).borderTopRightRadius || '0px';
    const buttonHeight = featuredButton.value?.$el.querySelectorAll('.shimmering-button')[0]?.clientHeight || 0;
    const buttonWidth = featuredButton.value?.$el.querySelectorAll('.shimmering-button')[0]?.clientWidth || 0;
    
    gsap.set(menuBar.value, { 
      borderBottomLeftRadius: barTopRightRadius,
      borderTopRightRadius: barTopRightRadius,
      borderBottomRightRadius: barTopRightRadius,
      borderTopLeftRadius: barTopRightRadius,
      scale: 0,
      width: barHeight || 0,
    });
    gsap.set(featuredButtonText.value, { text: '' });
    gsap.set(featuredButton.value?.$el.querySelectorAll('.shimmering-button'), {
      width : buttonHeight!,
      scale: 0
    });
    gsap.set(socialsSection.value?.$el, { opacity: 0 });

    // Animate the entrance of the menu bar
    timeline.to(menuBar.value, {
      duration: mainDuration * 1.5,
      scale: 1,
      ease: 'elastic.out(1,0.4)'
    }, initialDelay)
    .to(menuBar.value, {
      duration: mainDuration,
      width: barWidth,
      ease: mainEaseFunction
    }, `>-${(mainDuration*3) / 5}`)
    .to(menuBar.value, {
      duration: mainDuration / 2,
      borderBottomLeftRadius: barTopLeftRadius,
      borderTopLeftRadius: barTopLeftRadius,
      ease: mainEaseFunction,
    }, `>-${mainDuration / 2}`);

    // Fade in the logo, socials, and button
    timeline.to(socialsSection.value?.$el, {
      duration: mainDuration / 2,
      opacity: 1,
      ease: 'power2.out'
    })
    .to(featuredButton.value?.$el.querySelectorAll('.shimmering-button'), {
      duration: mainDuration,
      scale: 1,
      ease: 'elastic.out(1,1)'
    }, `<-${(mainDuration*2) / 3}`);


    // Animate the button
    timeline.to(featuredButtonText.value, {
      duration: mainDuration,
      text: props.featuredItemText,
      ease: 'power1.inOut',
      onComplete: () => {
        ctx.revert();
      }
    })
    .to(featuredButton.value?.$el.querySelectorAll('.shimmering-button'), {
      duration: mainDuration,
      width: buttonWidth,
      ease: mainEaseFunction
    }, '<');
  });
}

onMounted(() => {
  animateEntrance();
  loaded.value = true;
});
</script>