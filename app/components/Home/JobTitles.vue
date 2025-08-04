<template>
  <div class="fulltext flex pl-[var(--xs-em)] gap-[var(--xxxs-em)] w-max">
    <h2>-</h2> <ShimmeringText :text="displayText" as="h2" :speed="4" :fg-color="currentColor" :bg-color="currentBgColor" class="gradient-text" />
  </div>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';

const { COLORS: _COLORS } = useConstants();
const texts = [
  { text: "Data Scientist", color: "peach", bg: "red" },
  { text: "Audio Engineer", color: "yellow", bg: "peach" },
  { text: "Web Developer", color: "green", bg: "teal" },
  { text: "Software Engineer", color: "blue", bg: "sapphire" }
];
const displayText: Ref<string> = ref(' ');
const currentTextIndex: Ref<number> = ref(0);
const currentCharIndex: Ref<number> = ref(0);
const isDeleting: Ref<boolean> = ref(false);
const currentColor: ComputedRef<keyof typeof _COLORS> = computed(() => texts[currentTextIndex.value]!.color as keyof typeof _COLORS);
const currentBgColor: ComputedRef<keyof typeof _COLORS> = computed(() => texts[currentTextIndex.value]!.bg as keyof typeof _COLORS);

function typer(): void {
  const currentTextObj = texts[currentTextIndex.value]!;
  const currentText = currentTextObj.text;
  if (isDeleting.value) {
    displayText.value = currentText.substring(0, currentCharIndex.value - 1);
    currentCharIndex.value--;
  } else {
    displayText.value = currentText.substring(0, currentCharIndex.value + 1);
    currentCharIndex.value++;
  }

  if (!isDeleting.value && currentCharIndex.value === currentText.length) {
    setTimeout(() => isDeleting.value = true, 1500);
  } else if (isDeleting.value && currentCharIndex.value === 0) {
    isDeleting.value = false;
    currentTextIndex.value = (currentTextIndex.value + 1) % texts.length;
}

  setTimeout(typer, isDeleting.value ? 75 : 200);
}

onMounted(() => {
  typer();
});
</script>

<style scoped>
.fulltext {
  will-change: border-color;
  contain: layout style paint;

  border-right: 0.2em solid var(--color-text);
  animation: blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: var(--color-text); }
}

.gradient-text {
  contain: style paint;
}
</style>