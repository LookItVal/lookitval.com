<template>
  <div>
    <div :class="['fixed h-svh w-svw flex flex-col items-center justify-center z-10 pointer-events-none', { hide: loaded }]">
      <div class="loading-screen absolute top-0 left-0 w-full h-full bg-base z-10"/>
      <TextAnimationsDecryptedText
        ref="loadingText"
        parent-class-name="loading-text flip-transition text-3xl md:text-6xl font-black whitespace-nowrap z-11"
        text="Quinn Valencia Cecil"
        :speed="100"
        :max-iterations="10"
        :sequential="true"
        reveal-direction="center"
        :use-original-chars-only="false"
        characters="*⋅·∙‧᛫◦•∘●◌⊙⊛⊚⦿Ｏ○◉"
        animate-on="view"
      />
    </div>
    <div class="background-lambda landing flex flex-row-reverse md:flex-row justify-between items-center h-[100svh] md:pl-(--l-em) overflow-hidden">
      <div class="home-text z-1 flex flex-col card-background-lambda absolute right-(--l-em) max-md:top-[5rem] p-[1.5rem] gap-[0.5rem] w-max rounded-[3rem] md:relative ">
        <h1 ref="pageText" class="text-3xl md:text-6xl !font-black whitespace-nowrap z-50">Quinn Valencia Cecil</h1>
        <HomeJobTitles class="mb-(--s-em) z-0 text-2xl md:text-3xl" />
        <Socials class="z-1 h-[1.5em]" />
      </div>
      <div class="portrait">
        <img
          src="/images/DitherPortrait.png"
          alt="Quinn Valencia Cecil"
          class="relative object-cover object-right right-0 top-0 h-[100vh] z-0 drop-shadow-xl"
        >
      </div>
      <BackgroundsDither 
        class="-z-10"
        :wave-color="[0.3451, 0.3569, 0.4392]"
        :enable-mouse-interaction="false"
        :wave-speed="0.01"
        :pixel-size="2"
        :color-num="5"
      />
    </div>
    <div class="about-me flex flex-col md:flex-row items-center justify-between px-(--m-em) py-(--s-em) bg-base">
      <HomeHexPhoto class="max-md:!size-svw md:w-1/2" />
      <div class="flex flex-col items-center md:w-3/4">
        <div class="flex flex-row text-3xl md:text-5xl font-bold pb-(--xxs-em)">
          <h2>About</h2>
          <ShimmeringText
            class="pl-(--xxs-em)"
            text=" Me"
            as="h2"
            fg-color="green"
            bg-color="teal"
          />
        </div>
        <p class="text-lg md:text-xl pb-(--xs-em)">
          I am a former audio engineer with over seven years of experience in the video production industry, pivoting my career into technology. I've been developing software for years, building a strong skill set that spans a wide range of fields, including data science, database management, system automation, and web development. My background in audio engineering has given me a unique perspective on problem-solving and creativity, and an acute attention to detail that I bring to every project I work on. 
        </p>
        <ShimmeringButton
          color="green"
          @click="viewResume"
        >
          <p class="text-xl md:text-2xl py-(--xs-em) px-(--s-em) text-base font-black">My Resume</p>
        </ShimmeringButton>
        <PDFViewer ref="resumePDF" pdf-url="https://docs.google.com/document/d/1ZvWFu-CFvC8oW8W4hgGEbTAkc00s-URR3osO16rttos/export?format=pdf" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue';
const test = "⋅·∙‧᛫◦•∘*●◌⊙⊛⊚⦿Ｏ○◉◯";
console.log('test length', test.length);

const resumePDF: Ref<PDFViewer | null> = ref(null);

const loadingText = ref<ComponentPublicInstance | HTMLElement | null>(null);
const pageText = ref<ComponentPublicInstance | HTMLElement | null>(null);

const loadingTextBoundingClientRect: Ref<DOMRect | null> = ref(null);
const pageTextBoundingClientRect: Ref<DOMRect | null> = ref(null);

function viewResume() {
    resumePDF.value!.toggleVisibility();
}

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

 
  if (loadingText.value && pageText.value) {
    setTimeout(() => {
      console.log('type', typeof loadingText.value, typeof pageText.value);
      // If loadingText is a component, use $el to get the DOM element
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


  window.scrollTo({ top: 0, behavior: 'auto' });
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
    top: 0;
    right: 7.5%;
    font-size: v-bind('textHeight + "px"');
    color: var(--color-surface0);
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
    background-color: color-mix(in srgb, var(--color-surface0) 75%, transparent);
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
