<template>
  <h2 ref="heading" class="text-3xl md:text-5xl mb-(--xs-em) flex flex-row gap-1.5"><slot /></h2>
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
      end: `top top+=${menuBarHeight}`,
      onEnter: () => {
        let sectionText = heading.value?.innerText || '';
        const span = heading.value?.querySelector('span');
        if (span) {
          const spanText = span.innerText;
          sectionText = sectionText.replace(spanText, '').trim();
        }
        setCurrentSection(sectionText);
      },
      onEnterBack: () => {
        let sectionText = heading.value?.innerText || '';
        const span = heading.value?.querySelector('span');
        if (span) {
          const spanText = span.innerText;
          sectionText = sectionText.replace(spanText, '').trim();
        }
        setToPreviousSection(sectionText);
      }
    });
  }, 100);
});
    
onUnmounted(() => {
  scrollTrigger.value?.kill();
});
</script>