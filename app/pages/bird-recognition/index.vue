<template>
  <div id="bird-recognition-page" class="flex flex-col min-h-screen items-center justify-center p-(--m-em)">
    <div ref="loadingScreen" class="loading-screen fixed top-0 left-0 w-full h-full bg-base-100 z-10 flex flex-col items-center justify-center">
      <UIFeatherLoadingBar 
        class="w-full h-(--xxl-em) px-(--m-em)"
        :progress="loadingProgress"
      />
      <p class="mt-(--s-em) text-center text-lg">{{ loadingStep }}</p>
    </div>
    <BackgroundsBirds
      class="fixed top-0 left-0 w-full h-full -z-10 opacity-75"
      :mouse-controls="false"
      :touch-controls="false"
      color1="mauve-500"
      color2="lavender-500"
      background-color="crust-100"
      :background-alpha="0.0"
      :quantity="3"
    />
    <UICard
      class="flex flex-col items-center justify-center p-(--m-em) w-full max-w-6xl"
      depth="surface"
      :opacity="0.5"
    >
      <h1 ref="mainHeading" class="main-heading text-2xl lg:text-6xl font-bold text-center text-nowrap mb-(--s-em) z-20">Bird Recognition</h1>
      <UICard
        id="predictionsCard"
        class="w-min-[45%] p-(--s-em) mb-(--s-em)"
        depth="overlay"
        :opacity="0.5"
      >
        <h2 class="text-lg lg:text-2xl font-semibold text-center mb-(--s-em)">Sounds like...</h2>
        <div v-for="(bird, idx) in birdList" :key="bird">
          <UICard
            class="prediction mb-(--xxs-em) px-(--xs-em) py-(--xxs-em) text-center text-sm lg:text-lg"
            depth="item"
            :opacity="0.5"
            :data-flip-id="idx"
          >
            <p>{{ bird }}</p>
          </UICard>
        </div>
      </UICard>
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
const { classifierBuffer, bufferSize, initPackages, loadingProgress, loadingStep } = useClassifier();
gsap.registerPlugin(Flip);

const loadingScreen = ref<HTMLElement>();
const mainHeading = ref<HTMLElement>();
const birdList = ref<string[]>([...classifierBuffer.value]);


function revealPage() {
  if (loadingScreen.value) {
    console.log('Revealing page');
    const timeline = gsap.timeline();
    const beginningState = Flip.getState(mainHeading.value!);
    timeline.to(loadingScreen.value, {
      translateY: '-100%',
      duration: 0.75,
      delay: 1,
      ease: 'power2.inOut',
      onComplete: () => {
      loadingScreen.value!.style.display = 'none';
      }
    });
    // Toggle the "main-heading" class before running Flip animation
    mainHeading.value!.classList.toggle('main-heading');
    const flipAnimation = Flip.from(beginningState, {
      duration: 0.75,
      delay: 1,
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

watch(() => [...classifierBuffer.value], (newBuffer, oldBuffer) => {  
  let totalBuffer: string[] = [];
  let removeLast = false;
  
  if (oldBuffer.length === bufferSize.value) {
    totalBuffer = [...newBuffer, oldBuffer[oldBuffer.length - 1]!];
    removeLast = true;
  } else {
    totalBuffer = [...newBuffer];
  }
  birdList.value = totalBuffer; // Now update the reactive data
  
  nextTick(async () => {
    const predictions = document.querySelectorAll("#predictionsCard .prediction");
    gsap.set(predictions[0]!, { position: 'absolute', scale: 0, transformOrigin: 'center center' });
    await nextTick();

    const stateFirst = Flip.getState(predictions[0]!);
    const allButFirst = Array.from(predictions).slice(1);
    const stateOthers = Flip.getState(allButFirst);
    gsap.set(predictions[0]!, { position: 'relative', scale: 1 });
    if (removeLast) {
      gsap.set(predictions[predictions.length - 1]!, { position: 'absolute', yPercent: 0 });
    }
    await nextTick();
    Flip.from(stateFirst, {
      scale: true,
      duration: 0.5,
      delay: 0.3,
      ease: 'bounce.out',
    });
    Flip.from(stateOthers, {
      duration: 0.5,
      ease: 'power2.out',
      stagger: {
        each: 0.1,
        from: "end"
      }
    });
    if (removeLast) {
      gsap.to(predictions[predictions.length - 1]!, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          birdList.value.pop();
        }
      });
    }
  });
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