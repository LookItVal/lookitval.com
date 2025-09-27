<template>
  <div class="min-h-screen">
    <div class="page-initializer fixed top-0 left-0 right-0 bottom-0 bg-base-100 -translate-y-full z-10000" />
    <BackgroundsBirds
      v-if="highPerformance"
      ref="backgroundBirds"
      class="fixed top-0 left-0 right-0 bottom-0 -z-10 opacity-75"
      :mouse-controls="false"
      :touch-controls="false"
      color1="mauve-500"
      color2="lavender-500"
      background-color="crust-100"
      :background-alpha="0.0"
      :quantity="3"
    />
    <PDFViewer ref="resumePDF" pdf-url="https://docs.google.com/document/d/1ZvWFu-CFvC8oW8W4hgGEbTAkc00s-URR3osO16rttos/export?format=pdf" />
    <h1
      ref="intermediateMainHeading"
      class="fixed text-2xl lg:text-6xl font-bold text-center text-nowrap mb-(--s-em) z-11"
      data-flip-id="main-heading"
      style="display: none;"
    >
      Bird Recognition
    </h1>
    <div 
      ref="loadingScreen"
      class="loading-screen fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center"
      :style="isLoaded ? 'display: none;' : ''"
    >
      <div ref="loadingBackground" class="absolute top-0 left-0 right-0 bottom-0 bg-base-100 -z-10" />
      <div class="z-11 h-(--xl-em)">
        <h1
          ref="mainHeadingLoading"
          class="text-2xl lg:text-6xl font-bold text-center text-nowrap mb-(--s-em) z-11"
          data-flip-id="main-heading"
        >
          Bird Recognition
        </h1>
      </div>
      <UIFeatherLoadingBar
        ref="loadingBar"
        class="w-full h-(--xxl-em) px-(--m-em)"
        :progress="loadingProgress"
      />
      <p ref="loadingStepText" class="mt-(--s-em) text-center text-lg">{{ loadingStep }}</p>
    </div>
    <AnimationsScrollLag
      v-if="loadingProgress >= 0.99" 
      ref="faqSection"
      class="fixed bottom-(--m-em) right-(--m-em) z-50 opacity-0" 
      :reverse="true"
    >
      <BirdClassificationFAQ />
    </AnimationsScrollLag>
    <div ref="pageWrapper">
      <div ref="pageContent" class="flex flex-col items-center justify-between px-(--m-em) min-h-screen">
        <UIMenuBar
          v-if="loaded"
          ref="menuBar"
          class="py-(--s-em)"
          startPosition="start"
          :animate-on-mount="false"
          :pin="false"
          :featured-action="viewResume"
          featured-text="Résumé"
          :scroll-lag="true"
        />
        <div
          class="flex flex-col items-center justify-center md:text-3xl text-xl w-full"
          style="min-height: calc(100svh - var(--l-em) - (var(--s-em) * 2));"
        >
          <UICard
            ref="mainContentCard"
            class="flex flex-col items-center justify-center p-(--s-em) w-full max-w-6xl"
            depth="surface"
            :opacity="0.5"
          >
            <div class="z-11 h-(--xl-em)">
              <h1
                ref="mainHeading"
                class="relative text-2xl lg:text-6xl font-bold text-center text-nowrap mb-(--s-em) z-11"
                data-flip-id="main-heading"
                style="display: none;"
              >
                Bird Recognition
              </h1>
            </div>
            <UICard
              ref="predictionsCard"
              class="flex flex-col items-center justify-center w-min-[10rem] w-min-[45%] p-(--s-em) mb-(--s-em)"
              depth="overlay"
              :opacity="0.5"
            >
              <h2 ref="predictionsHeading" class="text-lg lg:text-2xl font-semibold text-center mb-(--s-em) mx-(--l-em)">Sounds like...</h2>
              <div>
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
              </div>
            </UICard>
            <BirdClassificationLiveWaveform ref="liveWaveform" />
          </UICard>
          <BirdClassificationRecordButton 
            ref="recordButton"
            class="mt-(--s-em)"
            @click="toggleRecording"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { Flip } from "gsap/Flip";
import { useAudio } from '@/composables/audio';
import { useClassifier } from '@/composables/birdClassifier';
import { useSmoothScroller } from '@/composables/smoothScroller';
import type FAQ from '~/components/BirdClassification/FAQ.vue';
import type RecordButton from '~/components/BirdClassification/RecordButton.vue';
import type LiveWaveform from '~/components/BirdClassification/LiveWaveform.vue';
import type PDFViewer from '~/components/PDFViewer.vue';
import type Birds from '~/components/Backgrounds/Birds.vue';
import type MenuBar from '~/components/UI/MenuBar.vue';
import type Card from '~/components/UI/Card.vue';
import type { ComponentPublicInstance } from 'vue';

const { initSmoothScroller } = useSmoothScroller();
const { toggleRecording, isRecording } = useAudio();
const { classifierBuffer, bufferSize, initPackages, loadingProgress, loadingStep } = useClassifier();
const { highPerformance, calculatePerformance } = usePerformance();
const isLoaded = ref(false);

const pageWrapper = ref<HTMLElement | null>(null);
const pageContent = ref<HTMLElement | null>(null);
initSmoothScroller(pageWrapper, pageContent);

const loaded = ref(false);

const faqSection = ref<InstanceType<typeof FAQ>>();
const loadingScreen = ref<HTMLElement>();
const loadingBackground = ref<HTMLElement>();
const loadingBar = ref<ComponentPublicInstance>();
const loadingStepText = ref<HTMLElement>();
const contentBlock = ref<HTMLElement>();
const mainHeading = ref<HTMLElement>();
const mainHeadingLoading = ref<HTMLElement>();
const intermediateMainHeading = ref<HTMLElement>();
const predictionsHeading = ref<HTMLElement>();
const resumePDF = ref<InstanceType<typeof PDFViewer>>();
const recordButton = ref<InstanceType<typeof RecordButton>>();
const liveWaveform = ref<InstanceType<typeof LiveWaveform>>();
const backgroundBirds = ref<InstanceType<typeof Birds>>();
const menuBar = ref<InstanceType<typeof MenuBar>>();
const mainContentCard = ref<InstanceType<typeof Card>>();
const predictionsCard = ref<InstanceType<typeof Card>>();
const birdList = ref<string[]>([...classifierBuffer.value]);

function viewResume() {
    resumePDF.value!.toggleVisibility();
}

async function revealPage() {
  if (loadingScreen.value) {

    menuBar.value?.animateEntrance({ initialDelay: 1 });
    const timeline = gsap.timeline();
    gsap.set(intermediateMainHeading.value!, { display: 'block' });
    Flip.fit(intermediateMainHeading.value!, mainHeadingLoading.value!);
    gsap.set(mainHeadingLoading.value!, { display: 'none' });
    gsap.set(mainHeading.value!, { display: 'block', opacity: 0 });
    await nextTick();
    const beginningState = Flip.getState([mainHeading.value!, intermediateMainHeading.value!]);
    await nextTick();
    timeline.to([loadingScreen.value!], {
      translateY: '-100%',
      duration: 0.75,
      delay: 0.25,
      ease: 'power1.inOut',
      onComplete: () => {
      loadingScreen.value!.style.display = 'none';
      gsap.set(mainHeadingLoading.value!, { display: 'none' });
      gsap.set(mainHeading.value!, { display: 'block' });
      }
    });
    const flipAnimation = Flip.to(beginningState, {
      duration: 0.75,
      delay: 0.25,
      ease: 'power1.inOut',
      onComplete: () => {
        isLoaded.value = true;
        console.log(isLoaded.value);
        gsap.set(intermediateMainHeading.value!, { display: 'none' });
        gsap.set(mainHeading.value!, { display: 'block', opacity: 1 });
      }
    });
    timeline.add(flipAnimation, 0);
    timeline.to(faqSection.value!.$el, {
      opacity: 1,
      duration: 1,
      ease: 'power1.inOut'
    }, '> + 3');
  }
}


const handleVisibilityChange = () => {
    if (document.hidden) {
      if (isRecording.value) {
        recordButton.value?.$el?.click();
      }
    } else {
      // Resume or re-initialize if needed
    }
  };

onMounted(async () => {
  loaded.value = true;
  // Start performance calculation in parallel with package initialization
  calculatePerformance();
  await initPackages();
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Set size of content block
  const menuHeight = menuBar.value?.$el?.clientHeight || 0;
  if (contentBlock.value) {
    contentBlock.value.style.minHeight = `calc(100vh - ${menuHeight}px)`;
  }
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

watch(loadingProgress, (newProgress) => {
  if (newProgress >= 0.99) {
    revealPage();
  }
});

watch(() => [...classifierBuffer.value], (newBuffer, oldBuffer) => {
  // Global animation settings
  const duration = 0.5;
  const stagger = 0.2; // stagger per item
  const manualDelay = stagger * bufferSize.value; // 0.35 when bufferSize is 5
  const ease = 'power1.inOut';
  // Helper to determine if the list is getting smaller
  const isGettingSmaller = (newBuffer: string[], oldBuffer: string[]) => {
    const newBufferLengths = newBuffer.map(b => b.length);
    const oldBufferLengths = oldBuffer.map(b => b.length);
    const newMax = Math.max(...newBufferLengths);
    const oldMax = Math.max(...oldBufferLengths);
    return newMax < oldMax;
  };
  
  // Capture all states upfront
  if (!liveWaveform.value) return;
  if (!recordButton.value) return;
  if (!mainContentCard.value) return;
  if (!predictionsCard.value) return;
  if (!mainHeading.value) return;
  if (!predictionsHeading.value) return;
  const statePredictionsCard = Flip.getState(predictionsCard.value.$el.querySelector('.card-background'));
  const stateHeadings = Flip.getState([
    predictionsHeading.value,
    mainHeading.value
  ]);
  const statePage = Flip.getState([
    liveWaveform.value.$el,
    recordButton.value.$el,
    mainContentCard.value.$el
  ]);
  // Update birdList with newBuffer and manage size
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
    // Create the main timeline
    const timeline = gsap.timeline();

    const predictions: NodeListOf<Element> = predictionsCard.value?.$el.querySelectorAll('.prediction') || [];
    if (predictions.length === 0) return;
    gsap.set(predictions[0]!, { position: 'absolute', scale: 0, transformOrigin: 'center center', right: 0, left: 0 });
    await nextTick();
    const stateFirst = Flip.getState(predictions[0]!);
    const allButFirst = Array.from(predictions).slice(1);
    const stateOthers = Flip.getState(allButFirst);
    gsap.set(predictions[0]!, { position: 'relative', scale: 1 });
    if (removeLast) {
      gsap.set(predictions[predictions.length - 1]!, { position: 'absolute', left: 0, right: 0 });
    }

    await nextTick();
    
    // Add all flip animations to timeline
    timeline.add(Flip.from(statePage, {
      duration,
      ease,
      nested: true
    }), 0);

    timeline.add(Flip.from(stateHeadings, {
      duration,
      ease,
      nested: true
    }), 0);
    
    if (isGettingSmaller(newBuffer, oldBuffer)) {
      timeline.add(Flip.from(statePredictionsCard, {
        duration: duration + manualDelay,
        ease: 'power2.inOut',
        nested: true,
        onStart: () => {
          gsap.set(predictionsCard.value!.$el.querySelector('.card-background'), { x: 0 }); // Reset any x offset
        }
      }), 0);
    } else {
      timeline.add(Flip.from(statePredictionsCard, {
        duration,
        ease,
      }), 0);
    }
    
    timeline.add(Flip.from(stateFirst, {
      scale: true,
      duration: duration + (manualDelay),
      ease: 'bounce.out',
    }), manualDelay);
    
    timeline.add(Flip.from(stateOthers, {
      duration,
      ease,
      stagger: {
        each: stagger,
        from: "end"
      }
    }), 0.1);
    
    if (removeLast) {
      timeline.add(gsap.to(predictions[predictions.length - 1]!, {
        opacity: 0,
        duration,
        ease,
        onComplete: () => {
          birdList.value.pop();
        }
      }), 0);
    }
  });
});
</script>

<style scoped>
/* Page transition styles */
.page-leave-active, .page-enter-active {
  & .page-initializer {
    transition: transform 0.4s ease-in-out;
  }
}

.page-leave-to, .page-enter-from {
  & .page-initializer {
    transform: translateY(100%) !important;
  }
}
</style>