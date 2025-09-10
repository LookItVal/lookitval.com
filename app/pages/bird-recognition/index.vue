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
      <h1 ref="mainHeading" class="main-heading text-4xl font-bold text-center text-nowrap mb-8 z-20">Bird Recognition</h1>
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
import { Flip } from "gsap/Flip";
import { useAudio } from '@/composables/audio';
import { useClassifier } from '@/composables/birdClassifier';
const { toggleRecording } = useAudio();
const { classifierBuffer, initPackages, loadingProgress, loadingStep } = useClassifier();

const loadingScreen = ref<HTMLElement>();
const mainHeading = ref<HTMLElement>();
gsap.registerPlugin(Flip);

function revealPage() {
  if (loadingScreen.value) {
    console.log('Revealing page');
    const timeline = gsap.timeline();
    const beginningState = Flip.getState(mainHeading.value!);
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
    // Toggle the "main-heading" class before running Flip animation
    mainHeading.value!.classList.toggle('main-heading');
    const flipAnimation = Flip.from(beginningState, {
      duration: 0.75,
      delay: 0.5,
      ease: 'power2.inOut'
    });
    timeline.add(flipAnimation, 0);
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

<style scoped>
.main-heading {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>