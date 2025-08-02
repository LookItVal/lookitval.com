<template>
  <div class="fulltext flex pl-[var(--xs-em)]">
    <h2>-</h2> <GradientText :text="displayText" header-tag="h2" :color="currentColor" class="gradient-text" />
  </div>
</template>

<script lang="ts" setup>
const texts = [
  { text: "Data Scientist", color: "orange" },
  { text: "Audio Engineer", color: "yellow" },
  { text: "Web Developer", color: "green" },
  { text: "Software Developer", color: "blue" }
];
const displayText: Ref<string> = ref(' ');
const currentTextIndex: Ref<number> = ref(0);
const currentCharIndex: Ref<number> = ref(0);
const isDeleting: Ref<boolean> = ref(false);
const currentColor: ComputedRef<string> = computed(() => texts[currentTextIndex.value]!.color);

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
    setTimeout(() => isDeleting.value = true, 1000);
  } else if (isDeleting.value && currentCharIndex.value === 0) {
    isDeleting.value = false;
    currentTextIndex.value = (currentTextIndex.value + 1) % texts.length;
}

  setTimeout(typer, isDeleting.value ? 100 : 200);
}

onMounted(() => {
  typer();
});
</script>

<style scoped>
.fulltext {
  will-change: border-color;
  contain: layout, style, paint;

  border-right: 0.2em solid var(--color-text);
  animation: blink-caret 0.75s step-end infinite;
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: var(--color-text); }
}

.gradient-text {
  contain: style, paint;
}
</style>