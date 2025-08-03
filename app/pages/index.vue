<template>
  <div class="background-lambda landing flex justify-between items-center h-[100svh] md:pl-(--l-em) overflow-x-hidden">
    <div class="home-text flex flex-col card-background-lambda absolute right-[0.5rem] max-md:top-[5rem] p-[1.5rem] gap-[0.5rem] w-max rounded-[3rem] z-1 md:relative ">
      <h1 class="text-3xl md:text-6xl font-bold whitespace-nowrap z-1">Quinn Valencia Cecil</h1>
      <HomeJobTitles class="mb-(--s-em) z-1 text-2xl md:text-3xl" />
      <Socials class="z-1 h-[1.5em]" />
    </div>
    <div class="portrait">
      <img
        src="/images/DitherPortrait.png"
        alt="Quinn Valencia Cecil"
        class="relative object-cover object-right right-0 top-0 h-[100vh] z-0"
      />
    </div>
    <BackgroundsDither 
      class="-z-10"
      :wave-color="[255, 255, 255]"
    />
  </div>
</template>

<script lang="ts" setup>
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
});

function calcLandingPageOverflow() {
  if (window.innerWidth <= 767) return 0;
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
  return Math.min(container.clientWidth - (imageWidth + padding + textWidth), 0);
}

const landingPageOverflow = ref(0);
const textHeight = ref(0);

const landingImageAdjustment = computed(() => {
  return landingPageOverflow.value / 2;
});

const landingTextAdjustment = computed(() => {
  if (landingPageOverflow.value == 0) return 0;
  const container = document.querySelector('.landing')!;
  const padding = parseFloat(getComputedStyle(container).paddingLeft);
  return Math.max(landingPageOverflow.value / 3, 0 - padding);
})
</script>

<style scoped>
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

  @media (max-width: 767px) {
    background-color: color-mix(in srgb, var(--color-surface0) 75%, transparent);
  }
}

.portrait {
  transition: opacity 0.2s ease-out, transform 0.4s ease-out, filter 0.4s cubic-bezier(.4,.01,0,1);

  img {
    max-width: none;
    image-rendering: pixelated;
    transition: transform 0.4s ease-in-out;
    transform: translateX(v-bind('landingImageAdjustment + "px"'));
  }
}
</style>
