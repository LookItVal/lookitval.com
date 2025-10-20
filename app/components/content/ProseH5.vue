<template>
  <h6 ref="heading" class="text-base md:text-lg mb-(--xs-em) flex flex-row gap-1.5"><slot /></h6>
</template>

<script lang="ts" setup>
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const { trackNavigation, setCurrentSection, setToPreviousSection } = useNavigationTracking();

const heading = ref<HTMLElement | null>(null);

const scrollTrigger = ref<ScrollTrigger | null>(null);

onMounted(() => {
  if (!trackNavigation) return;
  setTimeout(() => {
    const menuBar = document.getElementById('heading');
    const menuBarHeight = menuBar ? menuBar.offsetHeight : 0;

    scrollTrigger.value = ScrollTrigger.create({
      trigger: heading.value,
      start: `top top+=${menuBarHeight}`,
      end: 'bottom top',
      onEnter: () => {
        setCurrentSection(heading.value?.innerText || '');
      },
      onEnterBack: () => {
        setToPreviousSection();
      }
    });
  }, 100);
});
    
onUnmounted(() => {
  scrollTrigger.value?.kill();
});
</script>