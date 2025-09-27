<template>
  <div data-lag="1">
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
      class="relative p-(--m-em) min-w-[50vw] max-w-4xl text-3xl"
      :class="!opened ? 'hidden' : ''"
      depth="surface"
      data-flip-id="faq-card"
    >
      <button 
        class="absolute top-(--s-em) right-(--s-em) p-(--xxxs-em) text-subtext-300 hover:text-text-100 transition-colors duration-300"
        @click="toggleOpened"
      >
        <Icon ref="cancelIcon" name="material-symbols:cancel-outline-rounded" />
      </button>
      <div 
        v-for="(item, index) in faqData?.faq || []" 
        :key="index" 
        :class="index !== (faqData?.faq?.length || 0) - 1 ? 'mb-(--s-em)' : ''"
      >
        <details
          @click.prevent="(event: Event) => updateDataState(event, index)"
        >
          <summary 
            class="font-semibold text-lg cursor-pointer"
          >
            {{ item.question }}
          </summary>
          <p/>
        </details>
        <p
          v-gsap.onState-state-open.animateText.fast
          class="text-base mt-2"
          :data-state="faqStates[index] ? 'open' : 'hidden'"
          v-html="parseLinks(item.answer)"
        />
        <p
            class="absolute text-base -translate-y-full"
            :style="`padding-right: ${faqPadding}; opacity: ${faqStates[index] ? 1 : 0}; transition: opacity ${faqStates[index] ? 2 : 0}s ease-in-out ${faqStates[index] ? item.answer.length * 0.005 : 0}s; pointer-events: ${faqStates[index] ? 'auto' : 'none'};`"
            :data-state="faqStates[index] ? 'hidden' : 'open'"
            v-html="parseLinks(item.answer)"
          />
      </div>
    </UICard>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { Flip } from "gsap/Flip";

import type Card from '@/components/UI/Card.vue';

const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

const faqCard = ref<InstanceType<typeof Card> | null>(null);
const openButton = ref<InstanceType<typeof Card> | null>(null);
const questionIcon = ref<InstanceType<typeof Card> | null>(null);
const cancelIcon = ref<InstanceType<typeof Card> | null>(null);
const opened = ref(false);
const openButtonState = ref(true);
const faqCardState = ref(false);
const faqStates = ref<boolean[]>([]);
const faqPadding = computed(() => {
  if (!faqCard.value) return null;
  const el = faqCard.value.$el as HTMLElement;
  const style = window.getComputedStyle(el);
  return style.getPropertyValue('padding-right');
});

function parseLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// Initialize faqStates array when faqData is loaded
watchEffect(() => {
  if (faqData.value?.faq) {
    faqStates.value = new Array(faqData.value.faq.length).fill(false);
  }
});

function closeAllDetails() {
  const detailsElements = faqCard.value?.$el.querySelectorAll('details');
  detailsElements?.forEach((detail: unknown) => {
    (detail as HTMLDetailsElement).open = false;
  });
  faqStates.value = faqStates.value.map(() => false);
}

function updateDataState(event: Event, index: number) {
  const target = (event.target as HTMLElement).closest('details') as HTMLDetailsElement;
  console.log(target);
  const setTo = target.open;
  closeAllDetails();
  target.open = !setTo;
  faqStates.value[index] = !setTo;
}

async function toggleOpened() {
  const setTo = !opened.value;
  if (setTo === false) {
    const anyOpen = faqStates.value.some(state => state);
    const openedIndex = faqStates.value.findIndex(state => state);
    const openedText = faqData.value?.faq?.[openedIndex || 0]?.answer || '';
    closeAllDetails();
    if (anyOpen) {
      await new Promise(resolve => setTimeout(resolve, openedText.length * 5));
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

