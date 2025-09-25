<template>
  <div>
    <div :class="['fixed h-svh w-svw flex flex-col items-center justify-center z-10 pointer-events-none', { hide: loaded }]">
      <div class="loading-screen absolute top-0 left-0 w-full h-full bg-base-100 z-10"/>
      <TextAnimationsDecryptedText
        ref="loadingText"
        parent-class-name="loading-text flip-transition text-3xl md:text-6xl font-black whitespace-nowrap leading-[1.2] z-11"
        text="Quinn Valencia Cecil"
        :speed="50"
        :max-iterations="20"
        :sequential="true"
        reveal-direction="center"
        :use-original-chars-only="false"
        :show-pre-text="true"
        characters="⋅·∙‧◦•"
        animate-on="view"
      />
    </div>
    <UIMenuBar
      ref="menuBar"
      :animate-on-mount="true"
      class="fixed z-9 top-0 py-(--s-em)"
      :pin="false"
      featured-action="/bird-recognition"
      :initial-delay="3"
      scroll-lag="reverse"
    />
    <div ref="pageWrapper">
      <div ref="pageContent">
        <div class="background-lambda landing relative flex flex-row-reverse md:flex-row justify-between items-center h-[100svh] md:pl-(--l-em)">
          <div class="home-text z-1 flex flex-col card-background-lambda absolute md:relative max-md:right-(--l-em) max-md:top-[5rem] p-[1.5rem] gap-[0.5rem] w-max rounded-[3rem]">
            <h1 ref="pageText" class="text-3xl md:text-6xl !font-black whitespace-nowrap z-50">Quinn Valencia Cecil</h1>
            <HomeJobTitles class="mb-(--s-em) z-0 text-2xl md:text-3xl" />
            <Socials class="z-1 h-[1.5em]" />
          </div>
          <div class="portrait">
            <img
              src="/images/DitherPortrait.png"
              alt="Quinn Valencia Cecil"
              class="relative object-cover object-right right-0 top-0 h-[100svh] z-0 drop-shadow-xl"
            >
          </div>
          <BackgroundsDither
            v-if="highPerformance"
            class="-z-10"
            :wave-color="[0.3451, 0.3569, 0.4392]"
            :enable-mouse-interaction="false"
            :wave-speed="0.01"
            :pixel-size="2"
            :color-num="5"
          />
        </div>
        <HomeAbout class="h-min-[100svh]" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSmoothScroller } from '@/composables/smoothScroller';
const { initSmoothScroller } = useSmoothScroller();
// "⋅·∙‧᛫◦•∘*●◌⊙⊛⊚⦿Ｏ○◉◯"

const { highPerformance, calculatePerformance } = usePerformance();

const pageWrapper = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
initSmoothScroller(pageWrapper, pageContent);


const loadingText = ref<ComponentPublicInstance | HTMLElement | null>(null);
const pageText = ref<ComponentPublicInstance | HTMLElement | null>(null);

const loadingTextBoundingClientRect: Ref<DOMRect | null> = ref(null);
const pageTextBoundingClientRect: Ref<DOMRect | null> = ref(null);

const loaded = ref(false);



useHead({
  title: "Look, It's Val!",
  meta: [
    {
      name: 'description',
      content: 'Personal Portfolio and Website of Quinn Valencia Cecil.'
    }
  ]
});

onMounted(() => {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'auto' });
  function scrollHandler() {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  document.addEventListener('scroll', scrollHandler);
  calculatePerformance();

  if (loadingText.value && pageText.value) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.removeEventListener('scroll', scrollHandler);

      const loadingEl = (loadingText.value && (loadingText.value as ComponentPublicInstance).$el) ? (loadingText.value as ComponentPublicInstance).$el : loadingText.value;
      const pageEl = (pageText.value && (pageText.value as ComponentPublicInstance).$el) ? (pageText.value as ComponentPublicInstance).$el : pageText.value;
      loadingTextBoundingClientRect.value = loadingEl?.getBoundingClientRect?.();
      pageTextBoundingClientRect.value = pageEl?.getBoundingClientRect?.();
      const loadingRect = loadingTextBoundingClientRect.value!;
      const pageRect = pageTextBoundingClientRect.value!;

      const translateX = (loadingRect.left) - (pageRect.left) ;
      const translateY = (loadingRect.top) - (pageRect.top);

      pageEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
      pageEl.style.transition = 'transform 0s ease-in-out';
      setTimeout(() => {
        pageEl.style.transform = 'translate(0, 0)';
        pageEl.style.transition = 'transform 0.4s ease-in-out';
      }, 500);
    }, 2400);
  }

  window.addEventListener('resize', () => {
    landingPageOverflow.value = calcLandingPageOverflow();
    const leftText = document.querySelector('.landing .home-text');
    if (leftText) {
      textHeight.value = leftText.clientHeight * 1.2;
    }
  });
  setTimeout(() => {
    const container = document.querySelector('.landing');
    if (container) {
      Array.from(container.children).forEach(child => {
        child.classList.add('visible');
      });
    }
    landingPageOverflow.value = calcLandingPageOverflow();
    const leftText = document.querySelector('.landing .home-text');
    if (leftText) {
      textHeight.value = leftText.clientHeight * 1.2;
    }
  }, 100);
  loaded.value = true;
});

function calcLandingPageOverflow() {
  const container = document.querySelector('.landing');
  if (!container) return 0;
  const leftText = container.querySelector('.home-text');
  if (!leftText) return 0;
  const rightImage = container.querySelector('.portrait');
  if (!rightImage) return 0;
  const aspectRatio = 435/876;
  const height = rightImage.clientHeight;
  const imageWidth = height * aspectRatio;
  const padding = parseFloat(getComputedStyle(container).paddingLeft);
  const textWidth = leftText.clientWidth;
  if (window.innerWidth < 767) {
    return Math.max(imageWidth - container.clientWidth, 0);
  }
  return Math.min(container.clientWidth - (imageWidth + padding + textWidth), 0);
}

const landingPageOverflow = ref(0);
const textHeight = ref(0);

const landingImageAdjustment = computed(() => {
  if (typeof window === 'undefined') return 0;
  if (window.innerWidth < 767) return landingPageOverflow.value;
  return landingPageOverflow.value / 2;
});

const landingTextAdjustment = computed(() => {
  if (typeof window === 'undefined') return 0;
  if (landingPageOverflow.value == 0) return 0;
  const container = document.querySelector('.landing')!;
  const padding = parseFloat(getComputedStyle(container).paddingLeft);
  return Math.max(landingPageOverflow.value / 3, 0 - padding);
})
</script>

<style scoped>

.loading-screen {
  top: 0;
  transition: transform 0.4s ease-in-out;
  transition-delay: 2.5s;
  transform-origin: top;
}

.loading-text {
    transition: opacity 0.1s ease-in-out;
    transition-delay: 2.8s;
}
.hide {
  & .loading-screen {
    transform: scaleY(0);
  }

  & .loading-text {
    opacity: 0;
  }
}

@media (max-width: 767px) {
  .background-lambda::before {
    content: '';
  }
  .card-background-lambda::before {
    content: 'λ';
    position: absolute;
    top: 0%;
    right: 10%;
    font-size: v-bind('textHeight + "px"');
    color: var(--color-surface-300);
    transform: translateY(-22%);
    z-index: 0;
  }
}

.home-text {
  transform: translateX(v-bind('landingTextAdjustment + "px"'));
  transition: transform 0.4s ease-in-out;

  &:not(.visible) {
    h1 {
      opacity: 0;
      transform: translateX(-50px);
    }
  }
  h1 {
    transition: opacity 0.4s, transform 0.4s;
  }

  @media (max-width: 767px) {
    background-color: color-mix(in srgb, var(--color-surface-300) 75%, transparent);
  }
}

.portrait {
  transition: opacity 0.2s ease-out, transform 0.4s ease-out, filter 0.4s cubic-bezier(.4,.01,0,1);
  transition-delay: 2.8s;

  &:not(.visible) {
    filter: blur(10px);
    opacity: 0;
    transform: translateX(100px);
  }
  &.visible {
    filter: blur(0px);
    opacity: 1;
    transform: translateX(0px);
  }

  img {
    max-width: none;
    image-rendering: pixelated;
    transition: transform 0.4s ease-in-out;
    transform: translateX(v-bind('landingImageAdjustment + "px"'));
    transition-delay: 2.8s;
  }
}
</style>
