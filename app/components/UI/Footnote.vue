<template>
  <ClientOnly>
    <span
      ref="footnoteSpan"
      class='cursor-pointer px-0.5 transition-colors duration-300'
      :style="footnoteSpanStyles"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <sup class="relative">
        <div
          class="absolute top-0 bottom-0 rounded-full aspect-square bg-base-100 -z-10 -translate-x-1/2 left-1/2 border-1 transition-border duration-300"
          :style="footnoteBackgroundStyles"
        />
        {{ props.icon }}
      </sup>
    </span>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
const isHovered = ref(false);
const scrollTrigger = ref<ScrollTrigger | null>(null);
const footnoteSpan = ref<HTMLElement | null>(null);

// Use reactive styles instead of direct DOM manipulation
const footnoteSpanStyles = computed(() => {
  if (stateLocked.value) {
    return {
      color: isHovered.value ? COLORS[props.hoverColor] : COLORS['crust-100']
    };
  }
  return {
    color: isHovered.value ? COLORS[props.color] : COLORS['subtext-100']
  };
});

const footnoteBackgroundStyles = computed(() => {
  if (stateLocked.value) {
    return {
      backgroundColor: COLORS[props.color],
      borderColor: isHovered.value ? COLORS[props.hoverColor] : COLORS['crust-100']
    };
  }
  return {
    backgroundColor: COLORS['base-100'],
    borderColor: isHovered.value ? COLORS[props.color] : COLORS['base-100']
  };
});

function handleMouseEnter() {
  setPreview(props.note);
  isHovered.value = true;
}

function handleMouseLeave() {
  clearPreview();
  isHovered.value = false;
}

function handleClick() {
  if (!import.meta.client) return;
  
  if (!stateLocked.value) {
    setFootnote(props.note);
    stateLocked.value = true;
  } else {
    clearFootnote();
    stateLocked.value = false;
  }
}

watch(footnote, (newVal) => {
  if (newVal !== props.note) {
    stateLocked.value = false;
  }
});

onMounted(async () => {
  await nextTick();
  if (!footnoteSpan.value) return;
  scrollTrigger.value = ScrollTrigger.create({
    trigger: footnoteSpan.value,
    start: "top bottom", 
    end: "bottom top", 
    onLeave: () => {
      if (stateLocked.value) {
        clearFootnote();
        stateLocked.value = false;
      }
    },
    onLeaveBack: () => {
      if (stateLocked.value) {
        clearFootnote();
        stateLocked.value = false;
      }
    }
  });
});

onUnmounted(() => {
  scrollTrigger.value?.kill();
});
</script>