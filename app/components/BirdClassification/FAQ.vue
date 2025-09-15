<template>
  <div>
    <UICard 
      v-if="openButtonState"
      ref="openButton"
      class="relative p-(--m-em) max-w-(--xxl-em) mx-auto text-center"
      :class="opened ? 'hidden' : ''"
      depth="surface"
      data-flip-id="faq-card"
    >
      <button 
        class="absolute top-0 left-0 bottom-0 right-0 text-subtext-300 hover:text-text-100 transition-colors duration-300"
        @click.stop="toggleOpened"
      >
        <Icon ref="questionIcon" name="material-symbols:question-mark-rounded" class="absolute inset-0 m-auto" />
      </button>
    </UICard>
    <UICard 
      v-if="faqCardState"
      ref="faqCard"
      class="relative p-(--m-em) min-w-[50vw] max-w-4xl"
      :class="!opened ? 'hidden' : ''"
      depth="surface"
      data-flip-id="faq-card"
    >
      <button 
        class="absolute top-(--xxs-em) right-(--xxs-em) p-(--xs-em) text-subtext-300 hover:text-text-100 transition-colors duration-300"
        @click="toggleOpened"
      >
        <Icon ref="cancelIcon" name="material-symbols:cancel-outline-rounded" />
      </button>
      <div 
        v-for="(item, index) in faqData.faq" 
        :key="index" 
        :class="index !== faqData.faq.length - 1 ? 'mb-(--s-em)' : ''"
      >
        <details
          @toggle="(event: Event) => updateDataState(event, index)"
        >
          <summary 
            class="font-semibold text-lg cursor-pointer"
          >
            {{ item.question }}
          </summary>
          <p></p>
        </details>
        <p
          class="text-base mt-2"
          :data-state="faqStates[index] ? 'open' : 'hidden'"
          v-gsap.onState-state-open.animateText.fast
        >
          {{ item.answer }}
        </p>
      </div>
    </UICard>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

import Card from '@/components/UI/Card.vue';

const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

const faqCard = ref<InstanceType<typeof Card> | null>(null);
const openButton = ref<InstanceType<typeof Card> | null>(null);
const questionIcon = ref<InstanceType<typeof Card> | null>(null);
const cancelIcon = ref<InstanceType<typeof Card> | null>(null);
const opened = ref(false);
const openButtonState = ref(true);
const faqCardState = ref(false);
const faqStates = ref<boolean[]>([]);

// Initialize faqStates array when faqData is loaded
watchEffect(() => {
  if (faqData.value?.faq) {
    faqStates.value = new Array(faqData.value.faq.length).fill(false);
  }
});

function updateDataState(event: Event, index: number) {
  const target = event.target as HTMLDetailsElement;
  faqStates.value[index] = target.open;
}

async function toggleOpened() {
  const setTo = !opened.value;
  if (setTo === false) {
    const anyOpen = faqStates.value.some(state => state);
    faqStates.value = faqStates.value.map(() => false);
    if (anyOpen) {
      await new Promise(resolve => setTimeout(resolve, 1750));
    }
  }
  openButtonState.value = true;
  faqCardState.value = true;
  opened.value = false;
  await nextTick();
  const backgrounds = [
    faqCard.value?.$el.querySelectorAll('.card-background'),
    openButton.value?.$el.querySelectorAll('.card-background')
  ];
  backgrounds.forEach((bg) => {
    bg.forEach((el: Element) => {
      el.setAttribute('data-flip-id', 'background');
    });
  });
  const cardContents = [
    faqCard.value?.$el.querySelectorAll('.contents'),
    openButton.value?.$el.querySelectorAll('.contents')
  ];
  cardContents.forEach((content) => {
    content.forEach((el: Element) => {
      el.setAttribute('data-flip-id', 'content');
    });
  });
  gsap.set(cardContents.flat().filter(Boolean), { display: 'block' });
  await nextTick();
  const timeline = gsap.timeline();
  timeline.to([questionIcon.value?.$el, cancelIcon.value?.$el].filter(Boolean), {
    opacity: 0,
    duration: 0.125,
    ease: "power1.inOut",
    onStart: () => {
      opened.value = !setTo;
      gsap.set(cardContents.flat().filter(Boolean), { display: 'contents' });
    },
    onComplete: () => {
      opened.value = true;
      gsap.set(cardContents.flat().filter(Boolean), { display: 'block' });
    }
  });
  const stateBackground = Flip.getState(backgrounds.filter(Boolean));
  const stateContent = Flip.getState(cardContents.filter(Boolean));
  opened.value = !opened.value;
  await nextTick();
  if (setTo) {
    timeline.add(Flip.from(stateBackground, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: true,
      nested: true,
      onComplete: () => {
        opened.value = setTo;
        openButtonState.value = !opened.value;
        faqCardState.value = opened.value;
      }
    }), '>+0.01');
    timeline.add(Flip.from(stateContent, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: false,
      scale: true,
      nested: true
    }), "<");
  } else {
    timeline.add(Flip.to(stateBackground, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: true,
      nested: true,
      onComplete: () => {
        opened.value = setTo;
        openButtonState.value = !opened.value;
        faqCardState.value = opened.value;
      }
    }), '>+0.01');
    timeline.add(Flip.to(stateContent, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: false,
      scale: true,
      nested: true
    }), "<");
  }
  timeline.to([questionIcon.value?.$el, cancelIcon.value?.$el].filter(Boolean), {
    opacity: 1,
    duration: 0.125,
    ease: "power1.inOut"
  });
}
</script>

