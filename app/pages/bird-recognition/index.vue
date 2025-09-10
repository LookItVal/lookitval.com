<template>
  <div id="bird-recognition-page" class="h-svh flex flex-col items-center justify-center">
    <div ref="loadingScreen" class="loading-screen fixed top-0 left-0 w-full h-full bg-base-100 z-10 flex flex-col items-center justify-center">
      <UIFeatherLoadingBar 
        class="w-full h-(--xxl-em) px-(--m-em)"
        :progress="loadingProgress"
      />
      <p class="mt-(--s-em) text-center text-lg">{{ loadingStep }}</p>
    </div>
    <BackgroundsBirds
      class="absolute top-0 left-0 w-full h-full -z-10 opacity-75"
      :mouse-controls="false"
      :touch-controls="false"
      color1="mauve-500"
      color2="lavender-500"
      background-color="crust-100"
      :background-alpha="0.0"
      :quantity="3"
    />
    <UICard
      class="flex flex-col items-center justify-center px-(--m-em) py-(--s-em) w-full max-w-6xl"
      depth="surface"
      :opacity="0.5"
    >
      <h1 class="text-4xl font-bold text-center mb-8">Bird Recognition</h1>
      <div>
        <div v-for="(bird, index) in classifierBuffer" :key="index">
          <UICard
            depth="item"
            :opacity="0.5"
          >
            <p>{{ bird }}</p>
          </UICard>
        </div>
      </div>
      <BirdClassificationLiveWaveform />
    </UICard>
    <BirdClassificationRecordButton 
      class="mt-(--s-em)"
      @click="toggleRecording"
    />
  </div>
</template>


<script lang="ts" setup>
import { gsap } from 'gsap';
import { useAudio } from '@/composables/audio';
import { useClassifier } from '@/composables/birdClassifier';
const { toggleRecording } = useAudio();
const { classifierBuffer, initPackages, loadingProgress, loadingStep } = useClassifier();

const loadingScreen = ref<HTMLElement>();

function revealPage() {
  if (loadingScreen.value) {
    console.log('Revealing page');
    const timeline = gsap.timeline();
    loadingScreen.value!.style.transformOrigin = 'top';
    timeline.to(loadingScreen.value, {
      scaleY: 0,
      duration: 0.75,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
      loadingScreen.value!.style.display = 'none';
      }
    });
  }
}

onMounted(async () => {
  await initPackages();
  // Simulate loading progress over 5 seconds
});

watch(loadingProgress, (newProgress) => {
  if (newProgress >= 0.99) {
    revealPage();
  }
});
</script>