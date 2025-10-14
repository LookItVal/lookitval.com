<template>
  <span
    ref="footnoteSpan"
    class='cursor-pointer px-0.5 transition-colors duration-300'
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <sup class="relative">
      <div
        ref="footnoteBackground"
        class="absolute top-0 bottom-0 rounded-full aspect-square bg-surface-300 -z-10 -translate-x-1/2 left-1/2 border-1 border-surface-300 transition-border duration-300"
      />
      {{ props.icon }}
    </sup>
  </span>
</template>

<script lang="ts" setup>
import { useConstants } from '@/composables/constants';
import { useFootnotes } from '@/composables/footnotes';

const { COLORS } = useConstants();
const { setFootnote, clearFootnote, setPreview, clearPreview, footnote } = useFootnotes();

const props = withDefaults(defineProps<{
  note: string,
  icon: string,
  color?: keyof typeof COLORS,
  hoverColor?: keyof typeof COLORS
}>(), {
  color: 'mauve-100',
  hoverColor: 'mauve-500'
})

const stateLocked = ref(false);

const footnoteSpan = ref<HTMLElement | null>(null);
const footnoteBackground = ref<HTMLElement | null>(null);

function handleMouseEnter() {
  setPreview(props.note);
  if (!stateLocked.value) {
    footnoteSpan.value!.style.color = COLORS[props.color];
    footnoteBackground.value!.style.borderColor = COLORS[props.color];
  } else {
    footnoteSpan.value!.style.color = COLORS[props.hoverColor];
    footnoteBackground.value!.style.borderColor = COLORS[props.hoverColor];
  }
}

function handleMouseLeave() {
  clearPreview();
  if (!stateLocked.value) {
    footnoteSpan.value!.style.color = COLORS['subtext-100'];
    footnoteBackground.value!.style.borderColor = COLORS['surface-300'];
  } else {
    footnoteSpan.value!.style.color = COLORS['crust-100'];
    footnoteBackground.value!.style.borderColor = COLORS['crust-100'];
  }
}

function handleClick() {
  if (!stateLocked.value) {
    setFootnote(props.note);
    lock();
  }
  else {
    clearFootnote();
    unlock();
  }
}

function lock() {
  stateLocked.value = true;
  footnoteBackground.value!.style.backgroundColor = COLORS[props.color];
  footnoteSpan.value!.style.color = COLORS[props.hoverColor];
  footnoteBackground.value!.style.borderColor = COLORS[props.hoverColor];
}

function unlock() {
  stateLocked.value = false;
  footnoteBackground.value!.style.backgroundColor = COLORS['surface-300'];
  footnoteSpan.value!.style.color = COLORS['subtext-100'];
  footnoteBackground.value!.style.borderColor = COLORS['surface-300'];
}

watch(footnote, (newVal) => {
  if (newVal !== props.note) {
    unlock();
  }
});
</script>