<template>
  <div>
    <div ref="footnoteContainer" class="rounded-full p-(--xs-em) bg-surface-300 z-9" style="min-height: calc(var(--xs-em) * 2 + 1em); min-width:  calc(var(--xs-em) * 2 + 1em); transform-origin: bottom center; transform: scale(0);">
      <p ref="footnoteText" class="text-base md:text-lg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';
import { useFootnotes } from '@/composables/footnotes';

const { footnote, footnotePreview } = useFootnotes();

const note = ref<string>('');
const activeAnimation = ref<gsap.core.Timeline | null>(null);

const footnoteContainer = ref<HTMLElement | null>(null);
const footnoteText = ref<HTMLElement | null>(null);

async function updateFootnote() {
  const original = note.value;
  if (footnotePreview.value) {
    note.value = footnotePreview.value;
  } else if (footnote.value) {
    note.value = footnote.value;
  } else {
    note.value = '';
  }
  if (original === note.value) {
    return;
  }
  if (activeAnimation.value) {
    activeAnimation.value.kill();
    activeAnimation.value = null;
  }
  if (original === '') {
    activeAnimation.value = animateIn(note.value);
  } else if (note.value === '') {
    activeAnimation.value = animateOut();
  } else if (original !== note.value) {
    const timeline = gsap.timeline({
      onComplete: () => {
        activeAnimation.value = null;
      }
    });
    activeAnimation.value = timeline;
    timeline.add(updateText(''));
    timeline.add(updateText(note.value), '+=0.1');
  }
}

watch(footnote, updateFootnote);
watch(footnotePreview, updateFootnote);

function animateIn(text: string) {
  const timeline = gsap.timeline({
    onComplete: () => {
      activeAnimation.value = null;
    }
  });
  timeline.add(gsap.to(footnoteContainer.value, { 
    scale: 1,
    duration: 0.3,
    ease: 'back.out'
  }), 0);
  timeline.add(updateText(text));
  return timeline;
}

function animateOut() {
  const timeline = gsap.timeline({
    onComplete: () => {
      activeAnimation.value = null;
    }
  });
  timeline.add(updateText(''));
  timeline.add(gsap.to(footnoteContainer.value, { 
    scale: 0,
    duration: 0.3,
    ease: 'power1.in'
  }));
  return timeline;
}

function updateText(newText: string) {
  const timeline = gsap.timeline();
  timeline.to(footnoteText.value, {
    text: newText,
    duration: 0.3,
    ease: 'power1.out'
  }, 0);
  return timeline;
}
</script>