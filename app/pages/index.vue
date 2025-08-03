<template>
  <div class="background-lambda landing flex justify-between items-center h-[100svh] pl-(--l-em) overflow-y-hidden">
    <div class="home-text flex flex-col items-start z-1">
      <h1 class="text-6xl font-bold whitespace-nowrap">Quinn Valencia Cecil</h1>
      <HomeJobTitles class="mb-(--s-em)" />
      <Socials />
    </div>
    <div class="portrait">
      <img
        src="/images/DitherPortrait.png"
        alt="Quinn Valencia Cecil"
        class="relative object-cover object-right right-0 top-0 h-[100vh] z-0"
      />
    </div>
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
  if (window.innerWidth <= 768) return 0;
  const container = document.querySelector('.landing');
  if (!container) return -1;
  const leftText = container.querySelector('.home-text');
  if (!leftText) return -1;
  const rightImage = container.querySelector('.portrait');
  if (!rightImage) return -1;
  const aspectRatio = 435/876;
  const height = rightImage.clientHeight;
  const imageWidth = height * aspectRatio;
  const padding = parseFloat(getComputedStyle(container).paddingLeft);
  const textWidth = leftText.clientWidth;
  return Math.min(container.clientWidth - (imageWidth + padding + textWidth), 0);
}

const textHeight = ref(0);

const landingPageOverflow = ref(0);

const landingImageAdjustment = computed(() => {
  return landingPageOverflow.value / 2;
});

const landingTextAdjustment = computed(() => {
  const container = document.querySelector('.landing')!;
  const padding = parseFloat(getComputedStyle(container).paddingLeft);
  return Math.min(landingPageOverflow.value / 3, padding - 5);
})
</script>

<style scoped>
.home-text {
  transform: translateX(v-bind('landingTextAdjustment + "px"'));
  transition: transform 0.4s ease-in-out;
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
