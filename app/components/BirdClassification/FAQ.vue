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
        <Icon name="material-symbols:question-mark-rounded" class="absolute inset-0 m-auto" />
      </button>
    </UICard>
    <UICard 
      v-if="faqCardState"
      ref="faqCard"
      class="relative p-(--m-em) min-w-[50vw]"
      :class="!opened ? 'hidden' : ''"
      depth="surface"
      data-flip-id="faq-card"
    >
      <button 
        class="absolute top-(--xxs-em) right-(--xxs-em) p-(--xs-em) text-subtext-300 hover:text-text-100 transition-colors duration-300"
        @click="toggleOpened"
      >
        <Icon name="material-symbols:cancel-outline-rounded" />
      </button>
      <h3>This is a heading</h3>
      <p>This is some text inside the FAQ component.</p>
      <h3>This is another heading</h3>
      <p>More text inside the FAQ component.</p>
    </UICard>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

import Card from '@/components/UI/Card.vue';

const faqCard = ref<InstanceType<typeof Card> | null>(null);
const openButton = ref<InstanceType<typeof Card> | null>(null);
const opened = ref(false);
const openButtonState = ref(true);
const faqCardState = ref(false);

async function toggleOpened() {
  const setTo = !opened.value;
  openButtonState.value = true;
  faqCardState.value = true;
  opened.value = false;
  await nextTick();
  const state = Flip.getState([faqCard.value?.$el, openButton.value?.$el]);
  opened.value = !opened.value;
  await nextTick();
  if (setTo) {
    Flip.from(state, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        opened.value = setTo;
        openButtonState.value = !opened.value;
        faqCardState.value = opened.value;
      }
    });
  } else {
    Flip.to(state, {
      duration: 0.5,
      ease: "power1.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        opened.value = setTo;
        openButtonState.value = !opened.value;
        faqCardState.value = opened.value;
      }
    });
  }
}
</script>

