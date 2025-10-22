<template>
  <div>
    <div ref="footnoteContainer" class="text-base md:text-lg rounded-full p-(--m-em) bg-surface-300 z-9" style="min-height: calc(var(--m-em) * 2 + 1.5em); min-width:  calc(var(--m-em) * 2 + 1.5em); transform-origin: bottom center; transform: scale(0);">
      <p ref="parsedFootnoteText" class="absolute pr-(--m-em)" style="opacity: 0;" v-html="parseLinks(note)" />
      <p ref="footnoteText" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap';

const { footnote, footnotePreview } = useFootnotes();

const note = ref<string>('');
const activeAnimation = ref<gsap.core.Timeline | null>(null);

const footnoteContainer = ref<HTMLElement | null>(null);
const footnoteText = ref<HTMLElement | null>(null);
const parsedFootnoteText = ref<HTMLElement | null>(null);

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
  gsap.to(parsedFootnoteText.value, {
    duration: 0.1,
    opacity: 0
  });
  if (activeAnimation.value) {
    activeAnimation.value.kill();
    activeAnimation.value = null;
  }
  await nextTick();
  const parsedText = parsedFootnoteText.value?.textContent || "";
  if (original === '') {
    activeAnimation.value = animateIn(parsedText);
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
    timeline.add(updateText(parsedText), '+=0.1');
    timeline.add(gsap.to(parsedFootnoteText.value, {
      duration: 0.3,
      opacity: 1
    }));
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
  timeline.add(gsap.to(parsedFootnoteText.value, {
    duration: 0.3,
    opacity: 1
  }));
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
    duration: 0.5,
    ease: 'power1.out'
  }, 0);
  return timeline;
}

function parseLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
</script>